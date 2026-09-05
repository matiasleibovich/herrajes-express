export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}

export function organizationLd(site: string) {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Herrajes Express",
		url: site,
		email: "info@herrajes-express.com",
		telephone: "+54-11-4448-5714",
		address: {
			"@type": "PostalAddress",
			streetAddress: "Av. San Martín 2380, Oficina 2",
			addressLocality: "Villa Carlos Paz",
			addressRegion: "Córdoba",
			addressCountry: "AR",
		},
		logo: site + "/images/herrajes_express_logo.svg",
	};
}

export function breadcrumbLd(site: string, items: { name: string; url: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			item: site + item.url,
		})),
	};
}

export function itemListLd(site: string, name: string, items: { name: string; url: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name,
		itemListElement: items.map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			url: site + item.url,
		})),
	};
}
