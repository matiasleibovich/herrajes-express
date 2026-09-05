import Link from "next/link";
import { categoriasArbol } from "@/lib/catalogo";
import { whatsappGeneralUrl } from "@/lib/whatsapp";
import { HeaderNav } from "./HeaderNav";
import { WhatsAppIcon } from "./WhatsAppIcon";

export async function Header() {
	const categorias = await categoriasArbol();
	return (
		<header className="sticky top-0 z-50">
			<div className="hidden bg-he-oscuro text-white/80 md:block">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-[12px] tracking-wide">
					<p>Accesorios para carpintería de aluminio · Villa Carlos Paz</p>
					<div className="flex items-center gap-5">
						<a href="mailto:info@herrajes-express.com" className="hover:text-white">info@herrajes-express.com</a>
						<a href={whatsappGeneralUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white">
							<WhatsAppIcon className="h-3.5 w-3.5" />
							+54 11 4448-5714
						</a>
					</div>
				</div>
			</div>
			<div className="border-b border-he-borde bg-white/95 backdrop-blur">
				<div className="relative mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3.5">
					<Link href="/" className="shrink-0">
						<img src="/images/herrajes_express_logo.svg" alt="Herrajes Express" className="h-11 w-auto md:h-12" />
					</Link>
					<HeaderNav categorias={categorias} />
				</div>
			</div>
		</header>
	);
}
