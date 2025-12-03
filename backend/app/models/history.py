from sqlalchemy import Column, Integer, Text, Date
from app.database import Base

class Historia(Base):
    __tablename__ = "historias"

    id = Column(Integer, primary_key=True)
    paciente_id = Column(Integer)
    cita_id = Column(Integer)
    fecha = Column(Date)
    observaciones = Column(Text)
    diagnostico = Column(Text)
