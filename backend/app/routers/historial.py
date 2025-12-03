from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.models.history import Historia

router = APIRouter(prefix="/historial", tags=["Historial Clínico"])

@router.post("/registrar")
def registrar_historia(
    paciente_id: int,
    cita_id: int,
    observaciones: str,
    diagnostico: str,
    db: Session = Depends(get_db)
):
    historia = Historia(
        paciente_id=paciente_id,
        cita_id=cita_id,
        fecha=date.today(),
        observaciones=observaciones,
        diagnostico=diagnostico
    )
    db.add(historia)
    db.commit()
    db.refresh(historia)
    return {"msg": "Historia registrada", "id": historia.id}

@router.get("/paciente/{paciente_id}")
def historial_paciente(paciente_id: int, db: Session = Depends(get_db)):
    return db.query(Historia).filter(Historia.paciente_id == paciente_id).all()
