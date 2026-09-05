import type { FichaWeb } from "@/lib/catalogo";

export type OpcionFiltro = {
	valor: string;
	label: string;
};

export type FiltrosCatalogo = {
	colores: string[];
	medidas: string[];
};

export function normalizarFiltro(valor: string): string {
	const texto = String(valor || "")
		.trim()
		.replace(/\s+/g, " ");
	if (texto === "") {
		return "";
	}
	return texto
		.toLocaleLowerCase("es")
		.replace(/\s*[xX]\s*/g, "x")
		.replace(/\s*mm\b/gi, "mm");
}

function ordenarOpciones(opciones: OpcionFiltro[]): OpcionFiltro[] {
	return opciones.sort((a, b) => {
		const na = parseFloat(a.valor.replace(",", "."));
		const nb = parseFloat(b.valor.replace(",", "."));
		if (Number.isFinite(na) && Number.isFinite(nb) && na !== nb) {
			return na - nb;
		}
		return a.label.localeCompare(b.label, "es", { sensitivity: "base" });
	});
}

function opcionesDesdeListas(listas: string[][]): OpcionFiltro[] {
	const porClave = new Map<string, OpcionFiltro>();
	for (const lista of listas) {
		for (const raw of lista) {
			const label = String(raw || "").trim();
			const valor = normalizarFiltro(label);
			if (valor === "" || porClave.has(valor)) {
				continue;
			}
			porClave.set(valor, { valor, label });
		}
	}
	return ordenarOpciones(Array.from(porClave.values()));
}

export function opcionesColor(fichas: FichaWeb[]): OpcionFiltro[] {
	return opcionesDesdeListas(fichas.map((f) => f.colores));
}

export function opcionesMedida(fichas: FichaWeb[]): OpcionFiltro[] {
	return opcionesDesdeListas(fichas.map((f) => f.medidas));
}

export function valoresQueryValidos(raw: string[], opciones: OpcionFiltro[]): string[] {
	const validos = new Set(opciones.map((o) => o.valor));
	const out: string[] = [];
	const vistos = new Set<string>();
	for (const item of raw) {
		const valor = normalizarFiltro(item);
		if (valor === "" || !validos.has(valor) || vistos.has(valor)) {
			continue;
		}
		vistos.add(valor);
		out.push(valor);
	}
	return out;
}

function fichaTieneAlguno(lista: string[], seleccion: string[]): boolean {
	if (seleccion.length === 0) {
		return true;
	}
	const claves = new Set(lista.map(normalizarFiltro).filter((v) => v !== ""));
	return seleccion.some((valor) => claves.has(valor));
}

export function filtrarFichas<T extends FichaWeb>(fichas: T[], filtros: FiltrosCatalogo): T[] {
	return fichas.filter((ficha) => {
		if (!fichaTieneAlguno(ficha.colores, filtros.colores)) {
			return false;
		}
		if (!fichaTieneAlguno(ficha.medidas, filtros.medidas)) {
			return false;
		}
		return true;
	});
}
