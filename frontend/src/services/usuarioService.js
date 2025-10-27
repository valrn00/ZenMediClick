import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const usuarioService = {
  async loginUsuario({ cedula, password }) {
    try {
      const res = await api.post('/login', { 
        cedula: cedula?.trim() || '', 
        password: password?.trim() || '' 
      });
      return res.data;
    } catch (error) {
      console.error("Error en login:", error.response?.data || error.message);
      throw error; // Deja que el backend diga qué falla
    }
  },

  async registerUsuario(data) {
    try {
      const res = await api.post('/register', {
        nombre: data.nombre?.trim() || '',
        cedula: data.cedula?.trim() || '',
        email: data.email?.trim() || '',
        password: data.password?.trim() || '',
        rol: data.rol
      });
      return res.data;
    } catch (error) {
      console.error("Error en registro:", error.response?.data || error.message);
      throw error;
    }
  }
};