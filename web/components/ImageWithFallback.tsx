"use client";

import { logoFallback } from "@/lib/imagenes_publicas";

export function ImageWithFallback({
	src,
	alt,
	title,
	className,
}: {
	src: string;
	alt: string;
	title?: string;
	className?: string;
}) {
	return (
		<img
			src={src}
			alt={alt}
			title={title}
			className={className}
			onError={(e) => {
				e.currentTarget.onerror = null;
				e.currentTarget.src = logoFallback();
			}}
		/>
	);
}
