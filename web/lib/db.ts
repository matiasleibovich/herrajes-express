import mysql from "mysql2/promise";
import { dbConfig } from "./env";

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
	if (pool) {
		return pool;
	}
	const cfg = dbConfig();
	if (!cfg.user || !cfg.database) {
		throw new Error("Faltan HE_DB_USER / HE_DB_NAME para conectar a MySQL");
	}
	pool = mysql.createPool({
		host: cfg.host,
		user: cfg.user,
		password: cfg.password,
		database: cfg.database,
		charset: "utf8mb4",
		waitForConnections: true,
		connectionLimit: 8,
		namedPlaceholders: true,
	});
	return pool;
}

export async function queryRows<T extends mysql.RowDataPacket>(sql: string, params: unknown[] = []): Promise<T[]> {
	const [rows] = await getPool().query<T[]>(sql, params);
	return rows;
}

export async function closePool(): Promise<void> {
	if (pool) {
		await pool.end();
		pool = null;
	}
}
