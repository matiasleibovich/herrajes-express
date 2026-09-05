type CatalogoApiRespuesta<T> = {
	success?: boolean;
	data?: T;
	error?: string;
};

export function catalogoApiBase(): string {
	const raw = process.env.HE_CATALOGO_API_BASE?.trim();
	const base = raw && raw !== "" ? raw : "http://local.api.sostenmutuo.com";
	return base.replace(/\/$/, "");
}

export function catalogoApiToken(): string {
	return process.env.HE_CATALOGO_API_TOKEN?.trim() || "";
}

export async function catalogoApiGet<T>(action: string, params: Record<string, string> = {}): Promise<T> {
	const url = new URL(catalogoApiBase() + "/" + action.replace(/^\//, ""));
	for (const [clave, valor] of Object.entries(params)) {
		if (valor !== "") {
			url.searchParams.set(clave, valor);
		}
	}
	const headers: Record<string, string> = { Accept: "application/json" };
	const token = catalogoApiToken();
	if (token !== "") {
		headers["X-HE-Catalogo-Token"] = token;
	}
	let res: Response;
	try {
		res = await fetch(url.toString(), {
			method: "GET",
			headers,
			cache: "no-store",
		});
	} catch (err) {
		const motivo = err instanceof Error ? err.message : String(err);
		throw new Error("No se pudo conectar a la API de catalogo (" + catalogoApiBase() + "): " + motivo);
	}
	const texto = await res.text();
	let json: CatalogoApiRespuesta<T>;
	try {
		json = JSON.parse(texto) as CatalogoApiRespuesta<T>;
	} catch {
		throw new Error(
			"La API de catalogo no devolvio JSON valido (" + action + ", HTTP " + res.status + ")",
		);
	}
	if (!res.ok || json.success === false) {
		throw new Error(json.error || "Error de la API de catalogo (" + action + ", HTTP " + res.status + ")");
	}
	if (json.data === undefined) {
		throw new Error("La API de catalogo no devolvio data (" + action + ")");
	}
	return json.data;
}
