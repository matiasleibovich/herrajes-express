import { resolve } from "node:path";

function repoRoot(): string {
	return resolve(process.cwd(), "..");
}

export function legacyDir(): string {
	const env = process.env.HE_LEGACY_DIR?.trim();
	if (env) {
		return env;
	}
	return resolve(repoRoot(), "herrajes");
}

export function shopImagesDir(): string {
	return resolve(legacyDir(), "images", "_shop");
}

export function siteUrl(): string {
	return (process.env.HE_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function contactSendMail(): boolean {
	return process.env.HE_CONTACT_SEND_MAIL === "1";
}
