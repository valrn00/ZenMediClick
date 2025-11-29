from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Cita, Paciente, Medico, Consultorio

router = APIRouter(prefix="/citas", tags=["Citas"])


# -----------------------------------------------------
#   CREAR CITA
# -----------------------------------------------------
@router.post("/")
def crear_cita(
    fecha: str,
    hora: str,
    motivo: str,
    id_paciente: int,
    id_medico: int,
    id_consultorio: int,
    db: Session = Depends(get_db)
):
    cita = Cita(
        fecha=fecha,
        hora=hora,
        motivo=motivo,
        id_paciente=id_paciente,
        id_medico=id_medico,
        id_consultorio=id_consultorio
    )

    db.add(cita)
    db.commit()
    db.refresh(cita)

    return cita


# -----------------------------------------------------
#   OBTENER CITAS POR PACIENTE
# -----------------------------------------------------
@router.get("/paciente/{id_paciente}")
def citas_paciente(id_paciente: int, db: Session = Depends(get_db)):
    return db.query(Cita).filter(Cita.id_paciente == id_paciente).all()


# -----------------------------------------------------
#   OBTENER CITAS POR MEDICO
# -----------------------------------------------------
@router.get("/medico/{id_medico}")
def citas_medico(id_medico: int, db: Session = Depends(get_db)):
    return db.query(Cita).filter(Cita.id_medico == id_medico).all()
