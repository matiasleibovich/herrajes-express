import Link from "next/link";

export function CtaCatalogo() {
	return (
		<section className="bg-he-oscuro text-white">
			<div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 py-12 md:flex-row md:items-center">
				<div>
					<p className="font-display text-[11px] font-semibold tracking-[0.28em] text-he-rojo">CATÁLOGO</p>
					<h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">Conocé todos nuestros productos</h2>
					<p className="mt-3 max-w-xl text-white/70">
						Tenemos todos los accesorios para carpintería de aluminio. Materiales nacionales e importados.
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<a
						href="/Catalogo-Herrajes-Express.pdf"
						target="catalogo_online"
						className="inline-flex items-center border border-white/30 px-5 py-3 font-display text-[13px] font-semibold tracking-[0.1em] hover:border-white hover:bg-white hover:text-he-oscuro"
					>
						VER PDF · 25MB
					</a>
					<Link
						href="/contacto"
						className="inline-flex items-center bg-he-rojo px-5 py-3 font-display text-[13px] font-semibold tracking-[0.1em] hover:bg-he-rojo-oscuro"
					>
						CONTACTANOS
					</Link>
				</div>
			</div>
		</section>
	);
}
