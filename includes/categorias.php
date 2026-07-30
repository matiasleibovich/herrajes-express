<?php
// Issue #4: categorías Herrajes desde productos_categorias

include_once(__DIR__ . '/db.php');

function categoria_slug_excepciones() {
	return array(
		'Rodamientos' => 'ruedas',
		'Herrajes Varios' => 'varios',
	);
}

function categoria_nombre_a_slug($nombre, $id = 0) {
	$excepciones = categoria_slug_excepciones();
	if (isset($excepciones[$nombre])) {
		return $excepciones[$nombre];
	}
	$slug = mb_strtolower($nombre, 'UTF-8');
	$slug = strtr($slug, array(
		'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u',
		'Á' => 'a', 'É' => 'e', 'Í' => 'i', 'Ó' => 'o', 'Ú' => 'u',
		'ñ' => 'n', 'Ñ' => 'n',
	));
	$slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
	$slug = trim($slug, '-');
	return $slug;
}

function categoria_legacy_html_path($slug) {
	global $HE_HERRAJES_LEGACY_DIR;
	$path = $HE_HERRAJES_LEGACY_DIR . '/' . $slug . '.html';
	if (file_exists($path)) {
		return '/herrajes/' . $slug . '.html';
	}
	return '';
}

function categoria_config_imagen_remota_url($categoria_id, $slot = 1) {
	global $HE_CONFIG_BASE_URL;
	return rtrim($HE_CONFIG_BASE_URL, '/') . '/images/categorias/' . (int)$categoria_id . '-' . (int)$slot . '.jpg';
}

/**
 * URL de imagen de categoría (slot).
 * Si no hay JPG propio y $parent_id es subcategoría Herrajes (parent ≠ 4),
 * hereda el archivo del parent (ej. Rodamientos 352 para 381–386).
 */
function categoria_imagen_url($categoria_id, $slot = 1, $parent_id = 0) {
	global $HE_CATEGORIA_IMAGEN_PROXY, $HE_CATEGORIAS_IMAGES_DIR, $HE_CONFIG_BASE_URL;

	$categoria_id = (int)$categoria_id;
	$slot = (int)$slot;
	$parent_id = (int)$parent_id;
	$dir = rtrim($HE_CATEGORIAS_IMAGES_DIR, '/');

	$id_archivo = $categoria_id;
	$path = $dir . '/' . $categoria_id . '-' . $slot . '.jpg';
	if (!is_readable($path) && $parent_id > 0 && $parent_id !== 4) {
		$path_parent = $dir . '/' . $parent_id . '-' . $slot . '.jpg';
		if (is_readable($path_parent)) {
			$id_archivo = $parent_id;
			$path = $path_parent;
		}
	}

	$ver = is_readable($path) ? filemtime($path) : 0;

	if (!empty($HE_CATEGORIA_IMAGEN_PROXY)) {
		$url = '/categoria-imagen.php?id=' . $id_archivo . '&slot=' . $slot;
		if ($ver > 0) {
			$url .= '&v=' . $ver;
		}
		return $url;
	}

	$url = rtrim($HE_CONFIG_BASE_URL, '/') . '/images/categorias/' . $id_archivo . '-' . $slot . '.jpg';
	if ($ver > 0) {
		$url .= '?v=' . $ver;
	}
	return $url;
}

function categoria_imagen_fallback_local() {
	global $HE_IMAGEN_FALLBACK;
	return $HE_IMAGEN_FALLBACK;
}

function he_imagen_fallback_onerror_attr() {
	$fb = htmlspecialchars(categoria_imagen_fallback_local(), ENT_QUOTES, 'UTF-8');
	return ' onerror="this.onerror=null;this.classList.add(\'he-imagen-logo-default\');this.src=\'' . $fb . '\'"';
}

function categorias_herrajes_express_listar() {
	$conn = he_db_conexion();
	if (!$conn) {
		return array();
	}

	$sql = "SELECT * FROM productos_categorias
		WHERE listado = 'Herrajes' AND activo = 1
		AND (
			parent = 4
			OR parent IN (
				SELECT id FROM productos_categorias
				WHERE listado = 'Herrajes' AND parent = 4 AND activo = 1
			)
		)
		ORDER BY orden, id";

	$result = mysqli_query($conn, $sql);
	if (!$result) {
		return array();
	}

	$categorias = array();
	while ($row = mysqli_fetch_object($result)) {
		$row->slug = categoria_nombre_a_slug($row->nombre, $row->id);
		$row->url_productos = '/productos/' . $row->slug;
		$row->imagen_url = categoria_imagen_url($row->id, 1, (int)$row->parent);
		$row->legacy_url = categoria_legacy_html_path($row->slug);
		$categorias[] = $row;
	}
	mysqli_free_result($result);

	return $categorias;
}

function categorias_herrajes_express_arbol() {
	$flat = categorias_herrajes_express_listar();
	$por_id = array();

	foreach ($flat as $cat) {
		$cat->subcategorias = array();
		$por_id[(int)$cat->id] = $cat;
	}

	$raiz = array();
	foreach ($flat as $cat) {
		$parent = (int)$cat->parent;
		if ($parent === 4) {
			$raiz[] = $cat;
		} elseif (isset($por_id[$parent])) {
			$por_id[$parent]->subcategorias[] = $cat;
		}
	}

	return $raiz;
}

function categoria_por_slug($slug) {
	$categorias = categorias_herrajes_express_listar();
	foreach ($categorias as $cat) {
		if ($cat->slug === $slug) {
			return $cat;
		}
	}
	return null;
}

function categoria_redirect_legacy_url($slug) {
	$categoria = categoria_por_slug($slug);
	if (!$categoria) {
		return '';
	}
	if ($categoria->legacy_url !== '') {
		return $categoria->legacy_url;
	}
	// Fallback: slug del parent si es subcategoría
	$conn = he_db_conexion();
	if ($conn && (int)$categoria->parent > 0 && (int)$categoria->parent !== 4) {
		$parent_id = (int)$categoria->parent;
		$res = mysqli_query($conn, "SELECT nombre FROM productos_categorias WHERE id = $parent_id LIMIT 1");
		if ($res && $row = mysqli_fetch_object($res)) {
			$parent_slug = categoria_nombre_a_slug($row->nombre);
			$legacy = categoria_legacy_html_path($parent_slug);
			mysqli_free_result($res);
			return $legacy;
		}
	}
	return '';
}
