from sqlalchemy import Column, Integer, String
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    cedula = Column(String(20), unique=True, index=True)
    password = Column(String(200))
    rol = Column(String(20))  # paciente, medico, admin
