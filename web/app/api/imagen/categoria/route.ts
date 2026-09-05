import { categoriaImagenPath } from "@/lib/imagenes";
import { responderArchivoImagen } from "@/lib/imagen_respuesta";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const id = Number(url.searchParams.get("id") || "0");
	const parent = Number(url.searchParams.get("parent") || "0");
	const slot = Number(url.searchParams.get("slot") || "1");
	if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(slot) || slot <= 0 || slot > 5) {
		return new Response("No encontrado", { status: 404 });
	}
	const path = categoriaImagenPath(id, slot, parent);
	if (!path) {
		return new Response("No encontrado", { status: 404 });
	}
	return responderArchivoImagen(path);
}
