from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, time
from app.database import get_db
from app.models.availability import Disponibilidad

router = APIRouter(prefix="/disponibilidad", tags=["Disponibilidad Médica"])

@router.post("/")
def crear_disponibilidad(
    medico_id: int,
    fecha: date,
    hora: time,
    consultorio: str,
    db: Session = Depends(get_db)
):
    nueva = Disponibilidad(
        medico_id=medico_id,
        fecha=fecha,
        hora=hora,
        consultorio=consultorio
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return {"msg": "Disponibilidad creada", "id": nueva.id}

@router.get("/medico/{medico_id}")
def disponibilidad_medico(medico_id: int, db: Session = Depends(get_db)):
    return db.query(Disponibilidad).filter(Disponibilidad.medico_id == medico_id).all()
