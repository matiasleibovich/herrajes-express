import { fichaImagenUrl } from "@/lib/imagenes";
import { productoWhatsappUrl } from "@/lib/whatsapp";
import type { FichaWeb } from "@/lib/catalogo";
import { ImageWithFallback } from "./ImageWithFallback";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function FichaCard({ ficha, whatsapp }: { ficha: FichaWeb; whatsapp?: string }) {
	const codigo = ficha.codigos_producto[0] || ficha.agrupador;
	const href = productoWhatsappUrl(codigo, ficha.titulo, whatsapp);
	const alt = codigo ? codigo + " - " + ficha.titulo : ficha.titulo;
	return (
		<a href={href} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(22,22,22,0.05)] ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(22,22,22,0.1)]">
			<div className="bg-[#f3f1ed] p-6">
				<ImageWithFallback
					src={fichaImagenUrl(ficha)}
					alt={alt}
					title={alt}
					className="he-card-img mx-auto w-full transition duration-300 group-hover:scale-[1.03]"
				/>
			</div>
			<div className="flex flex-1 flex-col px-5 py-4">
				<h3 className="font-display text-[13px] font-semibold leading-5 tracking-wide text-he-oscuro group-hover:text-he-rojo">
					{ficha.titulo.toUpperCase()}
				</h3>
				{ficha.colores.length > 0 ? (
					<p className="mt-2 text-xs text-he-texto/80">{ficha.colores.join(" · ")}</p>
				) : null}
				{ficha.medidas.length > 0 ? (
					<p className="mt-1 text-xs text-he-texto/80">{ficha.medidas.join(" · ")}</p>
				) : null}
				<span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[12px] font-semibold tracking-wide text-[#1ebe5d]">
					<WhatsAppIcon className="h-3.5 w-3.5" />
					Consultar
				</span>
			</div>
		</a>
	);
}
