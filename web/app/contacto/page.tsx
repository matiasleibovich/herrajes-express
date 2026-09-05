import type { Metadata } from "next";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { siteUrl } from "@/lib/env";
import { whatsappGeneralUrl } from "@/lib/whatsapp";
import { ContactoForm } from "./ContactoForm";

export const metadata: Metadata = {
	title: "Contacto",
	description: "Dejanos tu consulta. Completá el formulario y te contestamos a la brevedad.",
	alternates: { canonical: "/contacto" },
	openGraph: {
		title: "Contacto | Herrajes Express",
		description: "Dejanos tu consulta. Completá el formulario y te contestamos a la brevedad.",
		url: "/contacto",
		images: ["/images/herrajes_express_logo.svg"],
	},
};

export default function ContactoPage() {
	const site = siteUrl();
	return (
		<main>
			<JsonLd data={breadcrumbLd(site, [
				{ name: "Home", url: "/" },
				{ name: "Contacto", url: "/contacto" },
			])} />
			<PageHeader
				title="Contacto"
				crumbs={[
					{ label: "Home", href: "/" },
					{ label: "Contacto" },
				]}
			/>
			<section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[minmax(0,1fr)_300px]">
				<div className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(22,22,22,0.05)] ring-1 ring-black/5 md:p-8">
					<h2 className="font-display text-2xl font-semibold text-he-oscuro">Dejanos tu consulta</h2>
					<p className="mt-2 text-sm">Completá el formulario y te contestaremos a la brevedad.</p>
					<div className="mt-8">
						<ContactoForm />
					</div>
				</div>
				<aside className="h-fit rounded-2xl bg-he-oscuro p-7 text-sm leading-7 text-white/75">
					<h3 className="font-display text-[12px] font-semibold tracking-[0.18em] text-white">VENTAS</h3>
					<p className="mt-4">
						<a href={whatsappGeneralUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white hover:text-[#25D366]">
							<WhatsAppIcon className="h-4 w-4" />
							+54 11 4448-5714
						</a>
						<br />
						<a href="mailto:info@herrajes-express.com" className="hover:text-white">info@herrajes-express.com</a>
					</p>
					<h3 className="mt-8 font-display text-[12px] font-semibold tracking-[0.18em] text-white">OFICINA</h3>
					<p className="mt-4">
						Av. San Martín 2380, Oficina 2<br />
						Villa Carlos Paz - Córdoba<br />
						Argentina
					</p>
				</aside>
			</section>
		</main>
	);
}
