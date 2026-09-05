<?php
// Issue #4: configuración BD y URLs config (herrajes-express)

$HE_PROJECT_ROOT = dirname(__DIR__);

$host = isset($_SERVER['HTTP_HOST']) ? strtolower($_SERVER['HTTP_HOST']) : '';
$he_https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
	|| (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

$he_es_local = (strpos($host, 'local.') !== false || strpos($host, 'localhost') !== false);

// Override local de paths (sin passwords — ver .cursor/rules/credenciales-bd.mdc)
if (file_exists(__DIR__ . '/config.local.php')) {
	include_once(__DIR__ . '/config.local.php');
}

// Credenciales BD: sólo en DB_connect.php (mismo archivo que el ERP, no versionado).
// Ese archivo hace die() si $DB_config no está seteado antes del include.
$DB_config = $he_es_local ? 'DEV.1' : 'LIVE.1';

if (file_exists(__DIR__ . '/DB_connect.php')) {
	include_once(__DIR__ . '/DB_connect.php');
}

// Alias para el resto del proyecto (db.php)
$HE_DB_HOST = isset($db_hostname) ? $db_hostname : '';
$HE_DB_USER = isset($db_username) ? $db_username : '';
$HE_DB_PASS = isset($db_password) ? $db_password : '';
$HE_DB_NAME = isset($db_name) ? $db_name : '';

// Repo SostenMutuo (imágenes categorías en disco).
// Orden: ya seteado / env HE_SOSTENMUTUO_HOME / config.local.php / sibling con images/categorias/
if (!isset($HE_SOSTENMUTUO_HOME) || $HE_SOSTENMUTUO_HOME === '') {
	$env_home = getenv('HE_SOSTENMUTUO_HOME');
	if ($env_home !== false && $env_home !== '') {
		$HE_SOSTENMUTUO_HOME = $env_home;
	}
}
if (!isset($HE_SOSTENMUTUO_HOME) || $HE_SOSTENMUTUO_HOME === '') {
	$parent_dir = dirname(__DIR__, 2);
	$candidatos = array(
		$parent_dir . '/sostenmutuo.com.ar',
		$parent_dir . '/sostenmutuo.com',
	);
	$HE_SOSTENMUTUO_HOME = '';
	foreach ($candidatos as $cand) {
		$imgs = rtrim($cand, '/') . '/images/categorias';
		if (is_dir($cand) && is_dir($imgs)) {
			$HE_SOSTENMUTUO_HOME = $cand;
			break;
		}
	}
	if ($HE_SOSTENMUTUO_HOME === '') {
		error_log('HE: no se encontró repo SostenMutuo con images/categorias/ (probados: ' . implode(', ', $candidatos) . '). Setear HE_SOSTENMUTUO_HOME o includes/config.local.php');
		$HE_SOSTENMUTUO_HOME = $parent_dir . '/sostenmutuo.com.ar';
	}
}
if (!isset($HE_CATEGORIAS_IMAGES_DIR) || $HE_CATEGORIAS_IMAGES_DIR === '') {
	$HE_CATEGORIAS_IMAGES_DIR = rtrim($HE_SOSTENMUTUO_HOME, '/') . '/images/categorias/';
}
if (!isset($HE_PRODUCTOS_IMAGES_DIR) || $HE_PRODUCTOS_IMAGES_DIR === '') {
	$HE_PRODUCTOS_IMAGES_DIR = rtrim($HE_SOSTENMUTUO_HOME, '/') . '/images/productos/';
}
$HE_CATEGORIA_IMAGEN_PROXY = false;
$HE_PRODUCTO_IMAGEN_PROXY = false;

if ($he_es_local) {
	$HE_CONFIG_BASE_URL = 'http://local.config.sostenmutuo.com';
	// Mixed content: HTTPS en herrajes-express bloquea imágenes HTTP de config
	if ($he_https) {
		$HE_CATEGORIA_IMAGEN_PROXY = true;
		$HE_PRODUCTO_IMAGEN_PROXY = true;
	}
} else {
	$HE_CONFIG_BASE_URL = 'https://config.sostenmutuo.com';
}

$HE_HERRAJES_LEGACY_DIR = $HE_PROJECT_ROOT . '/herrajes';
// Imagen por defecto si falta foto de categoría/producto (logo hasta que se suba la real)
$HE_IMAGEN_FALLBACK = '/images/herrajes_express_logo.svg';
