from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from jose import jwt
from pydantic import BaseModel

from app.database import get_db
from app.utils.hashing import hash_password, verify_password
from app.models.user import Usuario
from app.settings import settings

router = APIRouter(prefix="/auth", tags=["Auth"])

# -------------------------------
#   MODELOS DE PETICIÓN
# -------------------------------
class RegisterSchema(BaseModel):
    nombre: str
    email: str
    cedula: str
    password: str
    rol: str

class LoginSchema(BaseModel):
    email: str
    password: str


# -------------------------------
#   TOKEN
# -------------------------------
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


# -------------------------------
#   RUTAS DE AUTENTICACIÓN
# -------------------------------
@router.post("/register")
def register(body: RegisterSchema, db: Session = Depends(get_db)):
    # VALIDAR ROL PERMITIDO
    if body.rol not in ["Paciente", "Medico"]:
        raise HTTPException(status_code=400, detail="Rol no permitido para registro")

    # VALIDAR EMAIL
    exists_email = db.query(Usuario).filter(Usuario.email == body.email).first()
    if exists_email:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    # VALIDAR CÉDULA
    exists_cedula = db.query(Usuario).filter(Usuario.cedula == body.cedula).first()
    if exists_cedula:
        raise HTTPException(status_code=400, detail="La cédula ya está registrada")

    # CREAR USUARIO
    user = Usuario(
        nombre=body.nombre,
        email=body.email,
        cedula=body.cedula,
        password=hash_password(body.password),
        rol=body.rol
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "msg": "Usuario creado correctamente",
        "user": {"id": user.id, "nombre": user.nombre}
    }


@router.post("/login")
def login(body: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == body.email).first()

    if not user or not verify_password(body.password, user.password):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    token = create_access_token({"sub": user.email, "rol": user.rol, "id": user.id})

    return {"success": True, "token": token, "rol": user.rol, "user": {"id": user.id, "nombre": user.nombre}}
