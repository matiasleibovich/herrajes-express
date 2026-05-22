<?php
// Issue #4: conexión mysqli a sostenmutuo

include_once(__DIR__ . '/config.php');

function he_db_conexion() {
	global $HE_DB_HOST, $HE_DB_USER, $HE_DB_PASS, $HE_DB_NAME;

	static $conn = null;
	if ($conn !== null) {
		return $conn;
	}

	$conn = @mysqli_connect($HE_DB_HOST, $HE_DB_USER, $HE_DB_PASS, $HE_DB_NAME);
	if (!$conn) {
		return null;
	}
	mysqli_set_charset($conn, 'utf8mb4');
	return $conn;
}
