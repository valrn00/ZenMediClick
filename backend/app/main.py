from fastapi import FastAPI

from app.routers import consultorios, pacientes, medicos, citas  # los que tengas

app = FastAPI(
    title="ZenMediClick API",
    version="1.0.0"
)
@app.get("/")
def root():
    return {"message": "ZenMediClick API funcionando correctamente 🚀"}


app.include_router(consultorios.router)
app.include_router(pacientes.router)
app.include_router(medicos.router)
app.include_router(citas.router)
