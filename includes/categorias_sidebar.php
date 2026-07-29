<?php
// Issue #4: sidebar de categorías con subcategorías anidadas

include_once(__DIR__ . '/categorias_menu.php');

if (!isset($categorias)) {
	include_once(__DIR__ . '/categorias.php');
	$categorias = categorias_herrajes_express_arbol();
} elseif (!empty($categorias) && !isset($categorias[0]->subcategorias)) {
	// Lista plana legacy: reconstruir árbol
	$flat = $categorias;
	$categorias = categorias_herrajes_express_arbol();
	if (empty($categorias)) {
		$categorias = $flat;
	}
}

$categoria_activa_slug = isset($categoria_activa_slug) ? $categoria_activa_slug : '';
$categoria_activa_id = isset($categoria_activa_id) ? (int)$categoria_activa_id : 0;
?>
					<div class="col-sm-12 col-md-12 col-lg-3">
						<div id="sidebar-widget" class="sidebar">
							<div id="kl-store_product_categories-2" class="widget kl-store widget_product_categories">
								<h5><strong>CATEGORIAS:</strong></h5>
								<div class="hg_separator clearfix mb-20"></div>
								<ul class="product-categories">
<?php categorias_sidebar_render_items($categorias, $categoria_activa_slug, $categoria_activa_id); ?>
								</ul>
							</div>
						</div>
					</div>
