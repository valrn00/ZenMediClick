from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Medico(Base):
    __tablename__ = "medicos"

    id_usuario = Column(Integer, ForeignKey("usuarios.id"), primary_key=True)
    especialidad = Column(String(100))
    id_ips = Column(Integer, ForeignKey("ips.id"), nullable=True)
