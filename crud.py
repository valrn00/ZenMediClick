from sqlalchemy.orm import Session
from . import models, schemas, utils
from .email_service import send_reset_email
from fastapi import HTTPException, status, BackgroundTasks
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
    if not user or not utils.verify_password(cred.password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = utils.create_access_token({"sub": user.id, "rol": user.rol})
    return {"user": user, "token": token}

def verify_admin(token: str):
    payload = utils.decode_token(token.credentials)
    if payload.get("rol") != "Administrador":
        raise HTTPException(status_code=403, detail="No autorizado")

def verify_medico(token: str):
    payload = utils.decode_token(token.credentials)
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
    cita.estado = models.EstadoCitaEnum.Cancelada
    db.commit()
    return {"detail": "Cita cancelada"}

def send_reset_token(db: Session, email: str, background_tasks: BackgroundTasks):
    user = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email no encontrado")
    token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    # Aquí guardarías el token en Redis o DB con expiración
    background_tasks.add_task(send_reset_email, email, token)
    return {"detail": "Email enviado"}

def reset_password(db: Session, req: schemas.ResetConfirm):
    # Validar token (en producción: Redis/DB)
    hashed = utils.get_password_hash(req.new_password)
    # Buscar usuario por token y actualizar
    return {"detail": "Contraseña actualizada"}