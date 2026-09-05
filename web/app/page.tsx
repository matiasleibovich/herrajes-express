import type { Metadata } from "next";
import { CategoriaCard } from "@/components/CategoriaCard";
import { CtaCatalogo } from "@/components/CtaCatalogo";
import { Hero } from "@/components/Hero";
import { JsonLd, itemListLd } from "@/components/JsonLd";
import { SectionTitle } from "@/components/SectionTitle";
import { categoriasRaiz } from "@/lib/catalogo";
import { siteUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Herrajes Express. Accesorios para aberturas de aluminio.",
	description: "Herrajes y accesorios para carpintería de aluminio. Catálogo de bisagras, rodamientos, cerraduras, felpas y más.",
	alternates: { canonical: "/" },
	openGraph: {
		title: "Herrajes Express. Accesorios para aberturas de aluminio.",
		description: "Herrajes y accesorios para carpintería de aluminio.",
		url: "/",
		images: ["/images/sliders/camioneta.jpg"],
	},
};

export default async function HomePage() {
	const categorias = await categoriasRaiz();
	const site = siteUrl();
	return (
		<main>
			<JsonLd
				data={itemListLd(
					site,
					"Categorías de herrajes",
					categorias.map((c) => ({ name: c.nombre, url: "/productos/" + c.slug })),
				)}
			/>
			<Hero />
			<CtaCatalogo />
			<section className="mx-auto max-w-6xl px-4 py-20">
				<SectionTitle kicker="PRODUCTOS" title="Accesorios para carpintería de aluminio" />
				<ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
					{categorias.map((categoria) => (
						<li key={categoria.id}>
							<CategoriaCard categoria={categoria} />
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}
