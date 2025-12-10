from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import Usuario 
from app.utils.hashing import hash_password 
from app.schemas.paciente import PacienteCreate 

router = APIRouter(prefix="/pacientes", tags=["Pacientes"])

# AÑADE AQUÍ FUTURAS RUTAS DE PACIENTE (ej. @router.get("/{id}") )
# ... PERO LA FUNCIÓN 'REGISTER' DEBE HABER SIDO ELIMINADA O COMENTADA
# ...