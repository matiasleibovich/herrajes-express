<?php
// Issue #8: grilla Kallyas de productos en stock (listado por categoría)

if (!isset($productos_web) || !is_array($productos_web)) {
	$productos_web = array();
}
?>
						<ul class="products clearfix">
<?php foreach ($productos_web as $producto) {
	$titulo_mostrar = strtoupper($producto->titulo);
	$alt = $producto->titulo;
	if (!empty($producto->codigo)) {
		$alt = $producto->codigo . ' - ' . $producto->titulo;
	}
?>
							<li class="product">
								<div class="product-list-item prod-layout-classic">
									<a href="<?= htmlspecialchars($producto->whatsapp_url, ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noopener">
										<span class="image kw-prodimage">
											<img class="kw-prodimage-img" src="<?= htmlspecialchars($producto->imagen_url, ENT_QUOTES, 'UTF-8') ?>" alt="<?= htmlspecialchars($alt, ENT_QUOTES, 'UTF-8') ?>" title="<?= htmlspecialchars($alt, ENT_QUOTES, 'UTF-8') ?>"<?= he_imagen_fallback_onerror_attr() ?> />
										</span>
										<div class="details kw-details_simon fixclear">
											<h3 class="kw-details-title"><?= htmlspecialchars($titulo_mostrar, ENT_QUOTES, 'UTF-8') ?><br></h3>
										</div>
									</a>
								</div>
							</li>
<?php } ?>
						</ul>
