import { useState } from 'react';
import { TextField, Button, MenuItem, Container } from '@mui/material';
import { agendarCita } from '../services/api';

function CitaForm() {
  const [medico, setMedico] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await agendarCita({ medico, fecha, hora });
      alert('Cita agendada');
    } catch (err) {
      alert('Error al agendar');
    }
  };

  return (
    <Container maxWidth="sm">
      <h3>Agendar Nueva Cita</h3>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Médico"
          value={medico}
          onChange={(e) => setMedico(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="medico1">Dr. Juan Pérez</MenuItem>
          <MenuItem value="medico2">Dra. María López</MenuItem>
        </TextField>
        <TextField type="date" label="Fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} fullWidth margin="normal" />
        <TextField type="time" label="Hora" value={hora} onChange={(e) => setHora(e.target.value)} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary">Agendar</Button>
      </form>
    </Container>
  );
}

export default CitaForm;