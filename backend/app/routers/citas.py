# app/routers/citas.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, time, datetime
from typing import Optional

from app.database import get_db
from app.models.availability import Disponibilidad
from app.models.appointment import Cita
# Si tus modelos usan enums para estado, ajusta; aquí se usan strings conservadores.

router = APIRouter(prefix="/citas", tags=["Citas"])


def medico_ocupado(db: Session, medico_id: int, fecha: date, hora: time, exclude_cita_id: Optional[int] = None) -> bool:
    """
    Verifica si el médico ya tiene una cita confirmada/programada en la misma fecha+hora.
    exclude_cita_id: id de cita a excluir (útil al reagendar).
    """
    q = db.query(Cita).filter(
        Cita.medico_id == medico_id,
        Cita.fecha == fecha,
        Cita.hora == hora,
        Cita.estado.in_(["programada", "en atención", "asistida"])  # estados que bloquean
    )
    if exclude_cita_id:
        q = q.filter(Cita.id != exclude_cita_id)
    return db.query(q.exists()).scalar()


@router.post("/agendar")
def agendar_cita(paciente_id: int, medico_id: int, fecha: date, hora: time, db: Session = Depends(get_db)):
    # 1) comprobar que existe disponibilidad exacta (la lógica de negocio que pediste)
    disp = db.query(Disponibilidad).filter(
        Disponibilidad.medico_id == medico_id,
        Disponibilidad.fecha == fecha,
        Disponibilidad.hora == hora
    ).first()

    if not disp:
        raise HTTPException(status_code=400, detail="No hay disponibilidad para ese médico en la fecha/hora solicitada.")

    # 2) comprobar conflictos con otras citas
    if medico_ocupado(db, medico_id, fecha, hora):
        raise HTTPException(status_code=400, detail="El médico ya tiene una cita en esa franja horaria.")

    nueva = Cita(
        paciente_id=paciente_id,
        medico_id=medico_id,
        fecha=fecha,
        hora=hora,
        estado="programada"
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)

    # lugar para agregar notificación en background si se activa después
    # background_tasks.add_task(send_notification, ...)

    return {"msg": "Cita creada", "id": nueva.id, "fecha": nueva.fecha, "hora": nueva.hora}


@router.put("/cancelar/{cita_id}")
def cancelar_cita(cita_id: int, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada.")
    if str(cita.estado) == "cancelada":
        return {"msg": "La cita ya estaba cancelada."}

    cita.estado = "cancelada"  # type: ignore
    db.commit()
    return {"msg": "Cita cancelada", "id": cita.id}


@router.put("/reagendar/{cita_id}")
def reagendar_cita(cita_id: int, nueva_fecha: date, nueva_hora: time, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada.")

    # validar disponibilidad y conflictos (excluyendo la misma cita)
    disp = db.query(Disponibilidad).filter(
        Disponibilidad.medico_id == cita.medico_id,
        Disponibilidad.fecha == nueva_fecha,
        Disponibilidad.hora == nueva_hora
    ).first()
    if not disp:
        raise HTTPException(status_code=400, detail="No hay disponibilidad en la nueva fecha/hora.")

    if medico_ocupado(db, cita.medico_id, nueva_fecha, nueva_hora, exclude_cita_id=cita.id):  # type: ignore
        raise HTTPException(status_code=400, detail="Conflicto: el médico tiene otra cita en la nueva franja.")

    cita.fecha = nueva_fecha  # type: ignore
    cita.hora = nueva_hora  # type: ignore
    cita.estado = "programada"  # type: ignore
    db.commit()
    return {"msg": "Cita reagendada", "id": cita.id, "fecha": cita.fecha, "hora": cita.hora}


@router.put("/llegada/{cita_id}")
def registrar_llegada(cita_id: int, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada.")
    cita.estado = "en atención"  # type: ignore
    db.commit()
    return {"msg": "Llegada registrada", "id": cita.id, "estado": cita.estado}


@router.put("/finalizar/{cita_id}")
def finalizar_cita(cita_id: int, observacion: Optional[str] = None, diagnostico: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Finaliza la cita y (opcional) añade resumen que luego puedes guardar en historial.
    Aquí solo actualizamos estado; la creación del registro clínico queda en /historial.
    """
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada.")
    cita.estado = "asistida"  # type: ignore
    db.commit()
    return {"msg": "Cita finalizada", "id": cita.id}
