from fastapi import FastAPI

# Importar routers
from app.routers import (
    admin,
    auth,
    consultorios,
    pacientes,
    medicos,
    citas
)

# Crear la app
app = FastAPI(
    title="ZenMediClick API",
    version="1.0.0"
)

# Ruta raíz
@app.get("/")
def root():
    return {"message": "ZenMediClick API funcionando correctamente 🚀"}

# Incluir routers (el orden NO importa, pero la app debe existir primero)
app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(consultorios.router)
app.include_router(pacientes.router)
app.include_router(medicos.router)
app.include_router(citas.router)
