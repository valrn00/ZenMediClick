import { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Opcional: Verifica token con /api/users/me
      // const res = await axios.get(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${storedToken}` } });
      // if (res.data) setUser(res.data);
    }
  }, []);

  const login = async (credentials) => {
    const res = await usuarioService.loginUsuario(credentials);
    if (res.data.user) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token); // Solo token, no user
    }
    return res;
  };

  const register = async (data) => {
    const res = await usuarioService.registerUsuario(data);
    if (res.data.success) {
      const loginRes = await login({ email: data.email, password: data.password });
      if (loginRes.data.user) {
        setUser(loginRes.data.user);
        setToken(loginRes.data.token);
        localStorage.setItem('token', loginRes.data.token);
      }
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return { user, token, login, register, logout };
};