from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Medico, Usuario

router = APIRouter(prefix="/medicos", tags=["Medicos"])


@router.get("/")
def get_medicos(db: Session = Depends(get_db)):
    return db.query(Medico).all()
