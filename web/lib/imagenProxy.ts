const HOSTS_PERMITIDOS = new Set([
	"local.config.sostenmutuo.com",
	"config.sostenmutuo.com",
	"config-mzn.sostenmutuo.com",
	"config-gs.sostenmutuo.com",
]);

const PATHS_PERMITIDOS = [
	/^\/images\/categorias\/[A-Za-z0-9._-]+\.jpe?g$/i,
	/^\/images\/productos\/[A-Za-z0-9._-]+\.jpe?g$/i,
	/^\/images\/slideshows\/(herrajes|telas)\/[A-Za-z0-9._-]+\.jpe?g$/i,
];

export function urlImagenPermitida(raw: string): URL | null {
	const texto = String(raw || "").trim();
	if (texto === "") {
		return null;
	}
	let url: URL;
	try {
		url = new URL(texto);
	} catch {
		return null;
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") {
		return null;
	}
	if (!HOSTS_PERMITIDOS.has(url.hostname.toLowerCase())) {
		return null;
	}
	if (!PATHS_PERMITIDOS.some((re) => re.test(url.pathname))) {
		return null;
	}
	return url;
}

export function imagenProxyUrl(absoluta: string): string {
	return "/api/imagen/proxy?url=" + encodeURIComponent(absoluta);
}

function contentTypeRemoto(res: Response, path: string): string {
	const remoto = res.headers.get("content-type");
	if (remoto && remoto.startsWith("image/")) {
		return remoto;
	}
	if (path.toLowerCase().endsWith(".png")) {
		return "image/png";
	}
	if (path.toLowerCase().endsWith(".webp")) {
		return "image/webp";
	}
	return "image/jpeg";
}

export async function proxyImagenRemota(raw: string): Promise<Response> {
	const url = urlImagenPermitida(raw);
	if (!url) {
		return new Response("No encontrado", { status: 404 });
	}
	let res: Response;
	try {
		res = await fetch(url.toString(), { cache: "no-store", redirect: "manual" });
	} catch {
		return new Response("No encontrado", { status: 404 });
	}
	if (!res.ok || !res.body) {
		return new Response("No encontrado", { status: 404 });
	}
	return new Response(res.body, {
		headers: {
			"Content-Type": contentTypeRemoto(res, url.pathname),
			"Cache-Control": "public, max-age=3600, must-revalidate",
		},
	});
}
