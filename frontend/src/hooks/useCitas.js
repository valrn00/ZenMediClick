import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCitas = () => {
  const [citas, setCitas] = useState([]);

  const load = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/citas/paciente`);
      setCitas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const agendar = async (data) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/citas`, data);
    load();
  };

  const cancelar = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/citas/${id}`);
    load();
  };

  useEffect(() => { load(); }, []);

  return { citas, agendar, cancelar, load };
};