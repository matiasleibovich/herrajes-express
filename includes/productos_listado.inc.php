<?php
// Issue #8: listado de productos en stock por categoría (agrupa variantes de color)

include_once(__DIR__ . '/categorias.php');

/**
 * IDs de la categoría actual + subcategorías directas (árbol HE: parent=4 o hijos).
 */
function productos_categoria_ids_con_descendientes($categoria) {
	$ids = array();
	if (!$categoria || !isset($categoria->id)) {
		return $ids;
	}
	$id = (int)$categoria->id;
	$ids[] = $id;

	$arbol = categorias_herrajes_express_arbol();
	foreach ($arbol as $raiz) {
		if ((int)$raiz->id === $id && !empty($raiz->subcategorias)) {
			foreach ($raiz->subcategorias as $sub) {
				$ids[] = (int)$sub->id;
			}
			break;
		}
	}

	return array_values(array_unique($ids));
}

/**
 * Productos con stock físico > 0 en las categorías dadas.
 * Incluye discontinuos con stock (activo=0 OR discontinuo=1) según plan #8.
 *
 * @return array<object>
 */
function productos_en_stock_por_categorias(array $categoria_ids) {
	$categoria_ids = array_values(array_filter(array_map('intval', $categoria_ids)));
	if (empty($categoria_ids)) {
		return array();
	}

	$conn = he_db_conexion();
	if (!$conn) {
		return array();
	}

	$placeholders = implode(',', array_fill(0, count($categoria_ids), '?'));
	$sql = "SELECT p.id, p.codigo_producto, p.codigo_unico, p.titulo, p.color,
			p.discontinuo, p.activo, p.categoria_id, sg.stock
		FROM productos p
		INNER JOIN stock_general sg ON sg.codigo_unico = p.codigo_unico
		WHERE p.categoria_id IN ($placeholders)
			AND (p.activo = 1 OR p.discontinuo = 1)
			AND sg.stock > 0
		ORDER BY p.codigo_producto, p.titulo, p.codigo_unico";

	$stmt = mysqli_prepare($conn, $sql);
	if (!$stmt) {
		error_log('HE productos_en_stock_por_categorias prepare: ' . mysqli_error($conn));
		return array();
	}

	$types = str_repeat('i', count($categoria_ids));
	mysqli_stmt_bind_param($stmt, $types, ...$categoria_ids);

	if (!mysqli_stmt_execute($stmt)) {
		error_log('HE productos_en_stock_por_categorias execute: ' . mysqli_stmt_error($stmt));
		mysqli_stmt_close($stmt);
		return array();
	}

	$result = mysqli_stmt_get_result($stmt);
	$rows = array();
	if ($result) {
		while ($row = mysqli_fetch_object($result)) {
			$rows[] = $row;
		}
		mysqli_free_result($result);
	}
	mysqli_stmt_close($stmt);

	return $rows;
}

/**
 * Título sin el valor exacto de color (preferir sufijo).
 */
function productos_titulo_base($titulo, $color) {
	$titulo = trim((string)$titulo);
	$color = trim((string)$color);
	if ($titulo === '' || $color === '') {
		return $titulo;
	}

	$pattern = '/\s+' . preg_quote($color, '/') . '\s*$/iu';
	$base = preg_replace($pattern, '', $titulo);
	if ($base !== null && $base !== $titulo) {
		return trim($base);
	}

	// Si el color no es sufijo, quitar ocurrencia exacta como palabra
	$pattern_word = '/\b' . preg_quote($color, '/') . '\b/iu';
	$base = preg_replace($pattern_word, '', $titulo);
	if ($base === null) {
		return $titulo;
	}
	$base = preg_replace('/\s{2,}/u', ' ', $base);
	return trim($base);
}

/**
 * Agrupa filas BD en cards web: colapsa solo variantes de color del mismo
 * codigo_producto + título base.
 *
 * @param array<object> $rows
 * @return array<object> cada item: codigo, titulo, imagen_url, whatsapp_url, codigos_unicos
 */
