<?php

$method = strtoupper($_SERVER['REQUEST_METHOD']);
if('POST' != $method) {
	exit('Invalid request');
}

// CONFIGURE RECAPTCHA
define('GR_SECRET', '6LeAcrAUAAAAAMgdh09kEzu2frgVQyUap92i4cAR');
define('GR_URL', 'https://www.google.com/recaptcha/api/siteverify');


// Configuration option.
// Enter the email address that you want to emails to be sent to.
// Example $address = "john.doe@yourdomain.com";
$address = "012design@gmail.com, simon@herrajes-express.com, info@herrajes-express.com";

function validateRecaptcha( $secret, $response, $url = GR_URL ){
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_POST, 1);
	$params = array(
		'secret' => urlencode($secret),
		'response' => urlencode($response),
	);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$result = curl_exec($ch);
	$result = json_decode($result);
	curl_close($ch);
	return (isset($result->success) && $result->success);
}


if (!defined("PHP_EOL")) define("PHP_EOL", "\r\n");

// Sanitize request
$name = (isset($_POST['name']) ? strip_tags($_POST['name']) : '');
$lastname = (isset($_POST['lastname']) ? strip_tags($_POST['lastname']) : '');
$email = (isset($_POST['email']) ? strip_tags($_POST['email']) : '');
$ciudad = (isset($_POST['ciudad']) ? strip_tags($_POST['ciudad']) : '');
$pais = (isset($_POST['pais']) ? strip_tags($_POST['pais']) : '');
$empresa = (isset($_POST['empresa']) ? strip_tags($_POST['empresa']) : '');
$web = (isset($_POST['web']) ? strip_tags($_POST['web']) : '');
$telefono = (isset($_POST['telefono']) ? strip_tags($_POST['telefono']) : ''); 
$subject = (isset($_POST['subject']) ? strip_tags($_POST['subject']) : '');
$message= (isset($_POST['message']) ? strip_tags($_POST['message']) : '');


// Validate inputs
if(empty($name)){
	echo '<div class="alert alert-warning error"><p><strong>Atenci&oacute;n!</strong> Se requiere tu nombre.</p></div>';
	exit();
}
if(empty($lastname)){
	echo '<div class="alert alert-warning error"><p><strong>Atenci&oacute;n!</strong> Se requiere tu apellido.</p></div>';
	exit();
}
if(empty($email)){
	echo '<div class="alert alert-warning error"><p><strong>Atenci&oacute;n!</strong> Se requiere tu email.</p></div>';
	exit();
}

if(filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
	echo '<div class="alert alert-warning error"><p><strong>Atenci&oacute;n!</strong> Has ingresado una direcci&oacute;n de correo electr&oacute;nico no v&aacute;lida, intenta nuevamente.</p></div>';
	exit();
}

if(empty($ciudad)){
	echo '<div class="alert alert-warning error"><p><strong>Atenci&oacute;n!</strong> Debes ingresar tu ciudad.</p></div>';
	exit();
}
if(empty($pais)){
	echo '<div class="alert alert-warning error"><p><strong>Atenci&oacute;n!</strong> Debes ingresar tu pa&iacute;s.</p></div>';
	exit();
}

if(empty($empresa)){
	echo '<div class="alert alert-warning error"><p><strong>Atenci&oacute;n!</strong> Debes ingresar tu empresa.</p></div>';
	exit();
}

if(empty($telefono)){
	echo '<div class="alert alert-warning error"><p><strong>Atenci&oacute;n!</strong> Debes ingresar tu n&uacute;mero de tel&eacute;fono.</p></div>';
	exit();
}


if(empty($subject)){
	$subject = 'Contacto desde el sitio web: ' . $name . ' ' . $lastname;
}
if(empty($message)){
	echo '<div class="alert alert-warning error"><p><strong>Atenci&oacute;n!</strong> Se requiere que escribas tu mensaje.</p></div>';
	exit();
}
if(get_magic_quotes_gpc()) {
	$message = stripslashes($message);
}



// Configuration option.
// You can change this if you feel that you need to.
// Developers, you may wish to add more fields to the form, in which case you must be sure to add them here.

$e_body = "Contacto desde HERRAJES EXPRESS: $name $lastname " . PHP_EOL;
$e_content = "Mensaje: $message" . PHP_EOL . "Telefono: $telefono" . PHP_EOL . "Ciudad: $ciudad" . PHP_EOL . "Pais: $pais" . PHP_EOL . "Empresa: $empresa" . PHP_EOL . "Web: $web" . PHP_EOL;
$e_reply = "Email: $email";



$msg = wordwrap( $e_body . $e_content . $e_reply, 70 );

$headers = "From: \"$name $lastname\" " . PHP_EOL;
$headers .= "Reply-To: $email" . PHP_EOL;
$headers .= "MIME-Version: 1.0" . PHP_EOL;
$headers .= "Content-type: text/plain; charset=utf-8" . PHP_EOL;
$headers .= "Content-Transfer-Encoding: quoted-printable" . PHP_EOL;

if(mail($address, $subject, $msg, $headers)) {

	// Email has sent successfully, echo an error message.
	echo '<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><p>Gracias! <strong>'.$name.'</strong>, tu mensaje ha sido enviado con &eacute;xito.</p></div>';

} 
else {
	// Email has NOT been sent successfully, echo an error message.
	echo '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><div class="alert alert-danger"><strong>ERROR!</strong> El correo electr&oacutenico no fue enviado, int&eacutentalo de nuevo o m&aacutes tarde.</div>';
}