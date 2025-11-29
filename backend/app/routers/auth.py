from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from jose import jwt, JWTError

from app.database import get_db
from app.models import Usuario
from app.utils.hashing import verify_password
from app.settings import settings

router = APIRouter(prefix="/auth", tags=["Auth"])


# -----------------------------------------------------
#   CREAR TOKEN JWT
# -----------------------------------------------------
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


# -----------------------------------------------------
#   LOGIN
# -----------------------------------------------------
@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == email).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "rol": user.rol,
        "id": user.id
    }
