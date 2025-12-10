from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # IMPORTACIÓN NECESARIA

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

# CONFIGURACIÓN DE CORS
origins = [
    "http://localhost:3000",  # Permite al frontend de React comunicarse
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)


# Ruta raíz
@app.get("/")
def root():
    return {"message": "ZenMediClick API funcionando correctamente 🚀"}

# Incluir routers
app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(consultorios.router)
app.include_router(pacientes.router)
app.include_router(medicos.router)
app.include_router(citas.router)