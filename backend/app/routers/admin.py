from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Usuario, Consultorio, Disponibilidad, Cita
from app.utils.security import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])

def verify_admin(user: Usuario):
    if user.rol != "admin":
        raise HTTPException(status_code=403, detail="No tienes permisos de administrador")


# -------------------------------
# 📌 USUARIOS
# -------------------------------
@router.get("/usuarios")
def listar_usuarios(db: Session = Depends(get_db), user: Usuario = Depends(get_current_user)):
    verify_admin(user)
    return db.query(Usuario).all()


@router.delete("/usuarios/{user_id}")
def eliminar_usuario(user_id: int, 
                     db: Session = Depends(get_db), 
                     user: Usuario = Depends(get_current_user)):
    verify_admin(user)
    usuario = db.query(Usuario).filter(Usuario.id == user_id).first()

    if not usuario:
        raise HTTPException(404, "Usuario no encontrado")

    db.delete(usuario)
    db.commit()
    return {"message": "Usuario eliminado"}


# -------------------------------
# 📌 CONSULTORIOS
# -------------------------------
@router.post("/consultorios")
def crear_consultorio(nombre: str, 
                      db: Session = Depends(get_db), 
                      user: Usuario = Depends(get_current_user)):
    verify_admin(user)

    consultorio = Consultorio(nombre=nombre)
    db.add(consultorio)
    db.commit()
    db.refresh(consultorio)
    return consultorio


@router.get("/consultorios")
def listar_consultorios(db: Session = Depends(get_db), user: Usuario = Depends(get_current_user)):
    verify_admin(user)
    return db.query(Consultorio).all()


# -------------------------------
# 📌 DISPONIBILIDAD
# -------------------------------
@router.post("/disponibilidad")
def crear_disponibilidad(
    doctor_id: int,
    dia: str,
    hora_inicio: str,
    hora_fin: str,
    db: Session = Depends(get_db),
    user: Usuario = Depends(get_current_user)
):
    verify_admin(user)

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
def ver_disponibilidad(db: Session = Depends(get_db), user: Usuario = Depends(get_current_user)):
    verify_admin(user)
    return db.query(Disponibilidad).all()


# -------------------------------
# 📌 CITAS
# -------------------------------
@router.get("/citas")
def listar_citas(db: Session = Depends(get_db), user: Usuario = Depends(get_current_user)):
    verify_admin(user)
    return db.query(Cita).all()


@router.delete("/citas/{cita_id}")
def cancelar_cita(cita_id: int, db: Session = Depends(get_db), user: Usuario = Depends(get_current_user)):
    verify_admin(user)
    cita = db.query(Cita).filter(Cita.id == cita_id).first()

    if not cita:
        raise HTTPException(404, "Cita no encontrada")

    db.delete(cita)
    db.commit()
    return {"message": "Cita cancelada"}
