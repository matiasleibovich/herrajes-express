import { cachear } from "./cache";
import { catalogoApiGet } from "./catalogoApi";

const SLUG_EXCEPCIONES: Record<string, string> = {
	Rodamientos: "ruedas",
	"Herrajes Varios": "varios",
};

export type FotoWeb = {
	existe: boolean;
	codigo: string;
	url: string;
};

export type FichaWeb = {
	categoria_id: number;
	agrupador: string;
	codigo_referencia: string;
	variante: string;
	titulo: string;
	codigos_unicos: string[];
	codigos_producto: string[];
	colores: string[];
	medidas: string[];
	stock_total: number;
	foto: FotoWeb;
};

export type CategoriaWeb = {
	id: number;
	nombre: string;
	parent: number;
	slug: string;
	titulo: string;
	orden: number;
	fichas_count: number;
	imagen_url: string;
};

export type CategoriaNodo = CategoriaWeb & { subcategorias: CategoriaNodo[] };

function mbStrtoupper(valor: string): string {
	return valor.toLocaleUpperCase("en-US");
}

function fotoDesdeApi(raw: Partial<FotoWeb> | null | undefined): FotoWeb {
	return {
		existe: Boolean(raw?.existe),
		codigo: String(raw?.codigo ?? ""),
		url: String(raw?.url ?? ""),
	};
}

function categoriaDesdeApi(raw: CategoriaWeb): CategoriaWeb {
	return {
		id: Number(raw.id),
		nombre: String(raw.nombre ?? ""),
		parent: Number(raw.parent),
		slug: String(raw.slug ?? ""),
		titulo: String(raw.titulo ?? raw.nombre ?? ""),
		orden: Number(raw.orden),
		fichas_count: Number(raw.fichas_count),
		imagen_url: String(raw.imagen_url ?? ""),
	};
}

function fichaDesdeApi(raw: FichaWeb): FichaWeb {
	return {
		categoria_id: Number(raw.categoria_id),
		agrupador: String(raw.agrupador ?? ""),
		codigo_referencia: String(raw.codigo_referencia ?? ""),
		variante: String(raw.variante ?? ""),
		titulo: String(raw.titulo ?? ""),
		codigos_unicos: Array.isArray(raw.codigos_unicos) ? raw.codigos_unicos.map(String) : [],
		codigos_producto: Array.isArray(raw.codigos_producto) ? raw.codigos_producto.map(String) : [],
		colores: Array.isArray(raw.colores) ? raw.colores.map(String) : [],
		medidas: Array.isArray(raw.medidas) ? raw.medidas.map(String) : [],
		stock_total: Number(raw.stock_total),
		foto: fotoDesdeApi(raw.foto),
	};
}

export function catalogoWebSlugExcepciones(): Record<string, string> {
	return { ...SLUG_EXCEPCIONES };
}

export function catalogoWebSlugDesdeNombre(nombre: string): string {
	const excepciones = catalogoWebSlugExcepciones();
	if (Object.prototype.hasOwnProperty.call(excepciones, nombre)) {
		return excepciones[nombre];
	}
	let slug = nombre.trim().toLowerCase();
	slug = slug.replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e").replace(/[íìïî]/g, "i");
	slug = slug.replace(/[óòöô]/g, "o").replace(/[úùüû]/g, "u").replace(/[ñ]/g, "n");
	slug = slug.replace(/[^a-z0-9]+/g, "-");
	return slug.replace(/^-+|-+$/g, "");
}

export function catalogoWebEsInterno(titulo: string): boolean {
	return String(titulo).toLowerCase().includes("oferta");
}

export async function catalogoWebCategorias(): Promise<CategoriaWeb[]> {
	const data = await catalogoApiGet<CategoriaWeb[]>("catalogo_web_categorias");
	return data.map(categoriaDesdeApi);
}

export async function catalogoWebFichasPorCategoria(categoriaId: number): Promise<FichaWeb[]> {
	const id = Number(categoriaId);
	if (!Number.isFinite(id) || id <= 0) {
		return [];
	}
	const data = await catalogoApiGet<FichaWeb[]>("catalogo_web_fichas", {
		categoria_id: String(id),
	});
	return data.map(fichaDesdeApi);
}

export async function categorias(): Promise<CategoriaWeb[]> {
	return cachear("categorias", catalogoWebCategorias);
}

export async function fichasPorCategoria(categoriaId: number): Promise<FichaWeb[]> {
	return cachear("fichas:" + categoriaId, () => catalogoWebFichasPorCategoria(categoriaId));
}

export async function categoriasArbol(): Promise<CategoriaNodo[]> {
	const all = await categorias();
	const porId = new Map<number, CategoriaNodo>();
	for (const c of all) {
		porId.set(c.id, { ...c, subcategorias: [] });
	}
	const raiz: CategoriaNodo[] = [];
	for (const c of all) {
		const nodo = porId.get(c.id)!;
		if (c.parent === 4) {
			raiz.push(nodo);
		} else {
			const padre = porId.get(c.parent);
			if (padre) {
				padre.subcategorias.push(nodo);
			}
		}
	}
	return raiz;
}

export async function categoriasRaiz(): Promise<CategoriaNodo[]> {
	return categoriasArbol();
}

export async function categoriaPorSlug(slug: string): Promise<CategoriaWeb | null> {
	const all = await categorias();
	return all.find((c) => c.slug === slug) ?? null;
}

export function claveFicha(ficha: Pick<FichaWeb, "categoria_id" | "agrupador" | "variante">): string {
	return mbStrtoupper(ficha.categoria_id + "|" + ficha.agrupador + "|" + ficha.variante);
}

export function fichaParaDiff(ficha: FichaWeb) {
	return {
		categoria_id: ficha.categoria_id,
		agrupador: ficha.agrupador,
		codigo_referencia: ficha.codigo_referencia,
		variante: ficha.variante,
		titulo: ficha.titulo,
		codigos_unicos: ficha.codigos_unicos,
		codigos_producto: ficha.codigos_producto,
		colores: ficha.colores,
		medidas: ficha.medidas,
		stock_total: ficha.stock_total,
	};
}
