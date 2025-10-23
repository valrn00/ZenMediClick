CREATE DATABASE IF NOT EXISTS zenmediclick;
USE zenmediclick;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('Paciente', 'Medico', 'Administrador') NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT,
    medico_id INT,
    fecha DATE,
    hora TIME,
    motivo TEXT,
    estado ENUM('Pendiente', 'Confirmada', 'Cancelada') DEFAULT 'Pendiente',
    observaciones TEXT,
    FOREIGN KEY (paciente_id) REFERENCES usuarios(id),
    FOREIGN KEY (medico_id) REFERENCES usuarios(id)
);