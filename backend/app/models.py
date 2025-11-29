from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, Time, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# ---------------------------
#   TABLA IPS
# ---------------------------
class IPS(Base):
    __tablename__ = "ips"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)

    medicos = relationship("Medico", back_populates="ips")


# ---------------------------
#   TABLA USUARIOS
# ---------------------------
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    cedula = Column(String(20))
    email = Column(String(100))
    password = Column(String(255), nullable=False)
    rol = Column(Enum("Paciente", "Medico", "Administrador", name="rol_enum"), default="Paciente")

    paciente = relationship("Paciente", back_populates="usuario", uselist=False)
    medico = relationship("Medico", back_populates="usuario", uselist=False)


# ---------------------------
#   TABLA PACIENTES
# ---------------------------
class Paciente(Base):
    __tablename__ = "pacientes"

    id_usuario = Column(Integer, ForeignKey("usuarios.id"), primary_key=True)

    usuario = relationship("Usuario", back_populates="paciente")
    citas = relationship("Cita", back_populates="paciente")


# ---------------------------
#   TABLA MEDICOS
# ---------------------------
class Medico(Base):
    __tablename__ = "medicos"

    id_usuario = Column(Integer, ForeignKey("usuarios.id"), primary_key=True)
    especialidad = Column(String(100))
    id_ips = Column(Integer, ForeignKey("ips.id"))

    usuario = relationship("Usuario", back_populates="medico")
    ips = relationship("IPS", back_populates="medicos")
    citas = relationship("Cita", back_populates="medico")
    disponibilidad = relationship("Disponibilidad", back_populates="medico")


# ---------------------------
#   TABLA CONSULTORIOS
# ---------------------------
class Consultorio(Base):
    __tablename__ = "consultorios"

    id = Column(Integer, primary_key=True, index=True)
    numero = Column(String(10), nullable=False)
    piso = Column(Integer)
    estado = Column(Enum("Disponible", "Ocupado", name="estado_consultorio_enum"), default="Disponible")

    citas = relationship("Cita", back_populates="consultorio")


# ---------------------------
#   TABLA CITAS
# ---------------------------
class Cita(Base):
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(DateTime, nullable=False)
    hora = Column(Time, nullable=False)
    motivo = Column(Text)
    estado = Column(
        Enum("Pendiente", "Confirmada", "Cancelada", "Completada", "EnAtencion", name="estado_enum"),
        default="Pendiente"
    )
    id_paciente = Column(Integer, ForeignKey("pacientes.id_usuario"))
    id_medico = Column(Integer, ForeignKey("medicos.id_usuario"))
    id_consultorio = Column(Integer, ForeignKey("consultorios.id"))

    paciente = relationship("Paciente", back_populates="citas")
    medico = relationship("Medico", back_populates="citas")
    consultorio = relationship("Consultorio", back_populates="citas")
    observaciones = relationship("Observacion", back_populates="cita")


# ---------------------------
#   TABLA OBSERVACIONES
# ---------------------------
class Observacion(Base):
    __tablename__ = "observaciones"

    id = Column(Integer, primary_key=True, index=True)
    contenido = Column(Text, nullable=False)
    fecha_registro = Column(DateTime, server_default=func.now())
    id_cita = Column(Integer, ForeignKey("citas.id"))

    cita = relationship("Cita", back_populates="observaciones")


# ---------------------------
#   TABLA DISPONIBILIDAD MÉDICA
# ---------------------------
class Disponibilidad(Base):
    __tablename__ = "disponibilidad"

    id = Column(Integer, primary_key=True, index=True)
    dia_semana = Column(
        Enum("Lunes","Martes","Miercoles","Jueves","Viernes","Sabado", name="dia_semana_enum"),
        nullable=False
    )
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    id_medico = Column(Integer, ForeignKey("medicos.id_usuario"))

    medico = relationship("Medico", back_populates="disponibilidad")
