import { shopImagesDir } from "@/lib/env";
import { resolverSeguro } from "@/lib/imagenes";
import { responderArchivoImagen } from "@/lib/imagen_respuesta";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const rel = (url.searchParams.get("path") || "").trim();
	if (!rel) {
		return new Response("No encontrado", { status: 404 });
	}
	const path = resolverSeguro(shopImagesDir(), rel);
	if (!path) {
		return new Response("No encontrado", { status: 404 });
	}
	return responderArchivoImagen(path);
}
