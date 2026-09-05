"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FichaCard } from "@/components/FichaCard";
import { SubcategoriasSidebar } from "@/components/SubcategoriasSidebar";
import type { CategoriaNodo, CategoriaWeb, FichaListado } from "@/lib/catalogo";
import {
	filtrarFichas,
	opcionesColor,
	opcionesMedida,
	valoresQueryValidos,
	type OpcionFiltro,
} from "@/lib/catalogoFiltros";
import { categoriaWhatsappUrl } from "@/lib/whatsapp";

function GrupoFiltro({
	titulo,
	param,
	opciones,
	seleccion,
	onToggle,
}: {
	titulo: string;
	param: string;
	opciones: OpcionFiltro[];
	seleccion: string[];
	onToggle: (param: string, valor: string) => void;
}) {
	if (opciones.length < 2) {
		return null;
	}
	return (
		<div>
			<h2 className="font-display text-[12px] font-semibold tracking-[0.18em] text-he-oscuro">{titulo}</h2>
			<ul className="mt-3 space-y-2">
				{opciones.map((opcion) => {
					const id = param + "-" + opcion.valor;
					const activo = seleccion.includes(opcion.valor);
					return (
						<li key={opcion.valor}>
							<label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-[13px] text-he-oscuro">
								<input
									id={id}
									type="checkbox"
									checked={activo}
									onChange={() => onToggle(param, opcion.valor)}
									className="h-3.5 w-3.5 accent-he-rojo"
								/>
								<span className={activo ? "font-semibold text-he-rojo" : "hover:text-he-rojo"}>{opcion.label}</span>
							</label>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export function CategoriaListado({
	categoria,
	fichas,
	arbol,
	whatsapp,
	imagenCategoria,
}: {
	categoria: CategoriaWeb;
	fichas: FichaListado[];
	arbol: CategoriaNodo[];
	whatsapp: string;
	imagenCategoria: string;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const coloresOpciones = opcionesColor(fichas);
	const medidasOpciones = opcionesMedida(fichas);
	const colores = valoresQueryValidos(searchParams.getAll("color"), coloresOpciones);
	const medidas = valoresQueryValidos(searchParams.getAll("medida"), medidasOpciones);
	const visibles = filtrarFichas(fichas, { colores, medidas });
	const hayFiltros = colores.length > 0 || medidas.length > 0;
	const hayFacetas = coloresOpciones.length >= 2 || medidasOpciones.length >= 2;

	function irA(siguienteColores: string[], siguienteMedidas: string[]) {
		const params = new URLSearchParams();
		for (const valor of siguienteColores) {
			params.append("color", valor);
		}
		for (const valor of siguienteMedidas) {
			params.append("medida", valor);
		}
		const qs = params.toString();
		router.push(qs === "" ? pathname : pathname + "?" + qs, { scroll: false });
	}

	function toggle(param: string, valor: string) {
		const actual = param === "color" ? colores : medidas;
		const siguiente = actual.includes(valor)
			? actual.filter((item) => item !== valor)
			: [...actual, valor];
		if (param === "color") {
			irA(siguiente, medidas);
			return;
		}
		irA(colores, siguiente);
	}

	return (
		<div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
			<aside className="lg:sticky lg:top-24 lg:self-start">
				<div className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(22,22,22,0.05)] ring-1 ring-black/5">
					<div className="space-y-6">
						<GrupoFiltro titulo="COLOR" param="color" opciones={coloresOpciones} seleccion={colores} onToggle={toggle} />
						<GrupoFiltro titulo="MEDIDA" param="medida" opciones={medidasOpciones} seleccion={medidas} onToggle={toggle} />
						{hayFiltros ? (
							<button
								type="button"
								onClick={() => irA([], [])}
								className="font-display text-[12px] font-semibold tracking-wide text-he-rojo hover:text-he-rojo-oscuro"
							>
								Limpiar filtros
							</button>
						) : null}
						<div className={hayFacetas || hayFiltros ? "border-t border-he-borde pt-6" : ""}>
							<SubcategoriasSidebar arbol={arbol} activa={categoria} embeber />
						</div>
					</div>
				</div>
			</aside>
			<div>
				{fichas.length > 0 ? (
					<>
						{hayFacetas || hayFiltros ? (
							<p className="mb-4 text-sm text-he-texto">
								Mostrando {visibles.length} de {fichas.length}
							</p>
						) : null}
						{visibles.length > 0 ? (
							<ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
								{visibles.map((ficha) => (
									<li key={ficha.categoria_id + "|" + ficha.agrupador + "|" + ficha.variante}>
										<FichaCard ficha={ficha} imagenSrc={ficha.imagenSrc} whatsapp={whatsapp} />
									</li>
								))}
							</ul>
						) : (
							<div className="rounded-2xl bg-white p-10 text-center shadow-[0_10px_30px_rgba(22,22,22,0.05)] ring-1 ring-black/5">
								<p className="text-he-texto">Ningún producto coincide con esos filtros.</p>
								<button
									type="button"
									onClick={() => irA([], [])}
									className="mt-4 font-display text-[13px] font-semibold tracking-wide text-he-rojo"
								>
									Limpiar filtros
								</button>
							</div>
						)}
					</>
				) : (
					<div className="rounded-2xl bg-white p-10 text-center shadow-[0_10px_30px_rgba(22,22,22,0.05)] ring-1 ring-black/5">
						<img
							src={imagenCategoria}
							alt={categoria.nombre}
							className="he-card-img mx-auto mb-6 max-w-[220px] rounded-xl bg-[#f3f1ed] p-4"
						/>
						<h2 className="font-display text-2xl font-semibold text-he-oscuro">Próximamente</h2>
						<p className="mt-3 text-he-texto">Estamos preparando el catálogo de esta categoría.</p>
						<div className="mt-6 flex flex-wrap justify-center gap-3">
							<Link href="/productos" className="border border-he-oscuro px-5 py-3 font-display text-[13px] font-semibold tracking-wide hover:border-he-rojo hover:text-he-rojo">
								VER TODAS LAS CATEGORÍAS
							</Link>
							<Link href="/contacto" className="bg-he-rojo px-5 py-3 font-display text-[13px] font-semibold tracking-wide text-white hover:bg-he-rojo-oscuro">
								CONSULTANOS
							</Link>
						</div>
						<p className="mt-6 text-sm">
							¿Necesitás este producto ahora?{" "}
							<a href={categoriaWhatsappUrl(categoria.nombre, whatsapp)} target="_blank" rel="noopener noreferrer" className="font-semibold text-he-rojo">
								Escribinos por WhatsApp
							</a>
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
