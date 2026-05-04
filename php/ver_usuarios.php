<?php
require 'conexion.php';

$result = $db->query("SELECT * FROM usuarios");

echo "<h2>Usuarios registrados</h2>";

foreach ($result as $row) {
    echo "<p>";
    echo "Nombre: " . htmlspecialchars($row['nombre']) . "<br>";
    echo "Email: " . htmlspecialchars($row['email']) . "<br>";
    echo "Cuenta: " . htmlspecialchars($row['numero_cuenta']) . "<br>";
    echo "<hr>";
    echo "</p>";
}