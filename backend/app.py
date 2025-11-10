# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",  # pon tu contraseña si tienes
        database="zenmediclick",
        port=3306
    )

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Datos recibidos:", data)  # para que veas en consola
    
    try:
        db = get_db()
        cur = db.cursor()
        
        # Acepta cedula O email
        cedula = data.get('cedula', '').strip()
        email = data.get('email', '').strip()
        
        sql = """INSERT INTO usuarios (nombre, cedula, email, password, rol) 
                 VALUES (%s, %s, %s, %s, %s)"""
        cur.execute(sql, (
            data.get('nombre', '').strip(),
            cedula if cedula else None,
            email if email else None,
            data.get('password', ''),
            data.get('rol', 'Paciente')
        ))
        db.commit()
        user_id = cur.lastrowid
        db.close()
        
        return jsonify({"success": True, "message": "Registrado con éxito", "user_id": user_id})
    
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error MySQL: {str(err)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        db = get_db()
        cur = db.cursor(dictionary=True)
        
        identifier = data.get('cedula', '').strip()
        cur.execute("SELECT * FROM usuarios WHERE cedula = %s OR email = %s", (identifier, identifier))
        user = cur.fetchone()
        db.close()
        
        if user and user['password'] == data['password']:
            return jsonify({
                "success": True,
                "token": "fake-jwt-123",
                "user": {"id": user['id'], "nombre": user['nombre'], "rol": user['rol']}
            })
        else:
            return jsonify({"error": "Cédula/Email o contraseña incorrecta"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return "Backend Flask corriendo - ZenMediClick"

if __name__ == '__main__':
    app.run(port=8000, debug=True)