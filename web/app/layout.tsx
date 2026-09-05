import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd, organizationLd } from "@/components/JsonLd";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { siteUrl } from "@/lib/env";
import "./globals.css";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	weight: ["500", "600", "700"],
});

const openSans = Open_Sans({
	variable: "--font-open-sans",
	subsets: ["latin"],
	weight: ["400", "600", "700"],
});

const site = siteUrl();

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	metadataBase: new URL(site),
	title: {
		default: "Herrajes Express. Accesorios para aberturas de aluminio.",
		template: "%s | Herrajes Express",
	},
	description: "Herrajes y accesorios para carpintería de aluminio. Catálogo de bisagras, rodamientos, cerraduras, felpas y más.",
	openGraph: {
		locale: "es_AR",
		type: "website",
		siteName: "Herrajes Express",
		images: ["/images/herrajes_express_logo.svg"],
	},
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="es" className={`${montserrat.variable} ${openSans.variable} h-full antialiased`}>
			<body className="flex min-h-full flex-col bg-he-fondo font-sans text-he-texto">
				<JsonLd data={organizationLd(site)} />
				<Header />
				{children}
				<Footer />
				<WhatsAppButton />
			</body>
		</html>
	);
}
