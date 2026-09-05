import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export function PageHeader({ title, crumbs }: { title: string; crumbs: Crumb[] }) {
	return (
		<div className="border-b border-he-borde bg-white">
			<div className="mx-auto max-w-6xl px-4 py-10">
				<Breadcrumbs items={crumbs} />
				<h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-he-oscuro md:text-4xl">{title}</h1>
				<span className="mt-4 block h-0.5 w-12 bg-he-rojo" />
			</div>
		</div>
	);
}
