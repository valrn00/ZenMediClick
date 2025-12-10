from passlib.context import CryptContext

from passlib.context import CryptContext

pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")
# El paréntesis de cierre debe ser ')'

def hash_password(password: str):
    # Solución robusta: Truncar por bytes para evitar el ValueError
    password_bytes = password.encode('utf-8')
    truncated_password = password_bytes[:72]
    return pwd_cxt.hash(truncated_password) # passlib puede aceptar bytes

def verify_password(plain, hashed):
    # También codificar la contraseña plana al verificar
    return pwd_cxt.verify(plain.encode('utf-8'), hashed)