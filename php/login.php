<?php
header('Content-Type: application/json');
require 'conexion.php';

try {

    $input = trim($_POST['input']);
    $password = $_POST['password'];

    if (!$input || !$password) {
        echo json_encode(["status"=>"error","message"=>"Campos vacíos"]);
        exit;
    }

    // Buscar por email o cuenta
    $stmt = $db->prepare("SELECT * FROM usuarios WHERE email = ? OR numero_cuenta = ?");
    $stmt->execute([$input, $input]);

    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        echo json_encode(["status"=>"error","message"=>"Usuario no encontrado"]);
        exit;
    }

    // Verificar password
    if (!password_verify($password, $usuario['password'])) {
        echo json_encode(["status"=>"error","message"=>"Contraseña incorrecta"]);
        exit;
    }

    echo json_encode([
        "status"=>"success",
        "usuario"=>[
            "id"=>$usuario['id'],
            "nombre"=>$usuario['nombre'],
            "email"=>$usuario['email'],
            "cuenta"=>$usuario['numero_cuenta']
        ]
    ]);

} catch (Exception $e) {
    echo json_encode(["status"=>"error","message"=>"Error del servidor"]);
}