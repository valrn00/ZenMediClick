from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Enum, ForeignKey, DateTime, Text, Time, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, EmailStr, validator
from passlib.context import CryptContext
from jose import JWTError, jwt
from dotenv import load_dotenv
from datetime import datetime, timedelta
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json

load_dotenv()

# Configuración
DB_URL = os.getenv("DB_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT"))

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Seguridad
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# App
app = FastAPI(title="ZenMediClick API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos DB
class IPS(Base):
    __tablename__ = "ips"
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True)
    nombre = Column(String(50), nullable=False)
    apellido = Column(String(50))
    email = Column(String(100), unique=True)
    password = Column(String(255), nullable=False)
    rol = Column(Enum('Paciente', 'Medico', 'Administrador'), nullable=False)
    autorizacion_datos = Column(Boolean, default=False)
    id_ips = Column(Integer, ForeignKey('ips.id'))

class Paciente(Base):
    __tablename__ = "pacientes"
    id_usuario = Column(Integer, ForeignKey('usuarios.id'), primary_key=True)

class Medico(Base):
    __tablename__ = "medicos"
    id_usuario = Column(Integer, ForeignKey('usuarios.id'), primary_key=True)
    especialidad = Column(String(100))
    id_ips = Column(Integer, ForeignKey('ips.id'))

class Cita(Base):
    __tablename__ = "citas"
    id = Column(Integer, primary_key=True)
    fecha = Column(DateTime, nullable=False)
    hora = Column(Time, nullable=False)
    motivo = Column(Text)
    estado = Column(Enum('Pendiente', 'Confirmada', 'Cancelada', 'Completada', 'EnAtencion'), default='Pendiente')
    id_paciente = Column(Integer, ForeignKey('pacientes.id_usuario'))
    id_medico = Column(Integer, ForeignKey('medicos.id_usuario'))
    id_consultorio = Column(Integer, ForeignKey('consultorios.id'))

class Observacion(Base):
    __tablename__ = "observaciones"
    id = Column(Integer, primary_key=True)
    contenido = Column(Text, nullable=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow)
    id_cita = Column(Integer, ForeignKey('citas.id'))

class Consultorio(Base):
    __tablename__ = "consultorios"
    id = Column(Integer, primary_key=True)
    numero = Column(String(10), nullable=False)
    piso = Column(Integer)
    estado = Column(Enum('Disponible', 'Ocupado'), default='Disponible')

class Disponibilidad(Base):
    __tablename__ = "disponibilidad"
    id = Column(Integer, primary_key=True)
    dia_semana = Column(Enum('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'), nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    id_medico = Column(Integer, ForeignKey('medicos.id_usuario'))

Base.metadata.create_all(bind=engine)

# Pydantic Models
class UsuarioCreate(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    password: str
    rol: str
    autorizacion_datos: bool

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Contraseña debe tener al menos 8 caracteres')
        if not any(c.isupper() for c in v):
            raise ValueError('Debe tener al menos una mayúscula')
        if not any(c.isdigit() for c in v):
            raise ValueError('Debe tener al menos un número')
        if not any(c in '!@#$%^&*()_+-=' for c in v):
            raise ValueError('Debe tener al menos un símbolo')
        return v

class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str

class CitaCreate(BaseModel):
    fecha: str
    hora: str
    motivo: str
    id_medico: int

class ObservacionCreate(BaseModel):
    contenido: str
    id_cita: int

# Dependencias
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        rol: str = payload.get("rol")
        if email is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        return {"sub": email, "rol": rol}
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

# Funciones auxiliares
def send_email(to_email: str, subject: str, body: str):
    msg = MIMEMultipart()
    msg['From'] = EMAIL_SENDER
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, to_email, msg.as_string())
        server.quit()
    except:
        pass  # En producción, usar logging

# Endpoints

@app.post("/api/register")
async def register(user: UsuarioCreate, db: Session = Depends(get_db)):
    # HU1
    if not user.autorizacion_datos:
        raise HTTPException(status_code=400, detail="Debe autorizar el uso de datos")
    db_user = db.query(Usuario).filter(Usuario.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    hashed = pwd_context.hash(user.password)
    nuevo_usuario = Usuario(
        nombre=user.nombre, apellido=user.apellido, email=user.email,
        password=hashed, rol=user.rol, autorizacion_datos=True, id_ips=1
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    if user.rol == "Paciente":
        db.add(Paciente(id_usuario=nuevo_usuario.id))
    elif user.rol == "Medico":
        db.add(Medico(id_usuario=nuevo_usuario.id, especialidad="General", id_ips=1))
    db.commit()
    return {"success": True, "message": "Usuario registrado"}

@app.post("/api/login")
async def login(user: UsuarioLogin, db: Session = Depends(get_db)):
    db_user = db.query(Usuario).filter(Usuario.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = jwt.encode({
        "sub": db_user.email,
        "rol": db_user.rol,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }, SECRET_KEY, algorithm=ALGORITHM)
    return {"token": token, "user": {"id": db_user.id, "nombre": db_user.nombre, "rol": db_user.rol}}

@app.post("/api/citas")
async def agendar_cita(cita: CitaCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # HU3
    if current_user["rol"] != "Paciente":
        raise HTTPException(status_code=403, detail="Solo pacientes")
    paciente = db.query(Paciente).filter(Paciente.id_usuario == current_user["sub"]).first()
    nueva_cita = Cita(
        fecha=cita.fecha, hora=cita.hora, motivo=cita.motivo,
        id_paciente=paciente.id_usuario, id_medico=cita.id_medico, id_consultorio=1
    )
    db.add(nueva_cita)
    db.commit()
    send_email(current_user["sub"], "Cita Agendada", f"Cita para {cita.fecha} a las {cita.hora}")
    return {"success": True}

@app.get("/api/citas/paciente")
async def get_citas_paciente(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # HU6
    if current_user["rol"] != "Paciente":
        raise HTTPException(status_code=403)
    citas = db.query(Cita).join(Paciente).filter(Paciente.id_usuario == current_user["sub"]).all()
    return [{"id": c.id, "fecha": c.fecha, "hora": c.hora, "estado": c.estado} for c in citas]

@app.delete("/api/citas/{id}")
async def cancelar_cita(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # HU7
    cita = db.query(Cita).filter(Cita.id == id).first()
    if not cita or cita.id_paciente != current_user["sub"]:
        raise HTTPException(status_code=404)
    cita.estado = "Cancelada"
    db.commit()
    return {"success": True}

# ... (HU4, HU5, HU8-HU16 se implementan igual)

@app.get("/")
async def root():
    return {"message": "ZenMediClick API v1.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)