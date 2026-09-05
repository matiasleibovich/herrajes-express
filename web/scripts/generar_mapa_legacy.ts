import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { config as loadEnv } from "./cargar_env";
import { closePool } from "../lib/db";
import { categorias, claveFicha, fichasPorCategoria, type FichaWeb } from "../lib/catalogo";
import { legacyDir, shopImagesDir } from "../lib/env";

loadEnv();

const STOP = new Set(["de", "el", "la", "los", "las", "para", "con", "sin", "x", "unidades", "unidad", "mm", "el", "par"]);

function textoBase(texto: string): string {
	return texto
		.toLowerCase()
		.replace(/\bdos\b/g, "2")
		.replace(/\btres\b/g, "3")
		.normalize("NFD")
		.replace(/\p{M}/gu, "");
}

function normalizar(texto: string): string {
	return textoBase(texto).replace(/[^a-z0-9]+/g, "");
}

function tokens(texto: string): string[] {
	return textoBase(texto)
		.replace(/[^a-z0-9]+/g, " ")
		.split(" ")
		.filter((t) => t.length > 1 && !STOP.has(t));
}

type ParLegacy = { titulo: string; rel: string; scoreBase: number };

function extraerGrillaLegacy(html: string): ParLegacy[] {
	const pares: ParLegacy[] = [];
	const bloqueRe = /<li class="product">([\s\S]*?)<\/li>/gi;
	let bloque: RegExpExecArray | null;
	while ((bloque = bloqueRe.exec(html)) !== null) {
		const chunk = bloque[1];
		const img = chunk.match(/src="([^"]+_shop\/[^"]+)"/i);
		const titulo = chunk.match(/<h3 class="kw-details-title">\s*([\s\S]*?)<\/h3>/i);
		if (!img || !titulo) {
			continue;
		}
		const src = img[1].replace(/\\/g, "/");
		const idx = src.indexOf("_shop/");
		if (idx < 0) {
			continue;
		}
		const rel = src.slice(idx + "_shop/".length);
		const tituloLimpio = titulo[1].replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
		pares.push({
			titulo: tituloLimpio,
			rel,
			scoreBase: /\/325x325\//.test(rel) ? 20 : 10,
		});
	}
	return pares;
}

function listarImagenesShop(raiz: string): string[] {
	const out: string[] = [];
	function walk(dir: string) {
		if (!existsSync(dir)) {
			return;
		}
		for (const nombre of readdirSync(dir).sort()) {
			if (nombre.startsWith(".")) {
				continue;
			}
			const full = join(dir, nombre);
			const st = statSync(full);
			if (st.isDirectory()) {
				walk(full);
			} else if (/\.(jpe?g|webp|png)$/i.test(nombre)) {
				out.push(relative(raiz, full).replace(/\\/g, "/"));
			}
		}
	}
	walk(raiz);
	return out.sort();
}

function listarHtmlCategoria(htmlRoot: string): string[] {
	if (!existsSync(htmlRoot)) {
		return [];
	}
	return readdirSync(htmlRoot)
		.filter((n) => n.endsWith(".html"))
		.sort()
		.map((n) => join(htmlRoot, n));
}

function scoreMatch(ficha: FichaWeb, candidato: { titulo?: string; rel: string; scoreBase?: number }): number {
	const varN = normalizar(ficha.variante);
	const agrN = normalizar(ficha.agrupador);
	const fileN = normalizar((candidato.rel.replace(/\.[^.]+$/, "").split("/").pop() || ""));
	const titleN = normalizar(candidato.titulo || "");
	let score = candidato.scoreBase ?? 0;
	if (titleN && titleN === varN) {
		score += 120;
	} else if (titleN && varN && (titleN.includes(varN) || varN.includes(titleN))) {
		score += 70;
	} else {
		const tFicha = new Set(tokens(ficha.variante));
		const tCand = new Set(tokens((candidato.titulo || "") + " " + (candidato.rel.replace(/\.[^.]+$/, "").split("/").pop() || "")));
		let inter = 0;
		for (const t of tFicha) {
			if (tCand.has(t)) {
				inter += 1;
			}
		}
		if (tFicha.size > 0) {
			score += Math.round((inter / tFicha.size) * 50);
		}
	}
	if (agrN && fileN.includes(agrN)) {
		score += 40;
	}
	if (varN && fileN && (fileN.includes(varN) || varN.includes(fileN))) {
		score += 30;
	}
	if (/\/325x325\//.test(candidato.rel)) {
		score += 5;
	}
	return score;
}

function mejorMatch(ficha: FichaWeb, pares: ParLegacy[], archivos: string[]): string | null {
	const candidatos: { rel: string; score: number }[] = [];
	for (const par of pares) {
		candidatos.push({ rel: par.rel, score: scoreMatch(ficha, par) });
	}
	for (const rel of archivos) {
		candidatos.push({ rel, score: scoreMatch(ficha, { rel, scoreBase: 0 }) });
	}
	candidatos.sort((a, b) => {
		if (b.score !== a.score) {
			return b.score - a.score;
		}
		return a.rel.localeCompare(b.rel);
	});
	const top = candidatos[0];
	if (!top || top.score < 45) {
		return null;
	}
	return top.rel;
}

async function main() {
	const shop = shopImagesDir();
	const htmlRoot = legacyDir();
	const cats = await categorias();
	const mapa: Record<string, string> = {};
	const todasShop = listarImagenesShop(shop);
	const pares: ParLegacy[] = [];
	for (const htmlPath of listarHtmlCategoria(htmlRoot)) {
		pares.push(...extraerGrillaLegacy(readFileSync(htmlPath, "utf8")));
	}

	for (const cat of cats) {
		const fichas = await fichasPorCategoria(cat.id);
		for (const ficha of fichas) {
			const rel = mejorMatch(ficha, pares, todasShop);
			if (rel) {
				mapa[claveFicha(ficha)] = rel;
			}
		}
	}

	const claves = Object.keys(mapa).sort();
	const ordenado: Record<string, string> = {};
	for (const k of claves) {
		ordenado[k] = mapa[k];
	}

	const dest = resolve(process.cwd(), "data", "imagenes_legacy.json");
	writeFileSync(dest, JSON.stringify(ordenado, null, "\t") + "\n", "utf8");
	console.log("Mapa escrito: " + dest + " (" + claves.length + " fichas)");
	await closePool();
}

void main().catch(async (err: unknown) => {
	console.error(err);
	await closePool();
	process.exit(1);
});
