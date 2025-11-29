from sqlalchemy import Column, Integer, Enum, Time, ForeignKey
from app.database import Base

class Disponibilidad(Base):
    __tablename__ = "disponibilidad"

    id = Column(Integer, primary_key=True)
    dia_semana = Column(Enum("Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"))
    hora_inicio = Column(Time)
    hora_fin = Column(Time)
    id_medico = Column(Integer, ForeignKey("medicos.id_usuario"))
