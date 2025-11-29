from sqlalchemy import Column, Integer, DateTime, Time, String, Enum, ForeignKey
from app.database import Base
import enum

class EstadoCita(str, enum.Enum):
    Pendiente = "Pendiente"
    Confirmada = "Confirmada"
    Cancelada = "Cancelada"
    Completada = "Completada"
    EnAtencion = "EnAtencion"

class Cita(Base):
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True)
    fecha = Column(DateTime)
    hora = Column(Time)
    motivo = Column(String)
    estado = Column(Enum(EstadoCita), default=EstadoCita.Pendiente)
    id_paciente = Column(Integer, ForeignKey("pacientes.id_usuario"))
    id_medico = Column(Integer, ForeignKey("medicos.id_usuario"))
    id_consultorio = Column(Integer, nullable=True)
