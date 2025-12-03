from schemas.admin import AdminCreate, AdminLogin, AdminOut
from utils.auth_admin import admin_login, admin_register
from utils.admin_role import require_admin
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.admin import Admin
from app.utils.auth_admin import admin_login, admin_register
from app.utils.admin_role import require_admin


router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/login")
def login(datos: AdminLogin, db: Session = Depends(get_db)):
    return admin_login(db, datos.email, datos.password)

@router.post("/register", response_model=AdminOut)
def register(datos: AdminCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    return admin_register(db, datos.nombre, datos.email, datos.password)

# Ejemplo de endpoint protegido
@router.get("/me")
def me(admin=Depends(require_admin)):
    return {"message": "Eres administrador", "admin": admin}
