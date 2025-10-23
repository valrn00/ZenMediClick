from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date, time

class UsuarioBase(BaseModel):
    nombre: str
    cedula: str
    email: Optional[EmailStr] = None
    rol: str

class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=8)

class UsuarioOut(UsuarioBase):
    id: int
    activo: bool

    class Config:
        from_attributes = True

class Login(BaseModel):
    cedula: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class CitaBase(BaseModel):
    fecha: date
    hora: time
    motivo: Optional[str] = None

class CitaCreate(CitaBase):
    medico_id: int

class CitaOut(CitaBase):
    id: int
    estado: str
    paciente_nombre: str
    medico_nombre: str

    class Config:
        from_attributes = True

class ResetPassword(BaseModel):
    email: EmailStr

class ResetConfirm(BaseModel):
    token: str
    new_password: str