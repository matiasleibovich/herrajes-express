import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
	return (
		<nav aria-label="Migas de pan" className="text-sm">
			<ol className="flex flex-wrap gap-2 text-he-texto">
				{items.map((item, i) => (
					<li key={item.label + i} className="flex items-center gap-2">
						{i > 0 ? <span aria-hidden="true">/</span> : null}
						{item.href ? (
							<Link href={item.href} className="hover:text-he-rojo">{item.label}</Link>
						) : (
							<span className="text-he-oscuro">{item.label}</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
