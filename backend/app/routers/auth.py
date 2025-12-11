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

# ...

@router.post("/register") # -> URL completa: /auth/register
# ...

@router.post("/login")    # -> URL completa: /auth/login
# ...

# -------------------------------
#   MODELOS DE PETICIÓN
# -------------------------------
class RegisterSchema(BaseModel):
    nombre: str
    email: str
    cedula: str
    password: str
    rol: str= "paciente"

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
    # Normalizar el rol para la validación (¡CORRECCIÓN CLAVE!)
    normalized_rol = body.rol.lower() 

    # VALIDAR ROL PERMITIDO
    # Validamos contra la versión en minúsculas.
    if normalized_rol not in ["paciente", "medico"]: 
        # Si tienes más roles, inclúyelos aquí en minúsculas
        raise HTTPException(status_code=400, detail="Rol no permitido para registro")

    # VALIDAR EMAIL (El resto del código es correcto)
    exists_email = db.query(Usuario).filter(Usuario.email == body.email).first()
    if exists_email:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    # VALIDAR CÉDULA (El resto del código es correcto)
    exists_cedula = db.query(Usuario).filter(Usuario.cedula == body.cedula).first()
    if exists_cedula:
        raise HTTPException(status_code=400, detail="La cédula ya está registrada")

    # CREAR USUARIO
    user = Usuario(
        nombre=body.nombre,
        email=body.email,
        cedula=body.cedula,
        password=hash_password(body.password),
        # Guardamos el rol normalizado en la base de datos (¡CORRECCIÓN CLAVE!)
        rol=normalized_rol 
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
