import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const usuarioService = {
  async loginUsuario({ email, password }) {
    return await axios.post(`${API_URL}/login`, { email, password });
  },

  async registerUsuario(data) {
    return await axios.post(`${API_URL}/register`, data);
  },

  async resetPassword(email) {
    return await axios.post(`${API_URL}/reset-password`, { email });
  },

  async getUsuarios() {
    return await axios.get(`${API_URL}/usuarios`, getHeaders());
  }
};