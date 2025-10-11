from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import HTTPBearer
from sqlalchemy import create_engine, Column, Integer, String, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from dotenv import load_dotenv
import os
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

engine = create_engine(os.getenv("DB_URL"))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True)
    nombre = Column(String(50), nullable=False)
    email = Column(String(100))
    password = Column(String(255), nullable=False)
    rol = Column(Enum('Paciente', 'Medico', 'Administrador'), nullable=False)

Base.metadata.create_all(bind=engine)

class UsuarioCreate(BaseModel):
    nombre: str
    apellido: str
    email: str
    password: str
    rol: str
    autorizacion_datos: bool

class UsuarioLogin(BaseModel):
    email: str
    password: str

class ResetPassword(BaseModel):
    email: str

class ResetPasswordConfirm(BaseModel):
    token: str
    new_password: str

app = FastAPI()
security = HTTPBearer()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def validate_password(password: str):
    if len(password) < 8 or not re.search("[A-Z]", password) or not re.search("[0-9]", password) or not re.search("[!@#$%^&*()_+-=]", password):
        raise HTTPException(status_code=400, detail="Contraseña debe tener mínimo 8 chars, 1 mayúscula, 1 número, 1 símbolo")

def send_reset_email(background_tasks: BackgroundTasks, email: str, token: str):
    msg = MIMEMultipart()
    msg['From'] = os.getenv("EMAIL_SENDER")
    msg['To'] = email
    msg['Subject'] = "Reestablecer Contraseña ZenMediClick"
    body = f"Usa este token para reestablecer: {token}"
    msg.attach(MIMEText(body, 'plain'))
    background_tasks.add_task(send_email_task, msg)

def send_email_task(msg):
    server = smtplib.SMTP(os.getenv("EMAIL_HOST"), os.getenv("EMAIL_PORT"))
    server.starttls()
    server.login(os.getenv("EMAIL_SENDER"), os.getenv("EMAIL_PASSWORD"))
    server.sendmail(os.getenv("EMAIL_SENDER"), msg['To'], msg.as_string())
    server.quit()

@app.post("/api/register")
async def register(user: UsuarioCreate, db: Session = Depends(get_db)):
    if not user.autorizacion_datos:
        raise HTTPException(status_code=400, detail="Debes autorizar el tratamiento de datos")
    validate_password(user.password)
    if user.rol == 'Administrador':
        admin_count = db.query(Usuario).filter(Usuario.rol == 'Administrador').count()
        if admin_count >= 2:
            raise HTTPException(status_code=400, detail="Límite de administradores alcanzado")
    hashed_password = get_password_hash(user.password)
    db_user = Usuario(nombre=f"{user.nombre} {user.apellido}", email=user.email, password=hashed_password, rol=user.rol)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"success": True, "ips": "Auto-asociado", "user_id": db_user.id}

@app.post("/api/login")
async def login(user: UsuarioLogin, db: Session = Depends(get_db)):
    db_user = db.query(Usuario).filter(Usuario.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    access_token = create_access_token({"sub": db_user.email, "rol": db_user.rol})
    return {"user": {"email": db_user.email, "rol": db_user.rol}, "token": access_token}

@app.post("/api/reset-password")
async def reset_password(user: ResetPassword, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_user = db.query(Usuario).filter(Usuario.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    token = create_access_token({"sub": db_user.email, "scope": "reset"})
    send_reset_email(background_tasks, user.email, token)
    return {"success": True, "message": "Email enviado con token"}

@app.post("/api/reset-password/confirm")
async def reset_password_confirm(data: ResetPasswordConfirm, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get('scope') != 'reset':
            raise HTTPException(status_code=401, detail="Token inválido")
        email = payload.get('sub')
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    validate_password(data.new_password)
    db_user = db.query(Usuario).filter(Usuario.email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db_user.password = get_password_hash(data.new_password)
    db.commit()
    return {"success": True, "message": "Contraseña actualizada"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)