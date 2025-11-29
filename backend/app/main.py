from fastapi import FastAPI
from app.routers import auth, citas, disponibilidad
from app.database import Base, engine
from app import models


app = FastAPI(title="ZenMediClick")

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(citas.router)
app.include_router(disponibilidad.router)

@app.get("/")
def root():
    return {"Backend ZenMediClick funcionando sin correos"}
