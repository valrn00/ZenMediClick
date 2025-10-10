import axios from 'axios';
const API_URL = 'http://localhost:8000/api'; // Ajusta a tu backend

export const usuarioService = {
  async loginUsuario({ email, password }) {
    return axios.post(`${API_URL}/login`, { email, password });
  },
  async registerUsuario(data) {
    return axios.post(`${API_URL}/register`, data);
  }
};