from sqlalchemy import Column, Integer, String, Enum
from app.database import Base
import enum

class RolEnum(str, enum.Enum):
    Paciente = "Paciente"
    Medico = "Medico"
    Administrador = "Administrador"

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    cedula = Column(String(20))
    email = Column(String(100), unique=True)
    password = Column(String(255))
    rol = Column(Enum(RolEnum), default=RolEnum.Paciente)
