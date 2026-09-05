import { NOMBRE_SEGURO, resolverSeguro } from "@/lib/imagenes";
import { productosImagesDir } from "@/lib/env";
import { responderArchivoImagen } from "@/lib/imagen_respuesta";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const codigo = (url.searchParams.get("codigo") || "").trim();
	const slot = Number(url.searchParams.get("slot") || "1");
	if (!codigo || !NOMBRE_SEGURO.test(codigo) || !Number.isInteger(slot) || slot <= 0 || slot > 19) {
		return new Response("No encontrado", { status: 404 });
	}
	const path = resolverSeguro(productosImagesDir(), codigo + "-" + slot + ".jpg");
	if (!path) {
		return new Response("No encontrado", { status: 404 });
	}
	return responderArchivoImagen(path);
}
