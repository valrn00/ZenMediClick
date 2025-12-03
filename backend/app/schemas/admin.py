from pydantic import BaseModel

class AdminBase(BaseModel):
    nombre: str
    email: str

class AdminCreate(AdminBase):
    password: str

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminOut(AdminBase):
    id: int

    class Config:
        orm_mode = True
