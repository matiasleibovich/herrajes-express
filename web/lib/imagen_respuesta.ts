import { createReadStream, statSync } from "node:fs";
import { Readable } from "node:stream";

function contentType(path: string): string {
	if (path.toLowerCase().endsWith(".png")) {
		return "image/png";
	}
	if (path.toLowerCase().endsWith(".webp")) {
		return "image/webp";
	}
	if (path.toLowerCase().endsWith(".svg")) {
		return "image/svg+xml";
	}
	return "image/jpeg";
}

export function responderArchivoImagen(path: string): Response {
	const st = statSync(path);
	const stream = createReadStream(path);
	return new Response(Readable.toWeb(stream) as ReadableStream, {
		headers: {
			"Content-Type": contentType(path),
			"Content-Length": String(st.size),
			"Cache-Control": "public, max-age=3600, must-revalidate",
			ETag: '"' + st.size + "-" + Math.floor(st.mtimeMs) + '"',
			"Last-Modified": st.mtime.toUTCString(),
		},
	});
}
