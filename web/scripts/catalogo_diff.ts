import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { config as loadEnv } from "./cargar_env";
import { cacheLimpiar } from "../lib/cache";
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

function compararFicha(php: FichaDiff, api: FichaDiff, prefijo: string): string[] {
	const errs: string[] = [];
	const campos: (keyof FichaDiff)[] = [
		"categoria_id",
		"agrupador",
		"codigo_referencia",
		"variante",
		"titulo",
	];
	for (const campo of campos) {
		if (String(php[campo]) !== String(api[campo])) {
			errs.push(prefijo + " " + campo + ": PHP=" + JSON.stringify(php[campo]) + " API=" + JSON.stringify(api[campo]));
		}
	}
	for (const lista of ["codigos_unicos", "codigos_producto", "colores", "medidas"] as const) {
		if (JSON.stringify(php[lista]) !== JSON.stringify(api[lista])) {
			errs.push(prefijo + " " + lista + ": PHP=" + JSON.stringify(php[lista]) + " API=" + JSON.stringify(api[lista]));
		}
	}
	if (!casiIgual(Number(php.stock_total), Number(api.stock_total))) {
		errs.push(prefijo + " stock_total: PHP=" + php.stock_total + " API=" + api.stock_total);
	}
	return errs;
}

async function main() {
	const phpPath = resolve(process.cwd(), "scripts/catalogo_export.php");
	const phpRaw = execFileSync("php", [phpPath], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
	const phpCats = JSON.parse(phpRaw) as CatDiff[];
	const apiCats = await catalogoWebCategorias();

	const errores: string[] = [];
	if (phpCats.length !== apiCats.length) {
		errores.push("Cantidad de categorías: PHP=" + phpCats.length + " API=" + apiCats.length);
	}

	const n = Math.max(phpCats.length, apiCats.length);
	for (let i = 0; i < n; i++) {
		const php = phpCats[i];
		const api = apiCats[i];
		if (!php || !api) {
			errores.push("Falta categoría índice " + i);
			continue;
		}
		if (php.id !== api.id || php.slug !== api.slug || php.nombre !== api.nombre) {
			errores.push("Categoría " + i + ": PHP=" + php.id + "/" + php.slug + " API=" + api.id + "/" + api.slug);
		}
		const apiFichas = (await catalogoWebFichasPorCategoria(api.id)).map(fichaParaDiff);
		if (php.fichas.length !== apiFichas.length) {
			errores.push(php.slug + " cantidad fichas: PHP=" + php.fichas.length + " API=" + apiFichas.length);
		}
		const m = Math.max(php.fichas.length, apiFichas.length);
		for (let j = 0; j < m; j++) {
			const pf = php.fichas[j];
			const af = apiFichas[j];
			if (!pf || !af) {
				errores.push(php.slug + " falta ficha índice " + j);
				continue;
			}
			errores.push(...compararFicha(pf, af, php.slug + " #" + j + " [" + (pf.agrupador || af.agrupador) + "]"));
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
	console.log("Diff vacío: " + phpCats.length + " categorías, fichas coinciden una a una (helper PHP vs API).");
}

void main().catch((err: unknown) => {
	console.error(err);
	process.exit(1);
});
