from sqlalchemy import Column, Integer, String, Enum, Date, Time, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import enum

class RolEnum(str, enum.Enum):
    Paciente = "Paciente"
    Medico = "Medico"
    Administrador = "Administrador"

class EstadoCitaEnum(str, enum.Enum):
    Pendiente = "Pendiente"
    Confirmada = "Confirmada"
    Cancelada = "Cancelada"

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    cedula = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255), nullable=False)
    rol = Column(Enum(RolEnum), nullable=False)
    activo = Column(Boolean, default=True)

    citas_paciente = relationship("Cita", foreign_keys="Cita.paciente_id", back_populates="paciente")
    citas_medico = relationship("Cita", foreign_keys="Cita.medico_id", back_populates="medico")

class Cita(Base):
    __tablename__ = "citas"
    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("usuarios.id"))
    medico_id = Column(Integer, ForeignKey("usuarios.id"))
    fecha = Column(Date, nullable=False)
    hora = Column(Time, nullable=False)
    motivo = Column(Text)
    estado = Column(Enum(EstadoCitaEnum), default=EstadoCitaEnum.Pendiente)
    observaciones = Column(Text)

    paciente = relationship("Usuario", foreign_keys=[paciente_id])
    medico = relationship("Usuario", foreign_keys=[medico_id])