from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# IMPORTS CORREGIDOS 
import crud
import models
import schemas
from database import SessionLocal, engine

# Crear tablas
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ZenMediClick API")
security = HTTPBearer()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------- AUTH -------------------
@app.post("/api/register", response_model=schemas.UsuarioOut)
def register(user: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    if crud.get_usuario_by_cedula(db, user.cedula):
        raise HTTPException(status_code=400, detail="Cédula ya registrada")
    return crud.create_usuario(db, user)

@app.post("/api/login")
def login(cred: schemas.Login, db: Session = Depends(get_db)):
    return crud.login_usuario(db, cred)

# ------------------- USUARIOS (ADMIN) -------------------
@app.get("/api/usuarios")
def get_usuarios(db: Session = Depends(get_db), token: str = Depends(security)):
    crud.verify_admin(token.credentials)
    return crud.get_usuarios(db)

# ------------------- CITAS -------------------
@app.get("/api/citas")
def get_citas(db: Session = Depends(get_db), token: str = Depends(security)):
    payload = crud.decode_token(token.credentials)
    return crud.get_citas_by_user(db, payload["sub"], payload["rol"])

@app.post("/api/citas")
def agendar_cita(cita: schemas.CitaCreate, db: Session = Depends(get_db), token: str = Depends(security)):
    payload = crud.decode_token(token.credentials)
    return crud.agendar_cita(db, cita, payload["sub"])

@app.delete("/api/citas/{cita_id}")
def cancelar_cita(cita_id: int, db: Session = Depends(get_db), token: str = Depends(security)):
    payload = crud.decode_token(token.credentials)
    return crud.cancelar_cita(db, cita_id, payload["sub"])