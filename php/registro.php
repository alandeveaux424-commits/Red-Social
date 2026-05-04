<?php
header('Content-Type: application/json');
require 'conexion.php';

try {

    $nombre = trim($_POST['nombre']);
    $email = trim($_POST['email']);
    $cuenta = trim($_POST['cuenta']);
    $passwordRaw = $_POST['password'];

    if (!$nombre || !$email || !$cuenta || !$passwordRaw) {
        echo json_encode(["status"=>"error","message"=>"Campos vacíos"]);
        exit;
    }

    // Validaciones
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status"=>"error","message"=>"Correo inválido"]);
        exit;
    }

    if (!str_ends_with($email, "unam.mx")) {
        echo json_encode(["status"=>"error","message"=>"Solo correos UNAM"]);
        exit;
    }

    if (!preg_match('/^\d{9}$/', $cuenta)) {
        echo json_encode(["status"=>"error","message"=>"Cuenta inválida"]);
        exit;
    }

    if (!preg_match('/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/', $passwordRaw)) {
        echo json_encode(["status"=>"error","message"=>"Contraseña insegura"]);
        exit;
    }

    // Verificar duplicados
    $check = $db->prepare("SELECT id FROM usuarios WHERE email = ? OR numero_cuenta = ?");
    $check->execute([$email, $cuenta]);

    if ($check->fetch()) {
        echo json_encode(["status"=>"error","message"=>"El usuario ya existe"]);
        exit;
    }

    // Insertar
    $password = password_hash($passwordRaw, PASSWORD_BCRYPT);

    $stmt = $db->prepare("INSERT INTO usuarios (nombre,email,numero_cuenta,password) VALUES (?,?,?,?)");
    $stmt->execute([$nombre, $email, $cuenta, $password]);

    echo json_encode([
        "status"=>"success",
        "message"=>"Usuario registrado correctamente"
    ]);

} catch (Exception $e) {
    echo json_encode(["status"=>"error","message"=>"Error del servidor"]);
}