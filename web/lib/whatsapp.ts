export const WHATSAPP_NUMERO = "541144485714";

export function productoWhatsappUrl(codigo: string, titulo: string): string {
	const texto = "Hola! Quiero informarme sobre " + codigo.trim() + " - " + titulo.trim();
	return "https://api.whatsapp.com/send?phone=" + WHATSAPP_NUMERO + "&text=" + encodeURIComponent(texto);
}

export function categoriaWhatsappUrl(nombre: string): string {
	const texto = "Hola! Quiero informarme sobre " + nombre.trim();
	return "https://api.whatsapp.com/send?phone=" + WHATSAPP_NUMERO + "&text=" + encodeURIComponent(texto);
}

export function whatsappGeneralUrl(): string {
	return "https://api.whatsapp.com/send?phone=" + WHATSAPP_NUMERO + "&text=" + encodeURIComponent("Hola! Quiero informarme acerca de...");
}
