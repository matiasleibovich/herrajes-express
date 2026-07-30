<?php
// Plantilla — NO poner passwords reales. Copiar a DB_connect.php (gitignored)
// o hacer symlink al includes/DB_connect.php del ERP SostenMutuo.
// Ver .cursor/rules/credenciales-bd.mdc

global $db_name;

switch ($DB_config) {
	case 'DEV.1':
		$db_username = 'sostenmutuo';
		$db_hostname = 'localhost';
		$db_password = 'CHANGE_ME';
		$db_name = 'sostenmutuo';
		$db_log_name = 'sostenmutuo_logs';
		$db_agip = 'agip_padron';
		break;

	case 'DEV.2':
		$db_username = 'sostenmutuo';
		$db_hostname = 'localhost';
		$db_password = 'CHANGE_ME';
		$db_name = 'sostenmutuo_dev';
		$db_log_name = 'sostenmutuo_logs';
		$db_agip = 'agip_padron';
		break;

	case 'LIVE.1':
		$db_username = 'sostenmutuo';
		$db_hostname = 'localhost';
		$db_password = 'CHANGE_ME';
		$db_name = 'sostenmutuo';
		$db_log_name = 'sostenmutuo_logs';
		$db_agip = 'agip_padron';
		break;

	case 'LIVE.2':
		$db_username = 'sostenmutuo_dev';
		$db_hostname = 'localhost';
		$db_password = 'CHANGE_ME';
		$db_name = 'sostenmutuo_dev';
		$db_log_name = 'sostenmutuo_logs';
		$db_agip = 'agip_padron';
		break;

	default:
		die;
		break;
}

// En el ERP real este archivo también abre $conn / $conn2 / $conn_agip.
// Preferir symlink o copia del DB_connect.php del ERP en lugar de rellenar este sample.
