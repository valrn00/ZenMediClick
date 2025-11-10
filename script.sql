CREATE DATABASE zenmediclick;
USE zenmediclick;

CREATE TABLE ips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(20),
    email VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    rol ENUM('Paciente', 'Medico', 'Administrador') NOT NULL DEFAULT 'Paciente'
);

CREATE TABLE pacientes (
    id_usuario INT PRIMARY KEY,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE medicos (
    id_usuario INT PRIMARY KEY,
    especialidad VARCHAR(100),
    id_ips INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_ips) REFERENCES ips(id)
);

CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    hora TIME NOT NULL,
    motivo TEXT,
    estado ENUM('Pendiente', 'Confirmada', 'Cancelada', 'Completada', 'EnAtencion') DEFAULT 'Pendiente',
    id_paciente INT,
    id_medico INT,
    id_consultorio INT,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_usuario),
    FOREIGN KEY (id_medico) REFERENCES medicos(id_usuario)
);

CREATE TABLE observaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_cita INT,
    FOREIGN KEY (id_cita) REFERENCES citas(id)
);

CREATE TABLE consultorios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(10) NOT NULL,
    piso INT,
    estado ENUM('Disponible', 'Ocupado') DEFAULT 'Disponible'
);

CREATE TABLE disponibilidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dia_semana ENUM('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado') NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    id_medico INT,
    FOREIGN KEY (id_medico) REFERENCES medicos(id_usuario)
);

-- Insertar usuario de prueba para que veas que funciona
INSERT INTO usuarios (nombre, cedula, email, password, rol) 
VALUES ('Ana María', '123456789', 'ana@test.com', '123456', 'Paciente');