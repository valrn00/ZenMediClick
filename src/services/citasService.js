import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const citasService = {
  async getCitas() {
    try {
      const res = await axios.get(`${API_URL}/citas`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      return res;
    } catch (error) {
      return { data: [] };
    }
  },
  async agendarCita(cita) {
    try {
      const res = await axios.post(`${API_URL}/citas`, cita, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      return res;
    } catch (error) {
      return { data: { success: false } };
    }
  },
  async actualizarCita(id, data) {
    try {
      const res = await axios.put(`${API_URL}/citas/${id}`, data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      return res;
    } catch (error) {
      return { data: { success: false } };
    }
  },
  async eliminarCita(id) {
    try {
      const res = await axios.delete(`${API_URL}/citas/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      return res;
    } catch (error) {
      return { data: { success: false } };
    }
  }
};