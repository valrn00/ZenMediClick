from fastapi import HTTPException
from sqlalchemy.orm import Session
# Asegúrate de que todas estas importaciones sean correctas según tu estructura
from app.database import get_db 
from app.models.admin import Admin 
from app.utils.auth import verify_password, hash_password, create_access_token

def admin_login(db: Session, email: str, password: str):
    """
    Intenta autenticar a un administrador.
    """
    # 1. Buscar al administrador por email
    admin = db.query(Admin).filter(Admin.email == email).first()

    # 2. Verificar existencia del administrador
    if not admin:
        raise HTTPException(
            status_code=401, 
            detail="Credenciales inválidas"
        )

    # 3. Solución Final para Pylance:
    # Usamos la asignación de tipo, pero le decimos a Pylance que ignore 
    # la advertencia de que "admin.password" es un "Column[str]"
    hashed_password: str = admin.password # type: ignore 
    
    # 4. Verificar la contraseña hasheada
    if not verify_password(password, hashed_password):
        raise HTTPException(
            status_code=401, 
            detail="Credenciales inválidas"
        )

    # 5. Crear el token de acceso
    token = create_access_token(
        data={"role": "admin", "id": admin.id}
    )

    # 6. Devolver la respuesta
    return {
        "success": True,
        "message": "Admin autenticado correctamente",
        "token": token
    }

def admin_register(db: Session, nombre: str, email: str, password: str):
    """
    Registra un nuevo administrador.
    """
    # 1. Verificar si el email ya existe
    existe = db.query(Admin).filter(Admin.email == email).first()
    if existe:
        raise HTTPException(
            status_code=400, 
            detail="Este email ya está registrado"
        )

    # 2. Crear el nuevo objeto Admin con la contraseña hasheada
    nuevo_admin = Admin(
        nombre=nombre,
        email=email,
        # Importante: siempre hashear la contraseña
        password=hash_password(password)
    )

    # 3. Guardar en la base de datos
    db.add(nuevo_admin)
    db.commit()
    db.refresh(nuevo_admin) # Carga el objeto con el ID generado

    # 4. Devolver la respuesta (solo datos seguros)
    return {
        "success": True,
        "message": "Administrador creado correctamente",
        "admin_id": nuevo_admin.id,
        "nombre": nuevo_admin.nombre
    }