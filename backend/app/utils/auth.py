from datetime import datetime, timedelta
from typing import Optional
import jwt
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext

# CONFIGURACIÓN GENERAL DE AUTH
SECRET_KEY = "SECRET_SUPER_SEGURO_CAMBIAR"
ALGORITHM = "HS256"
EXPIRES_MIN = 240  # 4 horas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

security = HTTPBearer()


# -----------------------------
#   HASH + VERIFICACIÓN
# -----------------------------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


# -----------------------------
#       CREAR TOKEN
# -----------------------------
def create_access_token(data: dict, expires_delta: Optional[int] = None):
    expire = datetime.utcnow() + timedelta(
        minutes=expires_delta if expires_delta else EXPIRES_MIN
    )

    to_encode = data.copy()
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# -----------------------------
#      VERIFICAR TOKEN
# -----------------------------
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # ejemplo: {"id": 1, "role": "admin", "exp": ... }

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="El token ha expirado")

    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")
