import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const usuarioService = {
  async loginUsuario({ email, password }) {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      return res;
    } catch (error) {
      return { data: { user: null } };
    }
  },
  async registerUsuario({ nombre, apellido, email, password, rol }) {
    try {
      const res = await axios.post(`${API_URL}/register`, { nombre, apellido, email, password, rol });
      return res;
    } catch (error) {
      return { data: { success: false } };
    }
  }
};