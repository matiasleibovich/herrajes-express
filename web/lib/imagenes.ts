import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { categoriasImagesDir, shopImagesDir } from "./env";
import type { FichaWeb } from "./catalogo";
import { claveFicha } from "./catalogo";
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

export function categoriaImagenPath(id: number, slot = 1, parent = 0): string | null {
	const dir = categoriasImagesDir();
	const propio = join(dir, id + "-" + slot + ".jpg");
	if (existsSync(propio)) {
		return propio;
	}
	if (parent > 0 && parent !== 4) {
		const heredado = join(dir, parent + "-" + slot + ".jpg");
		if (existsSync(heredado)) {
			return heredado;
		}
	}
	return null;
}

export function categoriaImagenUrl(id: number, parent = 0, slot = 1): string {
	return "/api/imagen/categoria?id=" + id + "&parent=" + parent + "&slot=" + slot;
}

export function productoImagenUrl(codigo: string, slot = 1): string {
	return "/api/imagen/producto?codigo=" + encodeURIComponent(codigo) + "&slot=" + slot;
}

export function legacyImagenUrl(relativo: string): string {
	return "/api/imagen/legacy?path=" + encodeURIComponent(relativo);
}

export function fichaImagenUrl(ficha: FichaWeb): string {
	if (ficha.foto.existe && ficha.foto.codigo) {
		return productoImagenUrl(ficha.foto.codigo, 1);
	}
	const mapa = cargarMapaLegacy();
	const rel = mapa[claveFicha(ficha)];
	if (rel && resolverSeguro(shopImagesDir(), rel)) {
		return legacyImagenUrl(rel);
	}
	return LOGO_FALLBACK;
}
