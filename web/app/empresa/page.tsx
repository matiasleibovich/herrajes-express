import type { Metadata } from "next";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
	title: "La Empresa",
	description: "Herrajes Express provee insumos y accesorios para carpintería de aluminio, con una política de beneficio mutuo.",
	alternates: { canonical: "/empresa" },
	openGraph: {
		title: "La Empresa | Herrajes Express",
		description: "Herrajes Express provee insumos y accesorios para carpintería de aluminio.",
		url: "/empresa",
		images: ["/images/sliders/camioneta.jpg"],
	},
};

export default function EmpresaPage() {
	const site = siteUrl();
	return (
		<main>
			<JsonLd data={breadcrumbLd(site, [
				{ name: "Home", url: "/" },
				{ name: "La Empresa", url: "/empresa" },
			])} />
			<PageHeader
				title="La Empresa"
				crumbs={[
					{ label: "Home", href: "/" },
					{ label: "La Empresa" },
				]}
			/>
			<section className="mx-auto max-w-3xl px-4 py-14 leading-8">
				<h2 className="font-display text-3xl font-semibold tracking-tight text-he-oscuro">Acerca de nuestra empresa</h2>
				<span className="mt-4 block h-0.5 w-12 bg-he-rojo" />
				<div className="mt-8 space-y-5">
					<p>
						<strong>HERRAJES EXPRESS</strong> es una nueva empresa dedicada a proveer insumos y accesorios para Carpintería de Aluminio.
					</p>
					<p>
						Distribuidores y Carpinteros de alta trayectoria han comprobado la <strong>excelente relación CALIDAD-PRECIO</strong> de nuestros productos.
					</p>
					<p>
						Poco a poco vamos ampliando nuestra lista, buscando y seleccionando cuidadosamente en nuestros diferentes viajes por China, Europa, Indonesia, Taiwan, etc. aquellos proveedores que brindan la mejor opción para satisfacer las necesidades de nuestros clientes.
					</p>
					<p>
						Naciendo como una rama que abarca el rubro de los herrajes de aluminio, HERRAJES EXPRESS surge de otra empresa: <strong>Sunshine Fabrics</strong>, con más de diez años en el abastecimiento a Fábricas de Cortinas Roller de Argentina y también de toda América Latina.
					</p>
					<p>
						Nos gusta brindar el mejor servicio porque creemos en el <strong>intercambio recto y honesto</strong>, y que todas las personas y empresas nos podemos beneficiar con ese equilibrio.
					</p>
					<p>
						Nuestra política comercial para todo aquél que participe de nuestros negocios es: el <strong>beneficio mutuo</strong>, del cual se desprende el nombre de nuestra firma importadora que reúne a todas nuestras empresas: Sostén Mutuo SRL, que está asentada sobre principios éticos que permiten sobrellevar los vaivenes del comercio, con la entereza que da saber que <strong>lo que hacemos es simplemente bueno para todos</strong>.
					</p>
					<p>
						<strong>HERRAJES EXPRESS</strong>. Trabajemos juntos.
					</p>
				</div>
			</section>
			<section className="h-[360px] bg-cover bg-center" style={{ backgroundImage: "url(/images/sliders/camioneta.jpg)" }} />
		</main>
	);
}
