import type { MetadataRoute } from "next";
import { categorias } from "@/lib/catalogo";
import { siteUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const site = siteUrl();
	const cats = await categorias();
	const now = new Date();
	return [
		{ url: site + "/", lastModified: now },
		{ url: site + "/productos", lastModified: now },
		{ url: site + "/contacto", lastModified: now },
		{ url: site + "/empresa", lastModified: now },
		...cats.map((c) => ({
			url: site + "/productos/" + c.slug,
			lastModified: now,
		})),
	];
}
