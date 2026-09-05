"use client";

import { useActionState } from "react";
import { enviarContacto, type ContactoEstado } from "./actions";

const inicial: ContactoEstado = { ok: false };

function Campo({
	label,
	name,
	required,
	maxLength,
	placeholder,
	type = "text",
	wide,
}: {
	label: string;
	name: string;
	required?: boolean;
	maxLength?: number;
	placeholder: string;
	type?: string;
	wide?: boolean;
}) {
	return (
		<label className={"block text-[11px] font-semibold tracking-[0.14em] text-he-oscuro " + (wide ? "md:col-span-2" : "")}>
			{label}
			<input name={name} type={type} required={required} maxLength={maxLength} className="he-input" placeholder={placeholder} />
		</label>
	);
}

export function ContactoForm() {
	const [estado, action, pending] = useActionState(enviarContacto, inicial);
	return (
		<form action={action} className="grid gap-5 md:grid-cols-2">
			<div className="hidden" aria-hidden="true">
				<label htmlFor="website">Sitio web</label>
				<input id="website" name="website" tabIndex={-1} autoComplete="off" />
			</div>
			<Campo label="NOMBRE" name="name" required maxLength={35} placeholder="Por favor ingresa tu nombre" />
			<Campo label="APELLIDO" name="lastname" required maxLength={35} placeholder="Por favor ingresa tu apellido" />
			<Campo label="EMAIL" name="email" type="email" required maxLength={80} placeholder="Por favor ingresa tu email" wide />
			<Campo label="CIUDAD" name="ciudad" required maxLength={35} placeholder="Por favor ingresa tu ciudad" />
			<Campo label="PAIS" name="pais" required maxLength={35} placeholder="Por favor ingresa tu país" />
			<Campo label="EMPRESA" name="empresa" required maxLength={35} placeholder="Por favor ingresa el nombre de tu empresa" />
			<Campo label="SITIO WEB" name="web" maxLength={50} placeholder="Por favor ingresa el sitio web de tu empresa" />
			<Campo label="TELEFONO" name="telefono" required maxLength={35} placeholder="Por favor ingresa tu número de teléfono" wide />
			<Campo label="ASUNTO" name="subject" required maxLength={50} placeholder="Escribe el asunto del mensaje" wide />
			<label className="block text-[11px] font-semibold tracking-[0.14em] text-he-oscuro md:col-span-2">
				MENSAJE
				<textarea name="message" required rows={7} className="he-input" placeholder="Escribe tu mensaje" />
			</label>
			<div className="md:col-span-2">
				<button type="submit" disabled={pending} className="bg-he-rojo px-7 py-3 font-display text-[13px] font-semibold tracking-[0.12em] text-white hover:bg-he-rojo-oscuro disabled:opacity-60">
					{pending ? "ENVIANDO..." : "ENVIAR CONSULTA"}
				</button>
			</div>
			{estado.ok ? (
				<p className="md:col-span-2 text-sm font-semibold text-green-700">Recibimos tu consulta. Te vamos a responder a la brevedad.</p>
			) : null}
			{estado.error ? (
				<p className="md:col-span-2 text-sm font-semibold text-he-rojo">{estado.error}</p>
			) : null}
		</form>
	);
}
