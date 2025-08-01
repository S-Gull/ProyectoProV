<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require __DIR__ . '/../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer as PHPMailer_ah;
use PHPMailer\PHPMailer\SMTP as SMTP_ah;

function clean_ah($str_ah) {
    return htmlspecialchars(trim($str_ah));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input_ah = json_decode(file_get_contents("php://input"), true);
    $nombre_ah     = clean_ah($input_ah["nombre_ah"] ?? "");
    $remitente_ah  = clean_ah($input_ah["remitente_ah"] ?? "");
    $asunto_ah     = clean_ah($input_ah["asunto_ah"] ?? "");
    $contenido_ah  = clean_ah($input_ah["contenido_ah"] ?? "");

    // Validar Gmail
    if (!filter_var($remitente_ah, FILTER_VALIDATE_EMAIL) || !str_ends_with($remitente_ah, '@gmail.com')) {
        echo json_encode(["success_ah" => false, "message_ah" => "Debes ingresar un Gmail válido"]);
        exit;
    }

    $para_ah = ""; // SIEMPRE la empresa

    try {
        $mail_ah = new PHPMailer_ah();
        $mail_ah->isSMTP();
        $mail_ah->SMTPDebug = SMTP_ah::DEBUG_OFF;
        $mail_ah->Host = 'smtp.gmail.com';
        $mail_ah->Port = 465;
        $mail_ah->SMTPSecure = PHPMailer_ah::ENCRYPTION_SMTPS;
        $mail_ah->SMTPAuth = true;
        $email_ah = ''; // Tu correo empresa
        $mail_ah->Username = $email_ah;
        $mail_ah->Password = '';
        $mail_ah->setFrom($email_ah, 'Nexus AG');
        $mail_ah->addReplyTo($remitente_ah, $nombre_ah);
        $mail_ah->addAddress($para_ah, 'Nexus AG');
        $mail_ah->Subject = $asunto_ah;
        $mail_ah->IsHTML(true);
        $mail_ah->CharSet = 'UTF-8';
        $mail_ah->Body = sprintf(
            '<h2>Mensaje de contacto</h2>
            <p><strong>Nombre:</strong> %s</p>
            <p><strong>Email:</strong> %s</p>
            <p><strong>Mensaje:</strong><br>%s</p>',
            $nombre_ah, $remitente_ah, nl2br($contenido_ah)
        );

        if (!$mail_ah->send()) {
            throw new Exception($mail_ah->ErrorInfo);
        }
        echo json_encode(["success_ah" => true, "message_ah" => "Mensaje enviado con éxito"]);
    } catch (Exception $e_ah) {
        echo json_encode(["success_ah" => false, "message_ah" => $e_ah->getMessage()]);
    }
} else {
    echo json_encode(["success_ah" => false, "message_ah" => "Método no permitido"]);
}