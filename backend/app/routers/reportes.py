from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.appointment import Cita

router = APIRouter(prefix="/reportes", tags=["Reportes"])

@router.get("/inasistencias/paciente/{paciente_id}")
def inasistencias_paciente(paciente_id: int, db: Session = Depends(get_db)):
    total = db.query(Cita).filter(Cita.paciente_id == paciente_id).count()
    faltas = db.query(Cita).filter(
        Cita.paciente_id == paciente_id,
        Cita.estado == "cancelada"
    ).count()
    porcentaje = (faltas / total * 100) if total else 0
    return {"total": total, "inasistencias": faltas, "porcentaje": porcentaje}

@router.get("/inasistencias/medico/{medico_id}")
def inasistencias_medico(medico_id: int, db: Session = Depends(get_db)):
    total = db.query(Cita).filter(Cita.medico_id == medico_id).count()
    faltas = db.query(Cita).filter(
        Cita.medico_id == medico_id,
        Cita.estado == "cancelada"
    ).count()
    porcentaje = (faltas / total * 100) if total else 0
    return {"total": total, "inasistencias": faltas, "porcentaje": porcentaje}
