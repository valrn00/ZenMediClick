from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import Usuario
from app.utils.hashing import hash_password

router = APIRouter(prefix="/pacientes", tags=["Pacientes"])

@router.post("/register")
def register(nombre: str, email: str, password: str, db: Session = Depends(get_db)):
    existe = db.query(Usuario).filter(Usuario.email == email).first()
    if existe:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    nuevo = Usuario(
        nombre=nombre,
        email=email,
        cedula="cedula",
        password=hash_password(password),
        rol="paciente"
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return {"msg": "Paciente registrado", "id": nuevo.id}

@router.get("/")
def listar_pacientes(db: Session = Depends(get_db)):
    return db.query(Usuario).filter(Usuario.rol == "paciente").all()

@router.get("/{id}")
def obtener_paciente(id: int, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.id == id, Usuario.rol == "paciente").first()
    if not user:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return user
