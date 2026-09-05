export const WHATSAPP_NUMERO = "541144485714";

function whatsappNumero(numero?: string): string {
	const limpio = String(numero || "").replace(/[^0-9]/g, "");
	return limpio !== "" ? limpio : WHATSAPP_NUMERO;
}

export function productoWhatsappUrl(codigo: string, titulo: string, numero?: string): string {
	const texto = "Hola! Quiero informarme sobre " + codigo.trim() + " - " + titulo.trim();
	return "https://api.whatsapp.com/send?phone=" + whatsappNumero(numero) + "&text=" + encodeURIComponent(texto);
}

export function categoriaWhatsappUrl(nombre: string, numero?: string): string {
	const texto = "Hola! Quiero informarme sobre " + nombre.trim();
	return "https://api.whatsapp.com/send?phone=" + whatsappNumero(numero) + "&text=" + encodeURIComponent(texto);
}

export function whatsappGeneralUrl(numero?: string): string {
	return "https://api.whatsapp.com/send?phone=" + whatsappNumero(numero) + "&text=" + encodeURIComponent("Hola! Quiero informarme acerca de...");
}
