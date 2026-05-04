CREATE DATABASE IF NOT EXISTS red_unam;
USE red_unam;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    numero_cuenta VARCHAR(9) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Almacenará la contraseña encriptada
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;