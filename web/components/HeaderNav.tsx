"use client";

import Link from "next/link";
import { useState } from "react";
import type { CategoriaNodo } from "@/lib/catalogo";
import { nombreCategoriaCorto } from "@/lib/catalogo";

export function HeaderNav({ categorias }: { categorias: CategoriaNodo[] }) {
	const [abierto, setAbierto] = useState(false);
	const [mega, setMega] = useState(false);
	const hojas = categorias.filter((cat) => cat.subcategorias.length === 0);
	const conTipos = categorias.filter((cat) => cat.subcategorias.length > 0);

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
					<div className={(mega || abierto ? "flex" : "hidden") + " he-mega z-50 mt-1 flex-col gap-5 rounded-2xl border border-he-borde bg-white p-6 lg:absolute lg:right-0 lg:w-200"}>
						<div className="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-3">
							{hojas.map((cat) => (
								<Link
									key={cat.id}
									href={"/productos/" + cat.slug}
									className="font-display text-[13px] font-semibold tracking-wide text-he-oscuro hover:text-he-rojo"
									onClick={() => setAbierto(false)}
								>
									{cat.nombre.toUpperCase()}
								</Link>
							))}
						</div>
						{conTipos.map((cat) => (
							<div key={cat.id} className="border-t border-he-borde pt-4">
								<Link
									href={"/productos/" + cat.slug}
									className="font-display text-[13px] font-semibold tracking-wide text-he-oscuro hover:text-he-rojo"
									onClick={() => setAbierto(false)}
								>
									{cat.nombre.toUpperCase()}
								</Link>
								<ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
									{cat.subcategorias.map((sub) => (
										<li key={sub.id}>
											<Link
												href={"/productos/" + sub.slug}
												className="block rounded-lg px-2 py-1.5 text-[13px] leading-snug text-he-texto hover:bg-he-fondo hover:text-he-rojo"
												onClick={() => setAbierto(false)}
											>
												{nombreCategoriaCorto(sub.nombre, cat.nombre)}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
				<Link href="/empresa" className="px-3 py-2 font-display text-[13px] font-semibold tracking-[0.14em] text-he-oscuro hover:text-he-rojo" onClick={() => setAbierto(false)}>
					LA EMPRESA
				</Link>
				<Link href="/contacto" className="mt-2 inline-flex items-center justify-center bg-he-rojo px-5 py-2.5 font-display text-[13px] font-semibold tracking-[0.14em] text-white hover:bg-he-rojo-oscuro hover:text-white lg:mt-0 lg:ml-3" onClick={() => setAbierto(false)}>
					CONTACTO
				</Link>
			</nav>
		</>
	);
}
