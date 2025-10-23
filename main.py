from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ZenMediClick API")
security = HTTPBearer()

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

@app.post("/api/register", response_model=schemas.UsuarioOut)
def register(user: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    if crud.get_usuario_by_cedula(db, user.cedula):
        raise HTTPException(status_code=400, detail="Cédula ya registrada")
    return crud.create_usuario(db, user)

@app.post("/api/login")
def login(cred: schemas.Login, db: Session = Depends(get_db)):
    return crud.login_usuario(db, cred)

@app.post("/api/reset-password")
def reset_password(req: schemas.ResetPassword, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    return crud.send_reset_token(db, req.email, background_tasks)

@app.post("/api/reset-password/confirm")
def confirm_reset(req: schemas.ResetConfirm, db: Session = Depends(get_db)):
    return crud.reset_password(db, req)

@app.get("/api/usuarios")
def get_usuarios(db: Session = Depends(get_db), token: str = Depends(security)):
    crud.verify_admin(token)
    return crud.get_usuarios(db)

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