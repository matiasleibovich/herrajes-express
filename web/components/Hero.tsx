"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Hero({ slides }: { slides: string[] }) {
	const [i, setI] = useState(0);
	useEffect(() => {
		if (slides.length < 2) {
			return;
		}
		const t = window.setInterval(() => {
			setI((v) => (v + 1) % slides.length);
		}, 6500);
		return () => window.clearInterval(t);
	}, [slides.length]);

	return (
		<section className="relative h-[68vh] min-h-[420px] overflow-hidden bg-he-oscuro md:h-[78vh]">
			{slides.map((src, idx) => (
				<div
					key={src + "-" + idx}
					className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
					style={{ backgroundImage: "url(" + src + ")", opacity: idx === i ? 1 : 0 }}
				/>
			))}
			<div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
			<div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />
			<div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-4">
				<div className="max-w-xl text-white">
					<p className="font-display text-[11px] font-semibold tracking-[0.32em] text-white/80">HERRAJES EXPRESS</p>
					<h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
						Accesorios para aberturas de aluminio
					</h1>
					<p className="mt-5 max-w-md text-base leading-7 text-white/80">
						Materiales nacionales e importados para carpinteros y distribuidores.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<Link href="/productos" className="bg-he-rojo px-6 py-3 font-display text-[13px] font-semibold tracking-[0.12em] text-white hover:bg-he-rojo-oscuro">
							VER CATÁLOGO
						</Link>
						<Link href="/contacto" className="border border-white/70 px-6 py-3 font-display text-[13px] font-semibold tracking-[0.12em] text-white hover:bg-white hover:text-he-oscuro">
							CONSULTANOS
						</Link>
					</div>
				</div>
			</div>
			{slides.length > 1 ? (
				<div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
					{slides.map((src, idx) => (
						<button
							key={src + "-dot-" + idx}
							type="button"
							aria-label={"Slide " + (idx + 1)}
							className={"h-1.5 rounded-full transition-all " + (idx === i ? "w-8 bg-white" : "w-2.5 bg-white/45")}
							onClick={() => setI(idx)}
						/>
					))}
				</div>
			) : null}
		</section>
	);
}
