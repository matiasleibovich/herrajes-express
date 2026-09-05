<?php
// Issue #8: proxy same-origin de imágenes de productos config (evita mixed content HTTPS→HTTP en local)

include_once(__DIR__ . '/includes/config.php');

$codigo = isset($_GET['codigo']) ? trim((string)$_GET['codigo']) : '';
$slot = isset($_GET['slot']) ? (int)$_GET['slot'] : 1;

if ($codigo === '' || !preg_match('/^[A-Za-z0-9._-]+$/', $codigo) || $slot <= 0 || $slot > 19) {
	header('HTTP/1.0 404 Not Found');
	exit;
}

$dir = realpath(rtrim($HE_PRODUCTOS_IMAGES_DIR, '/'));
if ($dir === false || !is_dir($dir)) {
	header('HTTP/1.0 404 Not Found');
	exit;
}

$path = $dir . DIRECTORY_SEPARATOR . $codigo . '-' . $slot . '.jpg';
$real = realpath($path);
if ($real === false || strpos($real, $dir . DIRECTORY_SEPARATOR) !== 0 || !is_readable($real)) {
	header('HTTP/1.0 404 Not Found');
	exit;
}

header('Content-Type: image/jpeg');
header('Cache-Control: public, max-age=3600, must-revalidate');
header('ETag: "' . md5($real . filemtime($real) . filesize($real)) . '"');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($real)) . ' GMT');
readfile($real);
