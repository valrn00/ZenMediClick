import { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({
        id: localStorage.getItem('id'),
        nombre: localStorage.getItem('nombre'),
        rol: localStorage.getItem('rol')
      });
    }
  }, []);

  const login = async (credentials) => {
    // Asegúrate de que credentials tenga cedula y password
    if (!credentials?.cedula || !credentials?.password) {
      throw new Error("Faltan credenciales");
    }

    const data = await usuarioService.loginUsuario(credentials);

    localStorage.setItem('token', data.token);
    localStorage.setItem('id', data.user.id);
    localStorage.setItem('nombre', data.user.nombre);
    localStorage.setItem('rol', data.user.rol);
    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return { user, login, logout };
};