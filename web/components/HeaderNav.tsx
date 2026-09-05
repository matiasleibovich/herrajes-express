"use client";

import Link from "next/link";
import { useState } from "react";
import type { CategoriaNodo } from "@/lib/catalogo";

export function HeaderNav({ categorias }: { categorias: CategoriaNodo[] }) {
	const [abierto, setAbierto] = useState(false);
	const [mega, setMega] = useState(false);

	return (
		<>
			<button
				type="button"
				className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-he-borde lg:hidden"
				aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
				onClick={() => setAbierto((v) => !v)}
			>
				<span className="flex flex-col gap-1.5">
					<span className={"block h-0.5 w-5 bg-he-oscuro transition " + (abierto ? "translate-y-2 rotate-45" : "")} />
					<span className={"block h-0.5 w-5 bg-he-oscuro transition " + (abierto ? "opacity-0" : "")} />
					<span className={"block h-0.5 w-5 bg-he-oscuro transition " + (abierto ? "-translate-y-2 -rotate-45" : "")} />
				</span>
			</button>
			<nav className={(abierto ? "flex" : "hidden") + " absolute left-0 right-0 top-full z-40 max-h-[80vh] flex-col gap-1 overflow-auto border-t border-he-borde bg-white px-4 py-5 shadow-lg lg:static lg:flex lg:max-h-none lg:flex-row lg:items-center lg:gap-1 lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"}>
				<div
					className="relative"
					onMouseEnter={() => setMega(true)}
					onMouseLeave={() => setMega(false)}
				>
					<Link
						href="/productos"
						className="block px-3 py-2 font-display text-[13px] font-semibold tracking-[0.14em] text-he-oscuro hover:text-he-rojo"
						onClick={() => setAbierto(false)}
					>
						PRODUCTOS
					</Link>
					<div className={(mega || abierto ? "grid" : "hidden") + " he-mega z-50 mt-1 grid-cols-1 gap-x-8 gap-y-5 rounded-2xl border border-he-borde bg-white p-6 lg:absolute lg:right-0 lg:w-[760px] lg:grid-cols-3"}>
						{categorias.map((cat) => (
							<div key={cat.id}>
								<Link href={"/productos/" + cat.slug} className="font-display text-[13px] font-semibold tracking-wide text-he-oscuro hover:text-he-rojo" onClick={() => setAbierto(false)}>
									{cat.nombre.toUpperCase()}
								</Link>
								{cat.subcategorias.length > 0 ? (
									<ul className="mt-2 space-y-1.5">
										{cat.subcategorias.map((sub) => (
											<li key={sub.id}>
												<Link href={"/productos/" + sub.slug} className="text-[13px] text-he-texto hover:text-he-rojo" onClick={() => setAbierto(false)}>
													{sub.nombre}
												</Link>
											</li>
										))}
									</ul>
								) : null}
							</div>
						))}
					</div>
				</div>
				<Link href="/empresa" className="px-3 py-2 font-display text-[13px] font-semibold tracking-[0.14em] text-he-oscuro hover:text-he-rojo" onClick={() => setAbierto(false)}>
					LA EMPRESA
				</Link>
				<Link href="/contacto" className="mt-2 inline-flex items-center justify-center bg-he-rojo px-5 py-2.5 font-display text-[13px] font-semibold tracking-[0.14em] text-white hover:bg-he-rojo-oscuro lg:mt-0 lg:ml-3" onClick={() => setAbierto(false)}>
					CONTACTO
				</Link>
			</nav>
		</>
	);
}
