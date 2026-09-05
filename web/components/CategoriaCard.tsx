import Link from "next/link";
import { categoriaImagenUrl } from "@/lib/imagenes";
import type { CategoriaNodo, CategoriaWeb } from "@/lib/catalogo";
import { ImageWithFallback } from "./ImageWithFallback";

export function CategoriaCard({ categoria }: { categoria: CategoriaWeb | CategoriaNodo }) {
	const src = categoriaImagenUrl(categoria);
	const tipos = "subcategorias" in categoria ? categoria.subcategorias.length : 0;
	return (
		<Link href={"/productos/" + categoria.slug} className="group block h-full overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(22,22,22,0.05)] ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(22,22,22,0.1)]">
			<div className="bg-[#f3f1ed] p-6">
				<ImageWithFallback
					src={src}
					alt={categoria.nombre}
					title={categoria.nombre}
					className="he-card-img mx-auto w-full transition duration-300 group-hover:scale-[1.03]"
				/>
			</div>
			<div className="px-5 py-4 min-h-[4.25rem]">
				<h3 className="font-display text-[13px] font-semibold tracking-[0.12em] text-he-oscuro group-hover:text-he-rojo">
					{categoria.nombre.toUpperCase()}
				</h3>
				{tipos > 0 ? (
					<p className="mt-1 text-[12px] text-he-texto">{tipos} tipos</p>
				) : null}
			</div>
		</Link>
	);
}
