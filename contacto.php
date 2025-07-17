<?php
include_once('header.php');
include_once('menu.php');
?>

		<!-- Page sub-header + Bottom mask style 3 -->
		<div id="page_header" class="page-subheader site-subheader-cst ">
			<div class="bgback"></div>



			<!-- Sub-Header content wrapper -->
			<div class="ph-content-wrap d-flex">
				<div class="container align-self-center">
					<div class="row">
						<div class="col-sm-12 col-md-12">


							<!-- Action box element style 1 arrow center -->
							<div class="action_box_simon style1" data-arrowpos="center">
								<div class="action_box_inner container">
									<div class="action_box_content row">
										<!-- Content -->
										<div class="ac-content-text col-sm-12 col-md-12 col-lg-7 mb-md-20">
											<!-- Title -->
											<h1 class="subtitle_simon">
												DEJANOS TU CONSULTA:
											</h1>
											<!-- Sub-title -->
											<h4 class="ac-subtitle_simon">
												Completa el formulario y te contestaremos a la brevedad.
											</h4>
										</div>
										<!--/ Content col-sm-12 col-md-12 col-lg-7 mb-md-20 -->


									</div>
									<!--/ .action_box_content -->
								</div>
								<!--/ .action_box_inner -->
							</div>
							<!--/ Action box element style 1 .action_box -->
						</div>
						<!--/ col-md-12 col-sm-12 -->
					</div>
					<!--/ row -->
				</div>
				<!--/ .container .align-self-center -->
			</div>
			<!--/ Sub-Header content wrapper .d-flex -->


		</div>
		<!--/ Page sub-header + Bottom mask style 3 -->




		<!-- Contact form element & details section with custom paddings -->
		<section class="hg_section_simon_color_form pt-20 pb-80">
			<div class="container">
				<div class="row">
					<div class="col-sm-12 col-md-12">

					</div>
					<!--/ col-sm-12 col-md-12 -->

					<div class="col-sm-12 col-md-9 col-lg-9 mb-sm-30">
						<!-- Contact form element -->
						<div class="contactForm">
							<form action="php_helpers/_contact-process.php" method="post" class="contact_form row" enctype="multipart/form-data">
								<!-- Response wrapper -->
								<div class="cf_response"></div>

								<div class="col-sm-6 kl-fancy-form">
									<input type="text" name="name" id="cf_name" class="form-control" placeholder="Por favor ingresa tu nombre" value="" tabindex="1" maxlength="35" required>
									<label class="control-label">
										NOMBRE
									</label>
								</div>

								<div class="col-sm-6 kl-fancy-form">
									<input type="text" name="lastname" id="cf_lastname" class="form-control" placeholder="Por favor ingresa tu apellido" value="" tabindex="1" maxlength="35" required>
									<label class="control-label">
										APELLIDO
									</label>
								</div>

								<div class="col-sm-12 kl-fancy-form">
									<input type="text" name="email" id="cf_email" class="form-control h5-email" placeholder="Por favor ingresa tu email" value="" tabindex="1" maxlength="35" required>
									<label class="control-label">
										EMAIL
									</label>
								</div>

								<div class="col-sm-6 kl-fancy-form">
									<input type="text" name="ciudad" id="cf_ciudad" class="form-control" placeholder="Por favor ingresa tu ciudad" value="" tabindex="1" maxlength="35" required>
									<label class="control-label">
										CIUDAD
									</label>
								</div>

								<div class="col-sm-6 kl-fancy-form">
									<input type="text" name="pais" id="cf_pais" class="form-control" placeholder="Por favor ingresa tu pa&iacute;s" value="" tabindex="1" maxlength="35" required>
									<label class="control-label">
										PAIS
									</label>
								</div>

								<div class="col-sm-6 kl-fancy-form">
									<input type="text" name="empresa" id="cf_empresa" class="form-control" placeholder="Por favor ingresa el nombre de tu empresa" value="" tabindex="1" maxlength="35" required>
									<label class="control-label">
										EMPRESA
									</label>
								</div>

								<div class="col-sm-6 kl-fancy-form">
									<input type="text" name="web" id="cf_web" class="form-control" placeholder="Por favor ingresa el sitio web de tu empresa" value="" tabindex="1" maxlength="50">
									<label class="control-label">
										SITIO WEB
									</label>
								</div>

								<div class="col-sm-12 kl-fancy-form">
									<input type="text" name="telefono" id="cf_telefono" class="form-control" placeholder="Por favor ingresa tu n&uacute;mero de tel&eacute;fono" value="" tabindex="1" maxlength="35" required>
									<label class="control-label">
										TELEFONO
									</label>
								</div>

								<div class="col-sm-12 kl-fancy-form">
									<input type="text" name="subject" id="cf_subject" class="form-control" placeholder="Escribe el asunto del mensaje" value="" tabindex="1" maxlength="50" required>
									<label class="control-label">
										ASUNTO
									</label>
								</div>

								<div class="col-sm-12 kl-fancy-form">
									<textarea name="message" id="cf_message" class="form-control" cols="30" rows="10" placeholder="Escribe tu mensaje" tabindex="4" required></textarea>
									<label class="control-label">
										MENSAJE
									</label>
								</div>

								<!-- Google recaptcha required site-key (change with yours => https://www.google.com/recaptcha/admin#list) -->
								<div class="g-recaptcha" data-sitekey="SITE-KEY"></div>
								<!--/ Google recaptcha required site-key -->

								<div class="col-sm-12">
									<!-- Contact form send button -->
									<button class="btn btn-fullcolor" type="submit">
										ENVIAR
									</button>
								</div>
							</form>
						</div>
						<!--/ Contact form element -->
					</div>
					<!--/ col-sm-12 col-md-9 col-lg-9 mb-sm-30 -->


				</div>
				<!--/ row -->
			</div>
			<!--/ .container -->
		</section>
		<!--/ Contact form element & details section with custom paddings -->

<?php
include_once('footer.php');
?>