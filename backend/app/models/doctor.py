from sqlalchemy import Column, Integer, String
from app.database import Base

class Medico(Base):
    __tablename__ = "medicos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    especialidad = Column(String(100))
