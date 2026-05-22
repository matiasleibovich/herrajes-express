<?php
// Issue #4: ítems de menú/sidebar con subcategorías anidadas

if (!function_exists('categorias_herrajes_express_arbol')) {
	include_once(__DIR__ . '/categorias.php');
}

function categorias_menu_render_items($items) {
	foreach ($items as $item) {
		$tiene_hijos = !empty($item->subcategorias);
		$clase_li = $tiene_hijos ? ' class="menu-item-has-children"' : '';
?>
											<li<?= $clase_li ?>><a href="<?= htmlspecialchars($item->url_productos, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars(strtoupper($item->nombre), ENT_QUOTES, 'UTF-8') ?></a><?php if ($tiene_hijos) { ?>
											<ul class="sub-menu clearfix">
<?php categorias_menu_render_items($item->subcategorias); ?>
											</ul><?php } ?>
											</li>
<?php
	}
}

function categorias_sidebar_es_activa($cat, $categoria_activa_slug, $categoria_activa_id = 0) {
	if ($categoria_activa_id > 0 && (int)$cat->id === (int)$categoria_activa_id) {
		return true;
	}
	if ($categoria_activa_slug !== '' && $cat->slug === $categoria_activa_slug) {
		return true;
	}
	if ($categoria_activa_slug === '' || empty($cat->subcategorias)) {
		return false;
	}
	foreach ($cat->subcategorias as $sub) {
		if (categorias_sidebar_es_activa($sub, $categoria_activa_slug, $categoria_activa_id)) {
			return true;
		}
	}
	return false;
}

function categorias_sidebar_render_items($items, $categoria_activa_slug = '', $categoria_activa_id = 0) {
	foreach ($items as $cat_sidebar) {
		$activa = categorias_sidebar_es_activa($cat_sidebar, $categoria_activa_slug, $categoria_activa_id);
		$tiene_hijos = !empty($cat_sidebar->subcategorias);
?>
									<h5 class="title<?php if ($activa) { echo ' active'; } ?>">
										<a href="<?= htmlspecialchars($cat_sidebar->url_productos, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars(strtoupper($cat_sidebar->nombre), ENT_QUOTES, 'UTF-8') ?></a>
									</h5>
<?php if ($tiene_hijos) { ?>
									<ul class="he-subcategorias">
<?php foreach ($cat_sidebar->subcategorias as $sub) {
			$sub_activa = categorias_sidebar_es_activa($sub, $categoria_activa_slug, $categoria_activa_id);
?>
										<li class="<?php if ($sub_activa) { echo 'active'; } ?>"><a href="<?= htmlspecialchars($sub->url_productos, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars(strtoupper($sub->nombre), ENT_QUOTES, 'UTF-8') ?></a></li>
<?php } ?>
									</ul>
<?php
		}
	}
}
