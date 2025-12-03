from fastapi import FastAPI 

# importa routers
from app.routers import consultorios, pacientes, medicos, citas, auth
from app.routers.admin_router import router as admin_router

# PRIMERO crea la app
app = FastAPI(
    title="ZenMediClick API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "ZenMediClick API funcionando correctamente 🚀"}

# Luego incluye los routers
app.include_router(admin_router)
app.include_router(auth.router)
app.include_router(consultorios.router)
app.include_router(pacientes.router)
app.include_router(medicos.router)
app.include_router(citas.router)
