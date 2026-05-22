<?php
// Issue #4: proxy same-origin de imágenes config (evita mixed content HTTPS→HTTP en local)

include_once(__DIR__ . '/includes/config.php');

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$slot = isset($_GET['slot']) ? (int)$_GET['slot'] : 1;

if ($id <= 0 || $slot <= 0 || $slot > 5) {
	header('HTTP/1.0 404 Not Found');
	exit;
}

$path = rtrim($HE_CATEGORIAS_IMAGES_DIR, '/') . '/' . $id . '-' . $slot . '.jpg';

if (!is_readable($path)) {
	header('HTTP/1.0 404 Not Found');
	exit;
}

header('Content-Type: image/jpeg');
header('Cache-Control: public, max-age=3600, must-revalidate');
header('ETag: "' . md5($path . filemtime($path) . filesize($path)) . '"');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($path)) . ' GMT');
readfile($path);
