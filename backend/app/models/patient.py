from sqlalchemy import Column, Integer, ForeignKey
from app.database import Base

class Paciente(Base):
    __tablename__ = "pacientes"

    id_usuario = Column(Integer, ForeignKey("usuarios.id"), primary_key=True)
