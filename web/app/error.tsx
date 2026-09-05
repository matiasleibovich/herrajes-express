"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
	return (
		<main className="mx-auto max-w-3xl px-4 py-24 text-center">
			<h1 className="font-display text-3xl font-semibold text-he-oscuro">No se pudo cargar el catálogo</h1>
			<p className="mt-4">Falló la consulta a la base de datos. Probá de nuevo en un momento.</p>
			<button type="button" onClick={reset} className="mt-8 bg-he-rojo px-5 py-3 font-display text-sm font-semibold text-white">
				REINTENTAR
			</button>
		</main>
	);
}
