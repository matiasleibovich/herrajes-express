import Link from "next/link";
import type { CategoriaNodo, CategoriaWeb } from "@/lib/catalogo";
import { nombreCategoriaCorto } from "@/lib/catalogo";

export function SubcategoriasSidebar({
	arbol,
	activa,
	embeber = false,
}: {
	arbol: CategoriaNodo[];
	activa: CategoriaWeb;
	embeber?: boolean;
}) {
	const lista = (
		<>
			<h2 className="font-display text-[12px] font-semibold tracking-[0.18em] text-he-oscuro">CATEGORÍAS</h2>
			<div className="mt-5 space-y-5">
				{arbol.map((cat) => {
					const activaRaiz = cat.id === activa.id || cat.subcategorias.some((s) => s.id === activa.id);
					return (
						<div key={cat.id}>
							<Link
								href={"/productos/" + cat.slug}
								className={"font-display text-[13px] font-semibold tracking-wide " + (activaRaiz ? "text-he-rojo" : "text-he-oscuro hover:text-he-rojo")}
							>
								{cat.nombre.toUpperCase()}
							</Link>
							{cat.subcategorias.length > 0 ? (
								<ul className="mt-2 space-y-1.5 border-l border-he-borde pl-3">
									{cat.subcategorias.map((sub) => (
										<li key={sub.id}>
											<Link
												href={"/productos/" + sub.slug}
												className={"text-[13px] " + (sub.id === activa.id ? "font-semibold text-he-rojo" : "hover:text-he-rojo")}
											>
												{nombreCategoriaCorto(sub.nombre, cat.nombre)}
											</Link>
										</li>
									))}
								</ul>
							) : null}
						</div>
					);
				})}
			</div>
		</>
	);
	if (embeber) {
		return lista;
	}
	return (
		<aside className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(22,22,22,0.05)] ring-1 ring-black/5">
			{lista}
		</aside>
	);
}
