<?php
// Datos de conexión desde Supabase (Settings > Database)
$host = "aws-0-us-east-1.pooler.supabase.com"; // Reemplaza con tu Host real
$port = "5432";
$dbname = "postgres";
$user = "postgres.ubhytoh..."; // Tu usuario de base de datos
$pass = "12345.abcde#A"; // La que configuraste al crear el proyecto

try {
    // Cambiamos el DSN de mysql a pgsql
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;user=$user;password=$pass";
    $db = new PDO($dsn);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Error de conexión a Supabase: " . $e->getMessage()
    ]);
    exit;
}
