import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FichaCard } from "@/components/FichaCard";
import { JsonLd, breadcrumbLd, itemListLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { SubcategoriasSidebar } from "@/components/SubcategoriasSidebar";
import { categoriaPorSlug, categoriasArbol, fichasPorCategoria } from "@/lib/catalogo";
import { siteUrl } from "@/lib/env";
import { categoriaImagenUrl } from "@/lib/imagenes";
import { categoriaWhatsappUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const cat = await categoriaPorSlug(slug);
	if (!cat) {
		return { title: "Categoría no encontrada" };
	}
	const imagen = categoriaImagenUrl(cat.id, cat.parent, 1);
	return {
		title: cat.nombre,
		description: "Catálogo de " + cat.nombre + " para carpintería de aluminio.",
		alternates: { canonical: "/productos/" + cat.slug },
		openGraph: {
			title: cat.nombre + " | Herrajes Express",
			description: "Catálogo de " + cat.nombre + " para carpintería de aluminio.",
			url: "/productos/" + cat.slug,
			images: [imagen],
		},
	};
}

export default async function CategoriaPage({ params }: Props) {
	const { slug } = await params;
	const cat = await categoriaPorSlug(slug);
	if (!cat) {
		notFound();
	}
	const [fichas, arbol] = await Promise.all([
		fichasPorCategoria(cat.id),
		categoriasArbol(),
	]);
	const site = siteUrl();
	const crumbs = [
		{ label: "Home", href: "/" },
		{ label: "Productos", href: "/productos" },
		{ label: cat.nombre },
	];

	return (
		<main>
			<JsonLd data={breadcrumbLd(site, [
				{ name: "Home", url: "/" },
				{ name: "Productos", url: "/productos" },
				{ name: cat.nombre, url: "/productos/" + cat.slug },
			])} />
			{fichas.length > 0 ? (
				<JsonLd
					data={itemListLd(
						site,
						cat.nombre,
						fichas.map((f) => ({ name: f.titulo, url: "/productos/" + cat.slug })),
					)}
				/>
			) : null}
			<PageHeader title={cat.nombre.toUpperCase()} crumbs={crumbs} />
			<section className="mx-auto max-w-6xl px-4 py-12">
				<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
					<div>
						{fichas.length > 0 ? (
							<ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
								{fichas.map((ficha) => (
									<li key={ficha.categoria_id + "|" + ficha.agrupador + "|" + ficha.variante}>
										<FichaCard ficha={ficha} />
									</li>
								))}
							</ul>
						) : (
							<div className="rounded-2xl bg-white p-10 text-center shadow-[0_10px_30px_rgba(22,22,22,0.05)] ring-1 ring-black/5">
								<img
									src={categoriaImagenUrl(cat.id, cat.parent, 1)}
									alt={cat.nombre}
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
									<a href={categoriaWhatsappUrl(cat.nombre)} target="_blank" rel="noopener noreferrer" className="font-semibold text-he-rojo">
										Escribinos por WhatsApp
									</a>
								</p>
							</div>
						)}
					</div>
					<SubcategoriasSidebar arbol={arbol} activa={cat} />
				</div>
			</section>
		</main>
	);
}
