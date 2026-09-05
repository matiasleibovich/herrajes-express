import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { config as loadEnv } from "./cargar_env";
import { cacheLimpiar } from "../lib/cache";
import { closePool } from "../lib/db";
import {
	catalogoWebCategorias,
	catalogoWebFichasPorCategoria,
	catalogoWebEsInterno,
	fichaParaDiff,
} from "../lib/catalogo";

loadEnv();
cacheLimpiar();

type FichaDiff = ReturnType<typeof fichaParaDiff>;
type CatDiff = {
	id: number;
	slug: string;
	nombre: string;
	parent: number;
	fichas: FichaDiff[];
};

function casiIgual(a: number, b: number): boolean {
	return Math.abs(a - b) < 0.0001;
}

function compararFicha(php: FichaDiff, ts: FichaDiff, prefijo: string): string[] {
	const errs: string[] = [];
	const campos: (keyof FichaDiff)[] = [
		"categoria_id",
		"agrupador",
		"codigo_referencia",
		"variante",
		"titulo",
	];
	for (const campo of campos) {
		if (String(php[campo]) !== String(ts[campo])) {
			errs.push(prefijo + " " + campo + ": PHP=" + JSON.stringify(php[campo]) + " TS=" + JSON.stringify(ts[campo]));
		}
	}
	for (const lista of ["codigos_unicos", "codigos_producto", "colores", "medidas"] as const) {
		if (JSON.stringify(php[lista]) !== JSON.stringify(ts[lista])) {
			errs.push(prefijo + " " + lista + ": PHP=" + JSON.stringify(php[lista]) + " TS=" + JSON.stringify(ts[lista]));
		}
	}
	if (!casiIgual(Number(php.stock_total), Number(ts.stock_total))) {
		errs.push(prefijo + " stock_total: PHP=" + php.stock_total + " TS=" + ts.stock_total);
	}
	return errs;
}

async function main() {
	const phpPath = resolve(process.cwd(), "scripts/catalogo_export.php");
	const phpRaw = execFileSync("php", [phpPath], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
	const phpCats = JSON.parse(phpRaw) as CatDiff[];
	const tsCats = await catalogoWebCategorias();

	const errores: string[] = [];
	if (phpCats.length !== tsCats.length) {
		errores.push("Cantidad de categorías: PHP=" + phpCats.length + " TS=" + tsCats.length);
	}

	const n = Math.max(phpCats.length, tsCats.length);
	for (let i = 0; i < n; i++) {
		const php = phpCats[i];
		const ts = tsCats[i];
		if (!php || !ts) {
			errores.push("Falta categoría índice " + i);
			continue;
		}
		if (php.id !== ts.id || php.slug !== ts.slug || php.nombre !== ts.nombre) {
			errores.push("Categoría " + i + ": PHP=" + php.id + "/" + php.slug + " TS=" + ts.id + "/" + ts.slug);
		}
		const tsFichas = (await catalogoWebFichasPorCategoria(ts.id)).map(fichaParaDiff);
		if (php.fichas.length !== tsFichas.length) {
			errores.push(php.slug + " cantidad fichas: PHP=" + php.fichas.length + " TS=" + tsFichas.length);
		}
		const m = Math.max(php.fichas.length, tsFichas.length);
		for (let j = 0; j < m; j++) {
			const pf = php.fichas[j];
			const tf = tsFichas[j];
			if (!pf || !tf) {
				errores.push(php.slug + " falta ficha índice " + j);
				continue;
			}
			errores.push(...compararFicha(pf, tf, php.slug + " #" + j + " [" + (pf.agrupador || tf.agrupador) + "]"));
		}
	}

	if (catalogoWebEsInterno("Oferta 10 Cajas") !== true || catalogoWebEsInterno("BISAGRA") !== false) {
		errores.push("catalogoWebEsInterno no distingue oferta");
	}

	if (errores.length > 0) {
		console.error("DIFERENCIAS " + errores.length);
		for (const e of errores) {
			console.error(" - " + e);
		}
		process.exit(1);
	}
	console.log("Diff vacío: " + phpCats.length + " categorías, fichas coinciden una a una.");
	await closePool();
}

void main().catch(async (err: unknown) => {
	console.error(err);
	await closePool();
	process.exit(1);
});
