import { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (credentials) => {
    const res = await usuarioService.loginUsuario(credentials);
    if (res.data.user) {
      setUser(res.data.user); // Rol viene de backend/DB
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const register = async (data) => {
    const res = await usuarioService.registerUsuario(data); // Envía rol a backend/DB
    return res;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('citas');
  };

  return { user, login, register, logout };
};