<?php
// Issue #4: categoría sin catálogo legacy — misma estructura que detalle con mensaje amigable

if (!isset($categorias)) {
	include_once(__DIR__ . '/categorias.php');
	$categorias = categorias_herrajes_express_arbol();
}

$categoria_activa_slug = isset($categoria_activa_slug) ? $categoria_activa_slug : '';
$categoria_activa_id = isset($categoria_activa_id) ? (int)$categoria_activa_id : 0;
$nombre_banner = isset($nombre_categoria) ? $nombre_categoria : 'PRODUCTOS';
$slug_banner = isset($p1) ? $p1 : '';
$he_vacio_titulo = isset($he_vacio_titulo) ? $he_vacio_titulo : 'Próximamente';
$he_vacio_texto = isset($he_vacio_texto) ? $he_vacio_texto : 'Estamos preparando el catálogo de esta categoría.';
$imagen_categoria = '';
if (isset($categoria) && is_object($categoria) && isset($categoria->id)) {
	$parent_img = isset($categoria->parent) ? (int)$categoria->parent : 0;
	$imagen_categoria = categoria_imagen_url($categoria->id, 1, $parent_img);
}
?>
		<div id="page_header" class="page-subheader site-subheader-cst ">
			<div class="bgback"></div>
			<div class="ph-content-wrap d-flex">
				<div class="container align-self-center">
					<div class="row">
						<div class="col-sm-12 col-md-6 col-lg-6">
							<ul class="breadcrumbs fixclear">
								<li><a href="/">Home</a></li>
								<li><a href="/productos">PRODUCTOS</a></li>
<?php if ($slug_banner !== '') { ?>
								<li><a href="/productos/<?= htmlspecialchars($slug_banner, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($nombre_banner, ENT_QUOTES, 'UTF-8') ?></a></li>
<?php } ?>
							</ul>
							<div class="clearfix"></div>
						</div>
						<div class="col-sm-12 col-md-6 col-lg-6">
							<div class="subheader-titles">
								<h2 class="subheader-maintitle"><?= htmlspecialchars($nombre_banner, ENT_QUOTES, 'UTF-8') ?></h2>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<section id="content" class="hg_section pb-100">
			<div class="container">
				<div class="row">
					<div class="left_sidebar col-sm-12 col-md-12 col-lg-9 order-lg-1">
						<div class="he-categoria-vacia">
<?php if ($imagen_categoria !== '') { ?>
							<div class="he-categoria-vacia-imagen">
								<img class="kw-prodimage-img" src="<?= htmlspecialchars($imagen_categoria, ENT_QUOTES, 'UTF-8') ?>" alt="<?= htmlspecialchars($nombre_banner, ENT_QUOTES, 'UTF-8') ?>"<?= he_imagen_fallback_onerror_attr() ?>>
							</div>
<?php } ?>
							<h3 class="he-categoria-vacia-titulo"><?= htmlspecialchars($he_vacio_titulo, ENT_QUOTES, 'UTF-8') ?></h3>
							<p class="he-categoria-vacia-texto"><?= htmlspecialchars($he_vacio_texto, ENT_QUOTES, 'UTF-8') ?></p>
							<div class="he-categoria-vacia-acciones">
								<a href="/productos" class="btn btn-lined lined-custom">VER TODAS LAS CATEGORÍAS</a>
								<a href="/contacto" class="btn btn-fullcolor">CONSULTANOS</a>
							</div>
							<p class="he-categoria-vacia-whatsapp">¿Necesitás este producto ahora? <a href="https://api.whatsapp.com/send?phone=541144485714&amp;text=Hola!%20Quiero%20informarme%20sobre%20<?= rawurlencode($nombre_banner) ?>" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Escribinos por WhatsApp</a></p>
						</div>
					</div>
<?php include_once(__DIR__ . '/categorias_sidebar.php'); ?>
				</div>
			</div>
		</section>
