import { proxyImagenRemota } from "@/lib/imagenProxy";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const remota = (url.searchParams.get("url") || "").trim();
	if (!remota) {
		return new Response("No encontrado", { status: 404 });
	}
	return proxyImagenRemota(remota);
}
