-- Crear base de datos
CREATE DATABASE IF NOT EXISTS zenmediclick;
USE zenmediclick;

-- Tabla IPS
CREATE TABLE ips (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(150) DEFAULT NULL,
    telefono VARCHAR(20) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Usuarios
CREATE TABLE usuarios (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('Paciente', 'Medico', 'Administrador') NOT NULL,
    id_ips INT(11) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_ips) REFERENCES ips(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Pacientes
CREATE TABLE pacientes (
    id_usuario INT(11) NOT NULL,
    id_ips INT(11) DEFAULT NULL,
    PRIMARY KEY (id_usuario),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_ips) REFERENCES ips(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Médicos
CREATE TABLE medicos (
    id_usuario INT(11) NOT NULL,
    especialidad VARCHAR(100) DEFAULT NULL,
    id_ips INT(11) NOT NULL,
    PRIMARY KEY (id_usuario),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_ips) REFERENCES ips(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Consultorios
CREATE TABLE consultorios (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(150) DEFAULT NULL,
    id_ips INT(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_ips) REFERENCES ips(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Disponibilidad del Médico
CREATE TABLE disponibilidad_medico (
    id INT(11) NOT NULL AUTO_INCREMENT,
    id_medico INT(11) NOT NULL,
    dia_semana ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_medico) REFERENCES medicos(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Citas
CREATE TABLE citas (
    id INT(11) NOT NULL AUTO_INCREMENT,
    fecha DATETIME NOT NULL,
    motivo TEXT DEFAULT NULL,
    estado ENUM('Pendiente', 'Confirmada', 'Cancelada', 'Completada') NOT NULL DEFAULT 'Pendiente',
    id_paciente INT(11) NOT NULL,
    id_medico INT(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_usuario) ON UPDATE CASCADE,
    FOREIGN KEY (id_medico) REFERENCES medicos(id_usuario) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Historial Médico
CREATE TABLE historial_medico (
    id INT(11) NOT NULL AUTO_INCREMENT,
    descripcion TEXT NOT NULL,
    fecha DATE NOT NULL,
    id_paciente INT(11) NOT NULL,
    id_cita INT(11) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_cita) REFERENCES citas(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Observaciones
CREATE TABLE observaciones (
    id INT(11) NOT NULL AUTO_INCREMENT,
    contenido TEXT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_cita INT(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_cita) REFERENCES citas(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Recordatorios
CREATE TABLE recordatorios (
    id INT(11) NOT NULL AUTO_INCREMENT,
    mensaje TEXT NOT NULL,
    fecha_envio DATETIME NOT NULL,
    id_cita INT(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_cita) REFERENCES citas(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;