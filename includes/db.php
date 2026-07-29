<?php
// Issue #4: conexión mysqli a sostenmutuo

include_once(__DIR__ . '/config.php');

function he_db_conexion() {
	global $HE_DB_HOST, $HE_DB_USER, $HE_DB_PASS, $HE_DB_NAME;

	static $conn = null;
	if ($conn !== null) {
		return $conn;
	}

	// DB_connect.php ya abrió $conn sobre $db_name: reusarla en vez de abrir otra
	if (isset($GLOBALS['conn']) && $GLOBALS['conn'] instanceof mysqli) {
		$conn = $GLOBALS['conn'];
		return $conn;
	}

	// PHP 8+ lanza mysqli_sql_exception en vez de devolver false
	try {
		$conn = @mysqli_connect($HE_DB_HOST, $HE_DB_USER, $HE_DB_PASS, $HE_DB_NAME);
	} catch (mysqli_sql_exception $e) {
		error_log('he_db_conexion: ' . $e->getMessage());
		$conn = null;
	}
	if (!$conn) {
		$conn = null;
		return null;
	}
	mysqli_set_charset($conn, 'utf8mb4');
	return $conn;
}
