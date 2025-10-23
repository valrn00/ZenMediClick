import { createContext, useContext, useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      setToken(stored);
      // Opcional: validar token con backend
    }
  }, []);

  const login = async (credentials) => {
    const res = await usuarioService.loginUsuario(credentials);
    if (res.data.user) {
      const { user, token } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token); // SENA: persistencia
    }
    return res;
  };

  const register = async (data) => {
    const res = await usuarioService.registerUsuario(data);
    if (res.data.success) {
      return await login({ email: data.cedula, password: data.password });
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);