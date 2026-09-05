export function SectionTitle({ kicker, title }: { kicker?: string; title: string }) {
	return (
		<div className="max-w-2xl">
			{kicker ? (
				<p className="font-display text-[11px] font-semibold tracking-[0.28em] text-he-rojo">{kicker}</p>
			) : null}
			<h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-he-oscuro md:text-3xl">
				{title}
			</h2>
			<span className="mt-4 block h-0.5 w-12 bg-he-rojo" />
		</div>
	);
}
