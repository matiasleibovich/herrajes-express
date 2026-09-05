import { getSitioConfig } from "@/lib/sitioConfig";
import { whatsappGeneralUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export async function WhatsAppButton() {
	const sitio = await getSitioConfig();
	return (
		<a
			href={whatsappGeneralUrl(sitio.whatsapp)}
			target="_blank"
			rel="noopener noreferrer"
			className="he-wa group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] p-1.5 pr-5 text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#1ebe5d] sm:bottom-7 sm:right-7"
			aria-label="Consultá por WhatsApp"
		>
			<span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#25D366] shadow-sm">
				<WhatsAppIcon className="h-[22px] w-[22px]" />
			</span>
			<span className="hidden font-display text-[13px] font-semibold tracking-[0.06em] sm:block">
				WhatsApp
			</span>
		</a>
	);
}
