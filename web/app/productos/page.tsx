import type { Metadata } from "next";
import { CategoriaCard } from "@/components/CategoriaCard";
import { JsonLd, breadcrumbLd, itemListLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { categoriasRaiz } from "@/lib/catalogo";
import { siteUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Productos",
	description: "Catálogo de herrajes y accesorios para carpintería de aluminio.",
	alternates: { canonical: "/productos" },
	openGraph: {
		title: "Productos | Herrajes Express",
		description: "Catálogo de herrajes y accesorios para carpintería de aluminio.",
		url: "/productos",
		images: ["/images/herrajes_express_logo.svg"],
	},
};

export default async function ProductosPage() {
	const categorias = await categoriasRaiz();
	const site = siteUrl();
	return (
		<main>
			<JsonLd data={breadcrumbLd(site, [
				{ name: "Home", url: "/" },
				{ name: "Productos", url: "/productos" },
			])} />
			<JsonLd
				data={itemListLd(
					site,
					"Categorías de herrajes",
					categorias.map((c) => ({ name: c.nombre, url: "/productos/" + c.slug })),
				)}
			/>
			<PageHeader
				title="Productos"
				crumbs={[
					{ label: "Home", href: "/" },
					{ label: "Productos" },
				]}
			/>
			<section className="mx-auto max-w-6xl px-4 py-14">
				<ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
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
