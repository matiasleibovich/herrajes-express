import Link from "next/link";
import { getSitioConfig } from "@/lib/sitioConfig";
import { whatsappGeneralUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export async function Footer() {
	const sitio = await getSitioConfig();
	const anio = new Date().getFullYear();
	return (
		<footer className="mt-auto bg-he-oscuro text-white/70">
			<div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
				<div>
					<img src="/images/herrajes_express_logo.svg" alt="Herrajes Express" className="h-10 w-auto" />
					<p className="mt-5 max-w-xs text-sm leading-6">
						Accesorios para aberturas de aluminio. Materiales nacionales e importados.
					</p>
				</div>
				<div>
					<h3 className="font-display text-[12px] font-semibold tracking-[0.18em] text-white">NAVEGAR</h3>
					<ul className="mt-4 space-y-2 text-sm">
						<li><Link href="/" className="hover:text-white">Home</Link></li>
						<li><Link href="/empresa" className="hover:text-white">La Empresa</Link></li>
						<li><Link href="/productos" className="hover:text-white">Productos</Link></li>
						<li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
					</ul>
				</div>
				<div>
					<h3 className="font-display text-[12px] font-semibold tracking-[0.18em] text-white">VENTAS</h3>
					<p className="mt-4 text-sm leading-7">
						<a href={whatsappGeneralUrl(sitio.whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
							<WhatsAppIcon className="h-4 w-4" />
							{sitio.telefono}
						</a>
						<br />
						<a href={"mailto:" + sitio.email} className="hover:text-white">{sitio.email}</a>
						<br />
						<span className="mt-3 block text-white/55">
							{sitio.direccion}<br />
							{sitio.localidad}, {sitio.provincia}
						</span>
					</p>
				</div>
			</div>
			<div className="border-t border-white/10">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 text-xs text-white/45">
					<p>© {anio} Herrajes Express. Todos los derechos reservados.</p>
				</div>
			</div>
		</footer>
	);
}
