# app/models/availability.py

from sqlalchemy import Column, Integer, Time, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

DiasSemanaEnum = Enum(
    "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado",
    name="dia_semana_enum"
)

class Disponibilidad(Base):
    __tablename__ = "disponibilidad"

    id = Column(Integer, primary_key=True, index=True)
    dia_semana = Column(DiasSemanaEnum, nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)

    id_medico = Column(Integer, ForeignKey("medicos.id_usuario"))
    medico = relationship("Medico")
