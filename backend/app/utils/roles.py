ADMIN_EMAILS = [
    "admin1@zen.com",
    "admin2@zen.com"
]

def is_admin(email: str):
    return email in ADMIN_EMAILS
