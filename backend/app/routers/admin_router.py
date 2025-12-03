from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.admin import AdminCreate, AdminLogin, AdminOut
from app.utils.auth_admin import admin_login, admin_register
from app.utils.admin_role import require_admin
from app.models.admin import Admin  # <--- ESTA ES LA LÍNEA QUE TE FALTABA

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/login")
def login(data: AdminLogin, db: Session = Depends(get_db)):
    return admin_login(db, data.email, data.password)

@router.post("/register")
def register(data: AdminCreate, db: Session = Depends(get_db)):
    return admin_register(db, data.nombre, data.email, data.password)

@router.get("/usuarios", dependencies=[Depends(require_admin)])
def get_admins(db: Session = Depends(get_db)):
    return db.query(Admin).all()


