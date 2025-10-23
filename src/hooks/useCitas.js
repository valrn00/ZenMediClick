import { useState, useEffect } from 'react';
import { citasService } from '../services/citasService';

export const useCitas = () => {
  const [citas, setCitas] = useState([]);

  const cargarCitas = async () => {
    const res = await citasService.getCitas();
    setCitas(res.data);
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const agendarCita = async (cita) => {
    await citasService.agendarCita(cita);
    cargarCitas();
  };

  const cancelarCita = async (id) => {
    await citasService.cancelarCita(id);
    cargarCitas();
  };

  return { citas, cargarCitas, agendarCita, cancelarCita };
};