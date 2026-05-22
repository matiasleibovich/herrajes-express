<?php
include_once(__DIR__ . '/includes/categorias.php');
include_once(__DIR__ . '/includes/categorias_menu.php');
$categorias_menu = categorias_herrajes_express_arbol();
?>
<body class="kl-store-page preloader">


	<!-- Page Wrapper -->
	<div id="page_wrapper">

		<!-- Header style 7 -->
		<header id="header" class="site-header cta_button" data-header-style="7">
			<!-- Header wrapper -->
			<div class="kl-main-header">
				<!-- Header Main container -->
				<div class="siteheader-container container d-flex">
					<!-- Header Left wrapper -->
					<div class="site-header-left-wrapper">
						<!-- Logo container-->
						<div class="logo-container hasInfoCard logosize--yes d-flex align-items-center justify-content-center">
							<!-- Logo -->
							<h1 class="site-logo logo" id="logo">
								<a href="/" title="">
									<img src="/images/herrajes_express_logo.svg" class="logo-img" alt="HERRAJES EXPRESS" title="HERRAJES EXPRESS, Accesorios para aberturas de aluminio" />
								</a>
							</h1>
							<!--/ Logo -->


						</div>
						<!--/ logo container-->


					</div>
					<!--/ Header Left wrapper -->



					<!-- Header Right wrapper -->
					<div class="site-header-right-wrapper col align-self-center">

						<!-- Header Bottom row -->
						<div class="site-header-row site-header-bottom d-flex flex-row justify-content-between">
							<!-- Main Menu wrapper -->
							<div class="main-menu-wrapper col d-flex justify-content-end align-self-end">

								<!-- Responsive menu trigger -->
								<div id="zn-res-menuwrapper">
									<a href="#" class="zn-res-trigger zn-header-icon"></a>
								</div>
								<!--/ responsive menu trigger -->


								<!-- Main menu -->
								<div id="main-menu" class="main-nav zn_mega_wrapper">
									<ul id="menu-main-menu" class="main-menu zn_mega_menu">



										<li class="menu-item-has-children"><a href="/productos">PRODUCTOS</a>
											<ul class="sub-menu clearfix">
<?php categorias_menu_render_items($categorias_menu); ?>
											</ul>
										</li>


										<li class="menu-item-has-children menu-item-mega-parent"><a href="/empresa">LA EMPRESA</a></li>

										<li class="menu-item-has-children"><a href="/contacto">CONTACTO</a></li>


									</ul>


								</div>
								<!--/ Main menu -->
							</div>
							<!--/ .main-menu-wrapper .col .d-flex .justify-content-end-->


						</div>
						<!--/ .site-header-row .site-header-bottom -->
					</div>
					<!--/ Header Right wrapper -->
				</div>
				<!--/ Header Main container -->
			</div>
			<!--/ Header wrapper -->
		</header>
		<!--/ Header style 7 -->
