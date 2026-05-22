<?php
// Issue #4: contenido de listado de productos desde HTML legacy

include_once(__DIR__ . '/config.php');

function categoria_legacy_slug_desde_url($legacy_url) {
	if (preg_match('#/herrajes/([a-z0-9\-]+)\.html#i', $legacy_url, $m)) {
		return strtolower($m[1]);
	}
	return '';
}

function categorias_legacy_slugs_activos() {
	include_once(__DIR__ . '/categorias.php');
	$slugs = array();
	foreach (categorias_herrajes_express_listar() as $cat) {
		if ($cat->legacy_url === '') {
			continue;
		}
		$slug = categoria_legacy_slug_desde_url($cat->legacy_url);
		if ($slug !== '') {
			$slugs[$slug] = true;
		}
	}
	return array_keys($slugs);
}

function legacy_categoria_productos_html($legacy_slug) {
	global $HE_HERRAJES_LEGACY_DIR;

	$legacy_slug = preg_replace('/[^a-z0-9\-]/', '', strtolower($legacy_slug));
	if ($legacy_slug === '') {
		return '';
	}

	$path = $HE_HERRAJES_LEGACY_DIR . '/' . $legacy_slug . '.html';
	if (!is_readable($path)) {
		return '';
	}

	$html = file_get_contents($path);
	if ($html === false || $html === '') {
		return '';
	}

	if (!preg_match('/<ul class="products clearfix">(.*?)<\/ul>/s', $html, $m)) {
		return '';
	}

	$productos = $m[0];
	$productos = preg_replace('/href="(?!https?:\/\/|\/|#|mailto:|tel:)([^"]+)"/i', 'href="/herrajes/$1"', $productos);
	$productos = preg_replace('/src="(?!https?:\/\/|\/|data:)([^"]+)"/i', 'src="/herrajes/$1"', $productos);
	include_once(__DIR__ . '/categorias.php');
	$onerror = he_imagen_fallback_onerror_attr();
	$productos = preg_replace(
		'/(<img\s[^>]*class="[^"]*kw-prodimage-img[^"]*"[^>]*?)\s*\/?>/i',
		'$1' . $onerror . ' />',
		$productos
	);

	return $productos;
}
