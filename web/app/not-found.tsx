import Link from "next/link";

export default function NotFound() {
	return (
		<main className="mx-auto max-w-3xl px-4 py-28 text-center">
			<p className="font-display text-[11px] font-semibold tracking-[0.28em] text-he-rojo">404</p>
			<h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-he-oscuro">Página no encontrada</h1>
			<p className="mt-4">La dirección no existe o el producto ya no está publicado.</p>
			<div className="mt-8 flex justify-center gap-3">
				<Link href="/" className="bg-he-rojo px-5 py-3 font-display text-[13px] font-semibold tracking-wide text-white hover:bg-he-rojo-oscuro">IR AL INICIO</Link>
				<Link href="/productos" className="border border-he-oscuro px-5 py-3 font-display text-[13px] font-semibold tracking-wide hover:border-he-rojo hover:text-he-rojo">VER PRODUCTOS</Link>
			</div>
		</main>
	);
}
