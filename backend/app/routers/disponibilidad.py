from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Disponibilidad

router = APIRouter(prefix="/disponibilidad", tags=["Disponibilidad"])


@router.get("/medico/{id_medico}")
def get_disponibilidad(id_medico: int, db: Session = Depends(get_db)):
    return db.query(Disponibilidad).filter(Disponibilidad.id_medico == id_medico).all()
