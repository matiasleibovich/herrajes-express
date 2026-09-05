import { cache } from "react";
import { catalogoApiGet } from "@/lib/catalogoApi";
import { imagenProxyUrl } from "@/lib/imagenProxy";

export type SitioSlide = {
	id: number;
	archivo: string;
	orden: number;
	imagen_url: string;
};

export type SitioConfig = {
	sitio: string;
	whatsapp: string;
	telefono: string;
	email: string;
	direccion: string;
	localidad: string;
	provincia: string;
	slides: SitioSlide[];
	desdeApi: boolean;
};

const SLIDES_FALLBACK: SitioSlide[] = [
	{ id: 1, archivo: "camioneta.jpg", orden: 1, imagen_url: "" },
	{ id: 2, archivo: "aldaba_reversible.jpg", orden: 2, imagen_url: "" },
	{ id: 3, archivo: "bipunto90.jpg", orden: 3, imagen_url: "" },
	{ id: 4, archivo: "bipunto90_grande.jpg", orden: 4, imagen_url: "" },
	{ id: 5, archivo: "bipunto90_standard.jpg", orden: 5, imagen_url: "" },
	{ id: 6, archivo: "bipunto90_uniero.jpg", orden: 6, imagen_url: "" },
	{ id: 7, archivo: "felpa7x4.jpg", orden: 7, imagen_url: "" },
	{ id: 8, archivo: "slider_rueda_A-30_doble_2.jpg", orden: 8, imagen_url: "" },
];

export const SITIO_FALLBACK: SitioConfig = {
	sitio: "herrajes",
	whatsapp: "541144485714",
	telefono: "+54 11 4448-5714",
	email: "info@herrajes-express.com",
	direccion: "Av. San Martín 2380, Oficina 2",
	localidad: "Villa Carlos Paz",
	provincia: "Córdoba",
	slides: SLIDES_FALLBACK,
	desdeApi: false,
};

function texto(valor: unknown, fallback: string): string {
	const limpio = String(valor ?? "").trim();
	return limpio !== "" ? limpio : fallback;
}

function normalizarSitio(data: unknown): SitioConfig | null {
	if (!data || typeof data !== "object") {
		return null;
	}
	const raw = data as Record<string, unknown>;
	if (!Array.isArray(raw.slides)) {
		return null;
	}
	const slides: SitioSlide[] = raw.slides
		.map((item) => {
			if (!item || typeof item !== "object") {
				return null;
			}
			const s = item as Record<string, unknown>;
			const id = Number(s.id) || 0;
			const archivo = String(s.archivo || "").trim();
			if (id <= 0 || archivo === "") {
				return null;
			}
			return {
				id,
				archivo,
				orden: Number(s.orden) || id,
				imagen_url: String(s.imagen_url || "").trim(),
			};
		})
		.filter((s): s is SitioSlide => s !== null);
	return {
		sitio: texto(raw.sitio, "herrajes"),
		whatsapp: texto(raw.whatsapp, SITIO_FALLBACK.whatsapp).replace(/[^0-9]/g, ""),
		telefono: texto(raw.telefono, SITIO_FALLBACK.telefono),
		email: texto(raw.email, SITIO_FALLBACK.email),
		direccion: texto(raw.direccion, SITIO_FALLBACK.direccion),
		localidad: texto(raw.localidad, SITIO_FALLBACK.localidad),
		provincia: texto(raw.provincia, SITIO_FALLBACK.provincia),
		slides,
		desdeApi: true,
	};
}

export const getSitioConfig = cache(async (): Promise<SitioConfig> => {
	try {
		const data = await catalogoApiGet<unknown>("catalogo_web_sitio", { sitio: "herrajes" });
		const sitio = normalizarSitio(data);
		if (!sitio) {
			return SITIO_FALLBACK;
		}
		return sitio;
	} catch {
		return SITIO_FALLBACK;
	}
});

export function slidePublicUrl(slide: SitioSlide, usarFallbackLocal = false): string {
	if (slide.imagen_url !== "") {
		return imagenProxyUrl(slide.imagen_url);
	}
	if (usarFallbackLocal && slide.archivo !== "") {
		return "/images/sliders/" + slide.archivo;
	}
	return "";
}

export function slidesHeroUrls(sitio: SitioConfig): string[] {
	return sitio.slides
		.map((slide) => slidePublicUrl(slide, !sitio.desdeApi))
		.filter((src) => src !== "");
}
