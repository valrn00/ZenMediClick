from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import Usuario
from app.models.consultorio import Consultorio
from app.models.availability import Disponibilidad
from app.models.appointment import Cita

# -------- SIMULACIÓN DE USUARIO AUTENTICADO (solo para pruebas) --------
def get_current_user():
    return {"id": 1, "role": "admin"}

router = APIRouter(prefix="/admin", tags=["Admin"])

# -------- Verificación de Rol --------
def verify_admin(user: dict):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="No tienes permisos de administrador")

# -------- PANEL --------
@router.get("/panel")
def admin_panel(current_user: dict = Depends(get_current_user)):
    return {
        "message": "Panel de administración activo",
        "usuario": current_user
    }

# -------- USUARIOS --------
@router.get("/usuarios")
def listar_usuarios(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verify_admin(current_user)
    return db.query(Usuario).all()

@router.delete("/usuarios/{user_id}")
def eliminar_usuario(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verify_admin(current_user)

    usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.delete(usuario)
    db.commit()
    return {"message": "Usuario eliminado correctamente"}

# -------- CONSULTORIOS --------
@router.post("/consultorios")
def crear_consultorio(nombre: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verify_admin(current_user)

    consultorio = Consultorio(nombre=nombre)
    db.add(consultorio)
    db.commit()
    db.refresh(consultorio)
    return consultorio

@router.get("/consultorios")
def listar_consultorios(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verify_admin(current_user)
    return db.query(Consultorio).all()

# -------- DISPONIBILIDAD --------
@router.post("/disponibilidad")
def crear_disponibilidad(
    doctor_id: int,
    dia: str,
    hora_inicio: str,
    hora_fin: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    verify_admin(current_user)

    disp = Disponibilidad(
        medico_id=doctor_id,
        dia=dia,
        hora_inicio=hora_inicio,
        hora_fin=hora_fin
    )
    db.add(disp)
    db.commit()
    db.refresh(disp)
    return disp

@router.get("/disponibilidad")
def ver_disponibilidad(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verify_admin(current_user)
    return db.query(Disponibilidad).all()

# -------- CITAS --------
@router.get("/citas")
def listar_citas(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verify_admin(current_user)
    return db.query(Cita).all()

@router.delete("/citas/{cita_id}")
def cancelar_cita(cita_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verify_admin(current_user)

    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")

    db.delete(cita)
    db.commit()
    return {"message": "Cita cancelada correctamente"}
