import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { citasService } from '../services/citasService';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, TextField, Select, MenuItem, Button, Typography, Box } from '@mui/material';

export const PatientDashboard = () => {
  const { user, token, logout } = useAuth();
  const [citas, setCitas] = useState([]);
  const [newCita, setNewCita] = useState({ medico: '', fecha: '', hora: '' });

  useEffect(() => {
    const fetchCitas = async () => {
      const res = await citasService.getCitas();
      setCitas(res.data || []);
    };
    fetchCitas();
  }, [token]);

  const handleAgendar = async (e) => {
    e.preventDefault();
    const cita = { ...newCita, id_paciente: user.email, id_medico: newCita.medico.split('-')[0] }; // Ajusta ID
    const res = await citasService.agendarCita(cita);
    if (res.data) setCitas([...citas, cita]);
    setNewCita({ medico: '', fecha: '', hora: '' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, p: 3, backgroundColor: '#f4f7fa', borderRadius: 2 }}>
      <Typography variant="h4" color="#007bff">Dashboard Paciente</Typography>
      <Box component="form" onSubmit={handleAgendar} sx={{ mb: 4 }}>
        <Select fullWidth value={newCita.medico} onChange={(e) => setNewCita({ ...newCita, medico: e.target.value })} sx={{ mb: 2 }}>
          <MenuItem value="1-Dr. Pérez">Dr. Juan Pérez</MenuItem>
          <MenuItem value="2-Dra. López">Dra. María López</MenuItem>
        </Select>
        <TextField fullWidth type="date" label="Fecha" value={newCita.fecha} onChange={(e) => setNewCita({ ...newCita, fecha: e.target.value })} sx={{ mb: 2 }} />
        <TextField fullWidth type="time" label="Hora" value={newCita.hora} onChange={(e) => setNewCita({ ...newCita, hora: e.target.value })} sx={{ mb: 2 }} />
        <Button variant="contained" sx={{ backgroundColor: '#28a745', '&:hover': { backgroundColor: '#218838' } }} type="submit">Agendar</Button>
      </Box>
      <Typography variant="h6" color="#007bff">Citas Programadas</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Hora</TableCell>
            <TableCell>Médico</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {citas.map((cita) => (
            <TableRow key={cita.id}>
              <TableCell>{cita.fecha}</TableCell>
              <TableCell>{cita.hora}</TableCell>
              <TableCell>{cita.medico}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={logout} sx={{ mt: 2, backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}>Logout</Button>
    </Container>
  );
};