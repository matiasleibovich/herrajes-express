type Entrada<T> = { exp: number; valor: T };

const store = new Map<string, Entrada<unknown>>();
const TTL_MS = 60_000;

export async function cachear<T>(clave: string, fn: () => Promise<T>): Promise<T> {
	const hit = store.get(clave);
	if (hit && hit.exp > Date.now()) {
		return hit.valor as T;
	}
	const valor = await fn();
	store.set(clave, { exp: Date.now() + TTL_MS, valor });
	return valor;
}

export function cacheLimpiar(): void {
	store.clear();
}
