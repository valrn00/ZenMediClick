from fastapi import Depends, HTTPException
from app.utils.auth import verify_token

def require_admin(token: dict = Depends(verify_token)):
    if token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Acceso restringido para administradores")
    return token

