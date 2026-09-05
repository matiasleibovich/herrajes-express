import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import type { RowDataPacket } from "mysql2";
import { cachear } from "./cache";
import { queryRows } from "./db";
import { productosImagesDir } from "./env";

const SLUG_EXCEPCIONES: Record<string, string> = {
	Rodamientos: "ruedas",
	"Herrajes Varios": "varios",
};

const SAFE_CODIGO = /^[A-Za-z0-9._-]+$/;

export type FotoWeb = {
	existe: boolean;
	codigo: string;
	path: string;
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
};

export type CategoriaNodo = CategoriaWeb & { subcategorias: CategoriaNodo[] };

type ProductoRow = RowDataPacket & {
	id: number;
	codigo_producto: string;
	codigo_unico: string;
	codigo_referencia: string | null;
	titulo: string;
	color: string | null;
	medida_fija: string | number | null;
	medida_variable: string | number | null;
	medida_unidad: string | null;
	categoria_id: number;
	activo: number | string;
	discontinuo: number | string;
	stock: string | number;
};

type CategoriaRow = RowDataPacket & {
	id: number;
	nombre: string;
	parent: number;
	orden: number;
	activo: number | string;
};

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

export function catalogoWebAgrupador(producto: { codigo_producto?: string | null }): string {
	return String(producto.codigo_producto ?? "").trim();
}

function pregQuote(valor: string): string {
	return valor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function catalogoWebVariante(titulo: string, color = ""): string {
	let t = String(titulo).trim();
	if (t === "") {
		return "";
	}
	const colorTrim = String(color).trim();
	if (colorTrim !== "") {
		const quoted = pregQuote(colorTrim);
		const baseFin = t.replace(new RegExp("\\s+" + quoted + "\\s*$", "iu"), "");
		if (baseFin !== t) {
			t = baseFin.trim();
		} else {
			t = t.replace(new RegExp("\\b" + quoted + "\\b", "iu"), "").trim();
		}
	}
	t = t.replace(/\([^)]*\)/gu, "");
	t = t.replace(/\s+(caja|cajas|bolsa|bolsas|pack|packs)\s*x\s*\d+(\s*(rollos?|unidades?))?/giu, "");
	t = t.replace(/\s{2,}/gu, " ");
	return t.trim();
}

export function catalogoWebEsInterno(titulo: string): boolean {
	return String(titulo).toLowerCase().includes("oferta");
}

export function catalogoWebMedidasDesdeTitulo(titulo: string): string[] {
	const out: string[] = [];
	const re = /\(([^)]+)\)/gu;
	let m: RegExpExecArray | null;
	while ((m = re.exec(String(titulo))) !== null) {
		const medida = m[1].trim();
		if (medida !== "") {
			out.push(medida);
		}
	}
	return out;
}

function phpStrcasecmp(a: string, b: string): number {
	const fold = (s: string) => s.replace(/[A-Z]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 32));
	const fa = fold(a);
	const fb = fold(b);
	if (fa < fb) return -1;
	if (fa > fb) return 1;
	return 0;
}

function sortString(valores: string[]): string[] {
	return [...valores].sort();
}

function mbStrtoupper(valor: string): string {
	return valor.toLocaleUpperCase("en-US");
}

export async function catalogoWebCategoriaIds(categoriaId: number): Promise<number[]> {
	const id = Number(categoriaId);
	if (!Number.isFinite(id) || id <= 0) {
		return [];
	}
	const hijos = await queryRows<RowDataPacket>(
		`SELECT id FROM productos_categorias
		WHERE listado = 'Herrajes' AND activo = 1 AND parent = ?
		ORDER BY orden, id`,
		[id],
	);
	const ids = [id, ...hijos.map((h) => Number(h.id))];
	return [...new Set(ids)];
}

export function catalogoWebFotoDir(): string {
	return productosImagesDir() + "/";
}

export function catalogoWebFoto(
	agrupador: string,
	codigosProducto: string[],
	codigosUnicos: string[],
	slot = 1,
): FotoWeb {
	let slotN = Number(slot);
	if (!Number.isFinite(slotN) || slotN <= 0) {
		slotN = 1;
	}
	const dir = catalogoWebFotoDir();
	const candidatos: string[] = [];
	const cps = sortString([...new Set(codigosProducto.map((c) => String(c).trim()).filter((c) => c !== ""))]);
	for (const cp of cps) {
		if (cp !== "" && SAFE_CODIGO.test(cp)) {
			candidatos.push(cp);
		}
	}
	const agr = String(agrupador).trim();
	if (agr !== "" && SAFE_CODIGO.test(agr) && !candidatos.includes(agr)) {
		candidatos.push(agr);
	}
	const cus = sortString([...new Set(codigosUnicos.map((c) => String(c).trim()).filter((c) => c !== ""))]);
	for (const cu of cus) {
		if (cu !== "" && SAFE_CODIGO.test(cu) && !candidatos.includes(cu)) {
			candidatos.push(cu);
		}
	}

	const vacia: FotoWeb = { existe: false, codigo: "", path: "", url: "" };
	for (const codigo of candidatos) {
		const path = dir + codigo + "-" + slotN + ".jpg";
		if (existsSync(path)) {
			try {
				statSync(path);
				const mtime = statSync(path).mtimeMs;
				return {
					existe: true,
					codigo,
					path,
					url: "images/productos/" + codigo + "-" + slotN + ".jpg?v=" + Math.floor(mtime / 1000),
				};
			} catch {
				continue;
			}
		}
	}
	return vacia;
}

