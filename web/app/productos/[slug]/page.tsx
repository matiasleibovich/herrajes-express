import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CategoriaListado } from "@/components/CategoriaListado";
import { JsonLd, breadcrumbLd, itemListLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { categoriaPorSlug, categoriasArbol, fichasPorCategoria } from "@/lib/catalogo";
import { siteUrl } from "@/lib/env";
import { categoriaImagenUrl, fichaImagenUrl } from "@/lib/imagenes";
import { getSitioConfig } from "@/lib/sitioConfig";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const cat = await categoriaPorSlug(slug);
	if (!cat) {
		return { title: "Categoría no encontrada" };
	}
	const imagen = categoriaImagenUrl(cat);
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
	const [fichasApi, arbol, sitio] = await Promise.all([
		fichasPorCategoria(cat.id),
		categoriasArbol(),
		getSitioConfig(),
	]);
	const fichas = fichasApi.map((ficha) => ({
		...ficha,
		imagenSrc: fichaImagenUrl(ficha),
	}));
	const imagenCategoria = categoriaImagenUrl(cat);
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
				<Suspense>
					<CategoriaListado
						categoria={cat}
						fichas={fichas}
						arbol={arbol}
						whatsapp={sitio.whatsapp}
						imagenCategoria={imagenCategoria}
					/>
				</Suspense>
			</section>
		</main>
	);
}
