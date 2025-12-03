from sqlalchemy import Column, Integer, Date, Time, String
from app.database import Base

class Cita(Base):
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True)
    paciente_id = Column(Integer)
    medico_id = Column(Integer)
    fecha = Column(Date)
    hora = Column(Time)
    estado = Column(String(30))  # programada, cancelada, asistida, en atención
