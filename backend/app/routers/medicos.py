from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.doctor import Medico

router = APIRouter(prefix="/medicos", tags=["Médicos"])

@router.post("/register")
def crear_medico(nombre: str, especialidad: str, db: Session = Depends(get_db)):
    medico = Medico(nombre=nombre, especialidad=especialidad)
    db.add(medico)
    db.commit()
    db.refresh(medico)
    return {"msg": "Médico creado", "id": medico.id}

@router.get("/")
def listar_medicos(db: Session = Depends(get_db)):
    return db.query(Medico).all()

@router.get("/{id}")
def obtener_medico(id: int, db: Session = Depends(get_db)):
    medico = db.query(Medico).filter(Medico.id == id).first()
    if not medico:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return medico
