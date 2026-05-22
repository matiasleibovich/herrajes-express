<?php
// Issue #4: configuración BD y URLs config (herrajes-express)

$HE_DB_HOST = getenv('HE_DB_HOST') ?: 'localhost';
$HE_DB_USER = getenv('HE_DB_USER') ?: 'sostenmutuo';
$HE_DB_PASS = getenv('HE_DB_PASS') ?: '123Sosten';
$HE_DB_NAME = getenv('HE_DB_NAME') ?: 'sostenmutuo';

// Override local (no commitear config.local.php)
if (file_exists(__DIR__ . '/config.local.php')) {
	include_once(__DIR__ . '/config.local.php');
}

$HE_PROJECT_ROOT = dirname(__DIR__);

$host = isset($_SERVER['HTTP_HOST']) ? strtolower($_SERVER['HTTP_HOST']) : '';
$he_https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
	|| (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

// Repo SostenMutuo (imágenes categorías en disco). Override: HE_SOSTENMUTUO_HOME o config.local.php
if (!isset($HE_SOSTENMUTUO_HOME) || $HE_SOSTENMUTUO_HOME === '') {
	$HE_SOSTENMUTUO_HOME = getenv('HE_SOSTENMUTUO_HOME') ?: dirname(__DIR__, 2) . '/sostenmutuo.com.ar';
}
if (!isset($HE_CATEGORIAS_IMAGES_DIR) || $HE_CATEGORIAS_IMAGES_DIR === '') {
	$HE_CATEGORIAS_IMAGES_DIR = rtrim($HE_SOSTENMUTUO_HOME, '/') . '/images/categorias/';
}
$HE_CATEGORIA_IMAGEN_PROXY = false;

if (strpos($host, 'local.') !== false || strpos($host, 'localhost') !== false) {
	$HE_CONFIG_BASE_URL = 'http://local.config.sostenmutuo.com';
	// Mixed content: HTTPS en herrajes-express bloquea imágenes HTTP de config
	if ($he_https) {
		$HE_CATEGORIA_IMAGEN_PROXY = true;
	}
} else {
	$HE_CONFIG_BASE_URL = 'https://config.sostenmutuo.com';
}

$HE_HERRAJES_LEGACY_DIR = $HE_PROJECT_ROOT . '/herrajes';
// Imagen por defecto si falta foto de categoría/producto (logo hasta que se suba la real)
$HE_IMAGEN_FALLBACK = '/images/herrajes_express_logo.svg';
