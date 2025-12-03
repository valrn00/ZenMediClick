from sqlalchemy import Column, Integer, String, Date, Time
from app.database import Base

class Disponibilidad(Base):
    __tablename__ = "disponibilidades"

    id = Column(Integer, primary_key=True)
    medico_id = Column(Integer)
    fecha = Column(Date)
    hora = Column(Time)
    consultorio = Column(String(50))
