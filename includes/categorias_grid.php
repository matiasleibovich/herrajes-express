<?php
// Issue #4: grilla de categorías (home + productos)

if (!isset($categorias)) {
	include_once(__DIR__ . '/categorias.php');
	$categorias = categorias_herrajes_express_arbol();
}
?>
		<!-- Products category section with custom top padding -->
		<section class="hg_section pt-80 pb-80">
			<div class="container">
				<div class="row">
					<div class="col-sm-12 col-md-12">
						<h2 class="page-title subtitle_simon fw-book">
							ACCESORIOS PARA CARPINTERIA DE ALUMINIO:
						</h2>
						<ul class="products clearfix">
<?php foreach ($categorias as $categoria) { ?>
							<li class="product">
								<div class="product-list-item prod-layout-classic">
									<a href="<?= htmlspecialchars($categoria->url_productos, ENT_QUOTES, 'UTF-8') ?>">
										<span class="image kw-prodimage">
											<img class="kw-prodimage-img" src="<?= htmlspecialchars($categoria->imagen_url, ENT_QUOTES, 'UTF-8') ?>" alt="<?= htmlspecialchars($categoria->nombre, ENT_QUOTES, 'UTF-8') ?>" title="<?= htmlspecialchars($categoria->nombre, ENT_QUOTES, 'UTF-8') ?>"<?= he_imagen_fallback_onerror_attr() ?> />
										</span>
										<div class="details kw-details_simon fixclear">
											<h3 class="kw-details-title"><?= htmlspecialchars(strtoupper($categoria->nombre), ENT_QUOTES, 'UTF-8') ?><br></h3>
										</div>
									</a>
								</div>
							</li>
<?php } ?>
						</ul>
					</div>
				</div>
			</div>
		</section>
