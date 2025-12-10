from sqlalchemy import Column, Integer, String
from app.database import Base

class Consultorio(Base):
    __tablename__ = "consultorios"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100))
    ubicacion = Column(String(100))
