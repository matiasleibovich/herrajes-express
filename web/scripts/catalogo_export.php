<?php
// Exporta el catalogo canónico del ERP para el diferencial PHP vs TypeScript.

error_reporting(E_ALL);
ini_set('display_errors', 'stderr');

$heRoot = dirname(__DIR__, 2);
if (!is_file($heRoot . '/includes/config.php')) {
	fwrite(STDERR, "No se encontró includes/config.php en $heRoot\n");
	exit(1);
}

$_SERVER['HTTP_HOST'] = isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST'] !== ''
	? $_SERVER['HTTP_HOST']
	: 'local.herrajes-express.com';

require $heRoot . '/includes/config.php';
require $heRoot . '/includes/db.php';

$conn = he_db_conexion();
if (!$conn) {
	fwrite(STDERR, "No hay conexión MySQL (includes/DB_connect.php)\n");
	exit(1);
}

if (!class_exists('DAO')) {
	class DAO {
		public static function GetBySQL($sql) {
			$conn = he_db_conexion();
			$res = mysqli_query($conn, $sql);
			if (!$res) {
				throw new Exception(mysqli_error($conn));
			}
			$out = array();
			while ($row = mysqli_fetch_object($res)) {
				$out[] = $row;
			}
			return $out;
		}
	}
}

if (!isset($HOMEDIR) || $HOMEDIR === '') {
	$HOMEDIR = getenv('HE_SOSTENMUTUO_HOME');
	if ($HOMEDIR === false || $HOMEDIR === '') {
		$HOMEDIR = dirname($heRoot) . '/sostenmutuo.com.ar';
	}
}

$erpHelper = rtrim($HOMEDIR, '/') . '/common/catalogo_web.inc.php';
if (!is_file($erpHelper)) {
	fwrite(STDERR, "No se encontró catalogo_web.inc.php en $erpHelper\n");
	exit(1);
}
require $erpHelper;

$cats = catalogo_web_categorias();
$out = array();
foreach ($cats as $cat) {
	$fichas = catalogo_web_fichas_por_categoria((int)$cat->id);
	$serializadas = array();
	foreach ($fichas as $f) {
		$serializadas[] = array(
			'categoria_id' => (int)$f->categoria_id,
			'agrupador' => (string)$f->agrupador,
			'codigo_referencia' => (string)$f->codigo_referencia,
			'variante' => (string)$f->variante,
			'titulo' => (string)$f->titulo,
			'codigos_unicos' => array_values($f->codigos_unicos),
			'codigos_producto' => array_values($f->codigos_producto),
			'colores' => array_values($f->colores),
			'medidas' => array_values($f->medidas),
			'stock_total' => (float)$f->stock_total,
		);
	}
	$out[] = array(
		'id' => (int)$cat->id,
		'slug' => (string)$cat->slug,
		'nombre' => (string)$cat->nombre,
		'parent' => (int)$cat->parent,
		'fichas' => $serializadas,
	);
}

echo json_encode($out, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
