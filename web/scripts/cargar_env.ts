import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export function config(): void {
	const path = resolve(process.cwd(), ".env.local");
	if (!existsSync(path)) {
		return;
	}
	const texto = readFileSync(path, "utf8");
	for (const linea of texto.split("\n")) {
		const t = linea.trim();
		if (!t || t.startsWith("#")) {
			continue;
		}
		const eq = t.indexOf("=");
		if (eq < 1) {
			continue;
		}
		const clave = t.slice(0, eq).trim();
		const valor = t.slice(eq + 1).trim();
		if (process.env[clave] === undefined) {
			process.env[clave] = valor;
		}
	}
}
