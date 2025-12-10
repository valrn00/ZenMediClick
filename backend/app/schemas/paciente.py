from pydantic import BaseModel, EmailStr

# Este schema define la estructura exacta del JSON que el frontend debe enviar
class PacienteCreate(BaseModel):
    nombre: str
    cedula: str
    email: EmailStr # Usa EmailStr para mejor validación de formato de correo
    password: str

    # Configuración opcional para Pydantic 2+ para la compatibilidad con modelos de SQLAlchemy
    class Config:
        from_attributes = True