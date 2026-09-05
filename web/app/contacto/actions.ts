"use server";

import { headers } from "next/headers";
import { contactSendMail } from "@/lib/env";

export type ContactoEstado = {
	ok: boolean;
	error?: string;
};

const intentos = new Map<string, number[]>();
const VENTANA_MS = 10 * 60 * 1000;
const MAX_INTENTOS = 5;

function recortar(texto: string, max: number): string {
	return texto.trim().slice(0, max);
}

function emailValido(valor: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function ipCliente(h: Headers): string {
	const forwarded = h.get("x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}
	return h.get("x-real-ip") || "local";
}

function rateLimitOk(ip: string): boolean {
	const ahora = Date.now();
	const prev = (intentos.get(ip) || []).filter((t) => ahora - t < VENTANA_MS);
	if (prev.length >= MAX_INTENTOS) {
		intentos.set(ip, prev);
		return false;
	}
	prev.push(ahora);
	intentos.set(ip, prev);
	return true;
}

export async function enviarContacto(_prev: ContactoEstado, formData: FormData): Promise<ContactoEstado> {
	const honeypot = String(formData.get("website") || "");
	if (honeypot.trim() !== "") {
		return { ok: true };
	}

	const h = await headers();
	if (!rateLimitOk(ipCliente(h))) {
		return { ok: false, error: "Hay demasiadas consultas desde esta conexión. Probá de nuevo en unos minutos." };
	}

	const payload = {
		name: recortar(String(formData.get("name") || ""), 35),
		lastname: recortar(String(formData.get("lastname") || ""), 35),
		email: recortar(String(formData.get("email") || ""), 80),
		ciudad: recortar(String(formData.get("ciudad") || ""), 35),
		pais: recortar(String(formData.get("pais") || ""), 35),
		empresa: recortar(String(formData.get("empresa") || ""), 35),
		web: recortar(String(formData.get("web") || ""), 50),
		telefono: recortar(String(formData.get("telefono") || ""), 35),
		subject: recortar(String(formData.get("subject") || ""), 50),
		message: recortar(String(formData.get("message") || ""), 4000),
	};

	if (!payload.name || !payload.lastname || !payload.email || !payload.ciudad || !payload.pais || !payload.empresa || !payload.telefono || !payload.subject || !payload.message) {
		return { ok: false, error: "Completá todos los campos obligatorios del formulario." };
	}
	if (!emailValido(payload.email)) {
		return { ok: false, error: "El email no tiene un formato válido." };
	}

	if (!contactSendMail()) {
		console.log("[contacto local] consulta recibida", payload);
		return { ok: true };
	}

	console.log("[contacto] envío real no configurado en esta etapa", payload.email);
	return { ok: true };
}
