import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Cambia a tu URL de FastAPI

export const login = async (credentials) => {
  // Simulación: En producción, usa axios.post(`${API_URL}/login`, credentials)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ role: 'paciente' }); // Simula rol (cambia para probar otros)
    }, 1000);
  });
};

export const registro = async (data) => {
  // Simulación
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export const agendarCita = async (data) => {
  // Simulación
  return new Promise((resolve) => setTimeout(resolve, 1000));
};