function productos_agrupar_para_web(array $rows) {
	$grupos = array();

	foreach ($rows as $row) {
		$codigo_producto = trim((string)$row->codigo_producto);
		$codigo_unico = trim((string)$row->codigo_unico);
		$titulo = trim((string)$row->titulo);
		$color = trim((string)$row->color);
		$titulo_base = productos_titulo_base($titulo, $color);
		if ($titulo_base === '') {
			$titulo_base = $titulo;
		}

		$key = mb_strtoupper($codigo_producto . '|' . $titulo_base, 'UTF-8');
		if (!isset($grupos[$key])) {
			$grupos[$key] = array(
				'codigo_producto' => $codigo_producto,
				'titulo_base' => $titulo_base,
				'filas' => array(),
				'colores' => array(),
			);
		}
		$grupos[$key]['filas'][] = $row;
		if ($color !== '') {
			$grupos[$key]['colores'][mb_strtoupper($color, 'UTF-8')] = $color;
		}
	}

	$cards = array();
	foreach ($grupos as $grupo) {
		$filas = $grupo['filas'];
		$colores = $grupo['colores'];
		$collapse_colores = (count($filas) >= 2 && count($colores) >= 2);

		if ($collapse_colores) {
			$codigos_unicos = array();
			foreach ($filas as $f) {
				$codigos_unicos[] = trim((string)$f->codigo_unico);
			}
			$codigo = $grupo['codigo_producto'];
			$titulo = $grupo['titulo_base'];
			$card = (object)array(
				'codigo' => $codigo,
				'titulo' => $titulo,
				'codigos_unicos' => $codigos_unicos,
				'imagen_url' => producto_imagen_url($grupo['codigo_producto'], $codigos_unicos),
				'whatsapp_url' => producto_whatsapp_url($codigo, $titulo),
			);
			$cards[] = $card;
			continue;
		}

		foreach ($filas as $f) {
			$codigo = trim((string)$f->codigo_unico);
			$titulo = trim((string)$f->titulo);
			$color = trim((string)$f->color);
			// Una sola variante con color: mostrar título sin color si se puede
			if ($color !== '') {
				$titulo_sin = productos_titulo_base($titulo, $color);
				if ($titulo_sin !== '') {
					$titulo = $titulo_sin;
				}
			}
			$card = (object)array(
				'codigo' => $codigo,
				'titulo' => $titulo,
				'codigos_unicos' => array($codigo),
				'imagen_url' => producto_imagen_url(trim((string)$f->codigo_producto), array($codigo)),
				'whatsapp_url' => producto_whatsapp_url($codigo, $titulo),
			);
			$cards[] = $card;
		}
	}

	return $cards;
}

/**
 * Sanitiza código de producto para nombre de archivo / query.
 */
function producto_imagen_codigo_sanitizado($codigo) {
	$codigo = trim((string)$codigo);
	if ($codigo === '' || !preg_match('/^[A-Za-z0-9._-]+$/', $codigo)) {
		return '';
	}
	return $codigo;
}

/**
 * Path absoluto legible de images/productos/{codigo}-{slot}.jpg o ''.
 */
function producto_imagen_path_legible($codigo, $slot = 1) {
	global $HE_PRODUCTOS_IMAGES_DIR;

	$codigo = producto_imagen_codigo_sanitizado($codigo);
	$slot = (int)$slot;
	if ($codigo === '' || $slot <= 0) {
		return '';
	}

	$path = rtrim($HE_PRODUCTOS_IMAGES_DIR, '/') . '/' . $codigo . '-' . $slot . '.jpg';
	return is_readable($path) ? $path : '';
}

/**
 * URL pública de imagen de producto (proxy local HTTPS o config remoto).
 * Orden: codigo_producto-1 → primer codigo_unico-1 existente → logo fallback.
 */
function producto_imagen_url($codigo_producto, array $codigos_unicos = array(), $slot = 1) {
	global $HE_PRODUCTO_IMAGEN_PROXY, $HE_CONFIG_BASE_URL, $HE_IMAGEN_FALLBACK;

	$slot = (int)$slot;
	$candidatos = array();
	$cp = producto_imagen_codigo_sanitizado($codigo_producto);
	if ($cp !== '') {
		$candidatos[] = $cp;
	}
	foreach ($codigos_unicos as $cu) {
		$cu = producto_imagen_codigo_sanitizado($cu);
		if ($cu !== '' && !in_array($cu, $candidatos, true)) {
			$candidatos[] = $cu;
		}
	}

	$codigo_archivo = '';
	$path = '';
	foreach ($candidatos as $codigo) {
		$p = producto_imagen_path_legible($codigo, $slot);
		if ($p !== '') {
			$codigo_archivo = $codigo;
			$path = $p;
			break;
		}
	}

	if ($codigo_archivo === '') {
		return $HE_IMAGEN_FALLBACK;
	}

	$ver = filemtime($path);

	if (!empty($HE_PRODUCTO_IMAGEN_PROXY)) {
		$url = '/producto-imagen.php?codigo=' . rawurlencode($codigo_archivo) . '&slot=' . $slot;
		if ($ver > 0) {
			$url .= '&v=' . $ver;
		}
		return $url;
	}

	$url = rtrim($HE_CONFIG_BASE_URL, '/') . '/images/productos/' . rawurlencode($codigo_archivo) . '-' . $slot . '.jpg';
	if ($ver > 0) {
		$url .= '?v=' . $ver;
	}
	return $url;
}

function producto_whatsapp_url($codigo, $titulo) {
	$texto = 'Hola! Quiero informarme sobre ' . trim((string)$codigo) . ' - ' . trim((string)$titulo);
	return 'https://api.whatsapp.com/send?phone=541144485714&text=' . rawurlencode($texto);
}

/**
 * Listado listo para la grilla de una categoría (objeto de categorias_herrajes).
 *
 * @return array<object>
 */
function productos_listado_web_por_categoria($categoria) {
	$ids = productos_categoria_ids_con_descendientes($categoria);
	$rows = productos_en_stock_por_categorias($ids);
	return productos_agrupar_para_web($rows);
}