export async function catalogoWebFichasPorCategoria(categoriaId: number): Promise<FichaWeb[]> {
	const ids = await catalogoWebCategoriaIds(categoriaId);
	if (ids.length === 0) {
		return [];
	}
	const placeholders = ids.map(() => "?").join(",");
	const rows = await queryRows<ProductoRow>(
		`SELECT p.id, p.codigo_producto, p.codigo_unico, p.codigo_referencia, p.titulo, p.color,
			p.medida_fija, p.medida_variable, p.medida_unidad, p.categoria_id, p.activo, p.discontinuo,
			sg.stock
		FROM productos p
		INNER JOIN stock_general sg ON sg.codigo_unico = p.codigo_unico
		WHERE p.categoria_id IN (${placeholders})
			AND p.activo = 1
			AND p.discontinuo = 0
			AND sg.stock > 0
		ORDER BY p.codigo_producto, p.titulo, p.codigo_unico`,
		ids,
	);
	if (rows.length === 0) {
		return [];
	}

	type Grupo = {
		agrupador: string;
		variante: string;
		categoria_id: number;
		referencia: string;
		filas: ProductoRow[];
	};
	const grupos = new Map<string, Grupo>();
	for (const row of rows) {
		if (catalogoWebEsInterno(String(row.titulo ?? ""))) {
			continue;
		}
		const agrupador = catalogoWebAgrupador(row);
		let variante = catalogoWebVariante(String(row.titulo ?? ""), String(row.color ?? ""));
		if (variante === "") {
			variante = String(row.titulo ?? "").trim();
		}
		const catFila = Number(row.categoria_id);
		const key = mbStrtoupper(catFila + "|" + agrupador + "|" + variante);
		if (!grupos.has(key)) {
			grupos.set(key, {
				agrupador,
				variante,
				categoria_id: catFila,
				referencia: String(row.codigo_referencia ?? "").trim(),
				filas: [],
			});
		}
		grupos.get(key)!.filas.push(row);
	}

	const fichas: FichaWeb[] = [];
	for (const grupo of grupos.values()) {
		const codigosUnicos: string[] = [];
		const codigosProducto: string[] = [];
		const colores = new Map<string, string>();
		const medidas = new Map<string, string>();
		let stockTotal = 0;
		for (const f of grupo.filas) {
			const cu = String(f.codigo_unico ?? "").trim();
			if (cu !== "" && !codigosUnicos.includes(cu)) {
				codigosUnicos.push(cu);
			}
			const cp = String(f.codigo_producto ?? "").trim();
			if (cp !== "" && !codigosProducto.includes(cp)) {
				codigosProducto.push(cp);
			}
			const color = String(f.color ?? "").trim();
			if (color !== "") {
				colores.set(mbStrtoupper(color), color);
			}
			for (const medida of catalogoWebMedidasDesdeTitulo(String(f.titulo ?? ""))) {
				medidas.set(medida, medida);
			}
			stockTotal += Number(f.stock);
		}
		const unicosOrdenados = sortString(codigosUnicos);
		const productosOrdenados = sortString(codigosProducto);
		const foto = catalogoWebFoto(grupo.agrupador, productosOrdenados, unicosOrdenados);
		fichas.push({
			categoria_id: grupo.categoria_id,
			agrupador: grupo.agrupador,
			codigo_referencia: grupo.referencia,
			variante: grupo.variante,
			titulo: grupo.variante,
			codigos_unicos: unicosOrdenados,
			codigos_producto: productosOrdenados,
			colores: [...colores.values()],
			medidas: [...medidas.values()],
			stock_total: stockTotal,
			foto,
		});
	}

	fichas.sort((a, b) => {
		const cmp = phpStrcasecmp(a.agrupador, b.agrupador);
		if (cmp !== 0) {
			return cmp;
		}
		return phpStrcasecmp(a.titulo, b.titulo);
	});
	return fichas;
}

export async function catalogoWebCategorias(): Promise<CategoriaWeb[]> {
	const rows = await queryRows<CategoriaRow>(
		`SELECT pc.id, pc.nombre, pc.parent, pc.orden, pc.activo
		FROM productos_categorias pc
		WHERE pc.listado = 'Herrajes' AND pc.activo = 1
			AND (
				pc.parent = 4
				OR pc.parent IN (
					SELECT id FROM productos_categorias
					WHERE listado = 'Herrajes' AND parent = 4 AND activo = 1
				)
			)
		ORDER BY pc.orden, pc.id`,
	);
	const categorias: CategoriaWeb[] = rows.map((row) => ({
		id: Number(row.id),
		nombre: String(row.nombre),
		parent: Number(row.parent),
		slug: catalogoWebSlugDesdeNombre(String(row.nombre)),
		titulo: String(row.nombre),
		orden: Number(row.orden),
		fichas_count: 0,
	}));
	for (const cat of categorias) {
		const fichas = await catalogoWebFichasPorCategoria(cat.id);
		cat.fichas_count = fichas.length;
	}
	return categorias;
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
