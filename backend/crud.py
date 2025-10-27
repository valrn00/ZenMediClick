from sqlalchemy.orm import Session
import models, schemas, utils  # SIN "backend."
from fastapi import HTTPException, status
import random
import string

def get_usuario_by_cedula(db: Session, cedula: str):
    return db.query(models.Usuario).filter(models.Usuario.cedula == cedula).first()

def create_usuario(db: Session, user: schemas.UsuarioCreate):
    hashed = utils.get_password_hash(user.password)
    db_user = models.Usuario(
        nombre=user.nombre,
        cedula=user.cedula,
        email=user.email,
        password=hashed,
        rol=user.rol
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def login_usuario(db: Session, cred: schemas.Login):
    user = get_usuario_by_cedula(db, cred.cedula)
    
    if not user:
        raise HTTPException(status_code=401, detail="Cédula no encontrada")
    
    if not utils.verify_password(cred.password, user.password):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    
    token = utils.create_access_token({"sub": user.id, "rol": user.rol})
    return {"user": schemas.UsuarioOut.from_orm(user), "token": token}

def verify_admin(token: str):
    payload = utils.decode_token(token)
    if payload.get("rol") != "Administrador":
        raise HTTPException(status_code=403, detail="No autorizado")

def verify_medico(token: str):
    payload = utils.decode_token(token)
    if payload.get("rol") != "Medico":
        raise HTTPException(status_code=403, detail="No autorizado")

def get_usuarios(db: Session):
    return db.query(models.Usuario).all()

def agendar_cita(db: Session, cita: schemas.CitaCreate, user_id: int):
    db_cita = models.Cita(
        paciente_id=user_id,
        medico_id=cita.medico_id,
        fecha=cita.fecha,
        hora=cita.hora,
        motivo=cita.motivo
    )
    db.add(db_cita)
    db.commit()
    db.refresh(db_cita)
    return db_cita

def get_citas_by_user(db: Session, user_id: int, rol: str):
    if rol == "Paciente":
        return db.query(models.Cita).filter(models.Cita.paciente_id == user_id).all()
    elif rol == "Medico":
        return db.query(models.Cita).filter(models.Cita.medico_id == user_id).all()
    return []

def cancelar_cita(db: Session, cita_id: int, user_id: int):
    cita = db.query(models.Cita).filter(models.Cita.id == cita_id).first()
    if not cita or (cita.paciente_id != user_id and cita.medico_id != user_id):
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    cita.estado = "Cancelada"  # O usa tu Enum
    db.commit()
    return {"detail": "Cita cancelada"}