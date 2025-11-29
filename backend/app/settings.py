from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Base de datos (reemplace con TU URL)
    DATABASE_URL: str = "mysql+pymysql://usuario:password@host/basedatos"

    # JWT
    SECRET_KEY: str = "superclaveultrasecreta"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"

settings = Settings()

