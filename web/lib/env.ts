import { existsSync } from "node:fs";
import { resolve } from "node:path";

function repoRoot(): string {
	return resolve(process.cwd(), "..");
}

function primerDirectorioExistente(candidatos: string[]): string {
	for (const cand of candidatos) {
		if (existsSync(cand)) {
			return cand;
		}
	}
	return candidatos[0] ?? "";
}

export function sostenmutuoHome(): string {
	const env = process.env.HE_SOSTENMUTUO_HOME?.trim();
	if (env) {
		return env;
	}
	const parent = resolve(repoRoot(), "..");
	return primerDirectorioExistente([
		resolve(parent, "sostenmutuo.com.ar"),
		resolve(parent, "sostenmutuo.com"),
	]);
}

export function legacyDir(): string {
	const env = process.env.HE_LEGACY_DIR?.trim();
	if (env) {
		return env;
	}
	return resolve(repoRoot(), "herrajes");
}

export function categoriasImagesDir(): string {
	return resolve(sostenmutuoHome(), "images", "categorias");
}

export function productosImagesDir(): string {
	return resolve(sostenmutuoHome(), "images", "productos");
}

export function shopImagesDir(): string {
	return resolve(legacyDir(), "images", "_shop");
}

export function siteUrl(): string {
	return (process.env.HE_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function dbConfig() {
	return {
		host: process.env.HE_DB_HOST || "localhost",
		user: process.env.HE_DB_USER || "",
		password: process.env.HE_DB_PASS || "",
		database: process.env.HE_DB_NAME || "sostenmutuo",
	};
}

export function contactSendMail(): boolean {
	return process.env.HE_CONTACT_SEND_MAIL === "1";
}
