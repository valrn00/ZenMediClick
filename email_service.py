from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
import os
from jinja2 import Environment, FileSystemLoader

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_SENDER"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASSWORD"),
    MAIL_FROM=os.getenv("EMAIL_SENDER"),
    MAIL_PORT=int(os.getenv("EMAIL_PORT")),
    MAIL_SERVER=os.getenv("EMAIL_HOST"),
    MAIL_TLS=True,
    MAIL_SSL=False
)

template_env = Environment(loader=FileSystemLoader("templates"))

async def send_reset_email(email: str, token: str):
    template = template_env.get_template("reset_password.html")
    html = template.render(reset_link=f"http://localhost:3000/reset-confirm?token={token}")

    message = MessageSchema(
        subject="Restablecer contraseña - ZenMediClick",
        recipients=[email],
        body=html,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)