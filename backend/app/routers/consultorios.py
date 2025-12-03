# app/routers/consultorios.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/consultorios", tags=["Consultorios"])


class Consultorio(BaseModel):
    id: int
    nombre: str
    ubicacion: str


# Datos de prueba
consultorios_db: List[Consultorio] = [
    Consultorio(id=1, nombre="Consultorio A", ubicacion="Piso 1"),
    Consultorio(id=2, nombre="Consultorio B", ubicacion="Piso 2")
]


@router.get("/", response_model=List[Consultorio])
def obtener_consultorios():
    return consultorios_db


@router.post("/", response_model=Consultorio)
def crear_consultorio(consultorio: Consultorio):
    consultorios_db.append(consultorio)
    return consultorio
