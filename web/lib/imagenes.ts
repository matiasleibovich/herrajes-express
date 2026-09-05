import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";
import type { CategoriaWeb, FichaWeb } from "./catalogo";
import { claveFicha } from "./catalogo";
import { shopImagesDir } from "./env";
import { imagenProxyUrl } from "./imagenProxy";
import { LOGO_FALLBACK } from "./imagenes_publicas";

export const NOMBRE_SEGURO = /^[A-Za-z0-9._-]+$/;
export { LOGO_FALLBACK, logoFallback } from "./imagenes_publicas";

type MapaLegacy = Record<string, string>;

let mapaCache: MapaLegacy | null = null;

export function cargarMapaLegacy(): MapaLegacy {
	if (mapaCache) {
		return mapaCache;
	}
	const path = resolve(process.cwd(), "data", "imagenes_legacy.json");
	if (!existsSync(path)) {
		mapaCache = {};
		return mapaCache;
	}
	mapaCache = JSON.parse(readFileSync(path, "utf8")) as MapaLegacy;
	return mapaCache;
}

export function resolverSeguro(raiz: string, relativo: string): string | null {
	const partes = relativo.split(/[/\\]+/).filter(Boolean);
	if (partes.length === 0) {
		return null;
	}
	for (const parte of partes) {
		if (parte === "." || parte === ".." || !NOMBRE_SEGURO.test(parte)) {
			return null;
		}
	}
	const raizAbs = resolve(raiz);
	const candidato = resolve(raizAbs, ...partes);
	if (candidato !== raizAbs && !candidato.startsWith(raizAbs + sep)) {
		return null;
	}
	if (!existsSync(candidato)) {
		return null;
	}
	try {
		if (!statSync(candidato).isFile()) {
			return null;
		}
	} catch {
		return null;
	}
	return candidato;
}

export function categoriaImagenUrl(categoria: Pick<CategoriaWeb, "imagen_url">): string {
	if (categoria.imagen_url) {
		return imagenProxyUrl(categoria.imagen_url);
	}
	return LOGO_FALLBACK;
}

export function productoImagenUrl(absoluta: string): string {
	if (absoluta) {
		return imagenProxyUrl(absoluta);
	}
	return LOGO_FALLBACK;
}

export function legacyImagenUrl(relativo: string): string {
	return "/api/imagen/legacy?path=" + encodeURIComponent(relativo);
}

export function fichaImagenUrl(ficha: FichaWeb): string {
	if (ficha.foto.existe && ficha.foto.url) {
		return productoImagenUrl(ficha.foto.url);
	}
	const mapa = cargarMapaLegacy();
	const rel = mapa[claveFicha(ficha)];
	if (rel && resolverSeguro(shopImagesDir(), rel)) {
		return legacyImagenUrl(rel);
	}
	return LOGO_FALLBACK;
}
