from passlib.context import CryptContext

pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_cxt.hash(password)

def verify_password(plain, hashed):
    return pwd_cxt.verify(plain, hashed)
