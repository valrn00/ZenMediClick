import { useState, useEffect } from 'react';
import { citasService } from '../services/citasService';

export const useCitas = () => {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('citas');
    if (stored) setCitas(JSON.parse(stored));
  }, []);

  const agendar = async (cita) => {
    const newCita = { ...cita, id: Date.now(), paciente: localStorage.getItem('user')?.email || 'Unknown' };
    await citasService.agendarCita(newCita);
    const newCitas = [...citas, newCita];
    setCitas(newCitas);
    localStorage.setItem('citas', JSON.stringify(newCitas));
  };

  const eliminar = async (id) => {
    await citasService.eliminarCita(id);
    const newCitas = citas.filter(c => c.id !== id);
    setCitas(newCitas);
    localStorage.setItem('citas', JSON.stringify(newCitas));
  };

  return { citas, agendar, eliminar };
};