<?php
// Issue #4: listado de categorías y detalle con shell PHP unificado

include_once('includes/categorias.php');
include_once('includes/legacy_categoria.php');

$p1 = isset($_GET['p1']) ? trim($_GET['p1']) : '';

function productos_mostrar_pagina_vacia($p1, $categoria, $he_vacio_titulo, $he_vacio_texto) {
	$categorias = categorias_herrajes_express_arbol();
	$categoria_activa_slug = $p1;
	$categoria_activa_id = ($categoria && isset($categoria->id)) ? (int)$categoria->id : 0;
	$nombre_categoria = ($categoria && isset($categoria->nombre)) ? strtoupper($categoria->nombre) : strtoupper(str_replace('-', ' ', $p1));

	include_once('header.php');
	include_once('menu.php');
	include_once('includes/categoria_pagina_vacia.php');
	include_once('footer.php');
	exit;
}

if ($p1 !== '') {
	$categoria = categoria_por_slug($p1);
	if (!$categoria) {
		header('HTTP/1.0 404 Not Found');
		$he_vacio_titulo = 'Categoría no encontrada';
		$he_vacio_texto = 'La categoría que buscás no existe o fue movida. Podés ver el listado completo de productos.';
		productos_mostrar_pagina_vacia($p1, null, $he_vacio_titulo, $he_vacio_texto);
	}

	$legacy_url = categoria_redirect_legacy_url($p1);
	if ($legacy_url === '') {
		$he_vacio_titulo = 'Catálogo en preparación';
		$he_vacio_texto = 'Esta categoría ya está disponible en nuestro sistema. El detalle de productos se publicará en breve.';
		productos_mostrar_pagina_vacia($p1, $categoria, $he_vacio_titulo, $he_vacio_texto);
	}

	$legacy_slug = categoria_legacy_slug_desde_url($legacy_url);
	$productos_html = legacy_categoria_productos_html($legacy_slug);
	if ($productos_html === '') {
		$he_vacio_titulo = 'Catálogo en preparación';
		$he_vacio_texto = 'Esta categoría ya está disponible en nuestro sistema. El detalle de productos se publicará en breve.';
		productos_mostrar_pagina_vacia($p1, $categoria, $he_vacio_titulo, $he_vacio_texto);
	}

	$categorias = categorias_herrajes_express_listar();
	$categoria_activa_slug = $p1;
	$categoria_activa_id = (int)$categoria->id;
	$nombre_categoria = strtoupper($categoria->nombre);

	include_once('header.php');
	include_once('menu.php');
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
								<li><a href="/productos/<?= htmlspecialchars($p1, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($nombre_categoria, ENT_QUOTES, 'UTF-8') ?></a></li>
							</ul>
							<div class="clearfix"></div>
						</div>
						<div class="col-sm-12 col-md-6 col-lg-6">
							<div class="subheader-titles">
								<h2 class="subheader-maintitle"><?= htmlspecialchars($nombre_categoria, ENT_QUOTES, 'UTF-8') ?></h2>
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
						<?= $productos_html ?>
					</div>
<?php include_once('includes/categorias_sidebar.php'); ?>
				</div>
			</div>
		</section>
<?php
	include_once('footer.php');
	exit;
}

$categorias = categorias_herrajes_express_listar();
include_once('header.php');
include_once('menu.php');
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
							</ul>
							<div class="clearfix"></div>
						</div>
						<div class="col-sm-12 col-md-6 col-lg-6">
							<div class="subheader-titles">
								<h2 class="subheader-maintitle">PRODUCTOS</h2>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
<?php
include_once('includes/categorias_grid.php');
include_once('footer.php');
?>
