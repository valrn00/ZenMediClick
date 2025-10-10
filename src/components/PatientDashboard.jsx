import React, { useState } from 'react';
import { useCitas } from '../hooks/useCitas';
import { useAuth } from '../hooks/useAuth';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, TextField, Select, MenuItem, Button, Typography, Box } from '@mui/material';
export const PatientDashboard = () => {
  const { citas, agendar } = useCitas();
  const { logout } = useAuth();
  const [newCita, setNewCita] = useState({ medico: '', fecha: '', hora: '' });
  const handleAgendar = async (e) => {
    e.preventDefault();
    await agendar(newCita);
    setNewCita({ medico: '', fecha: '', hora: '' });
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4, p: 3, backgroundColor: '#f4f7fa', borderRadius: 2 }}>
      <Typography variant="h4" color="#007bff">Dashboard Paciente</Typography>
      <Box component="form" onSubmit={handleAgendar} sx={{ mb: 4 }}>
        <Select fullWidth value={newCita.medico} onChange={(e) => setNewCita({...newCita, medico: e.target.value})} sx={{ mb: 2 }}>
          <MenuItem value="Dr. Pérez">Dr. Juan Pérez</MenuItem>
          <MenuItem value="Dra. López">Dra. María López</MenuItem>
        </Select>
        <TextField fullWidth type="date" label="Fecha" value={newCita.fecha} onChange={(e) => setNewCita({...newCita, fecha: e.target.value})} sx={{ mb: 2 }} />
        <TextField fullWidth type="time" label="Hora" value={newCita.hora} onChange={(e) => setNewCita({...newCita, hora: e.target.value})} sx={{ mb: 2 }} />
        <Button variant="contained" sx={{ backgroundColor: '#28a745' }} type="submit">Agendar</Button>
      </Box>
      <Typography variant="h6" color="#007bff">Citas Programadas</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Hora</TableCell>
            <TableCell>Médico</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {citas.map((cita) => (
            <TableRow key={cita.id}>
              <TableCell>{cita.fecha}</TableCell>
              <TableCell>{cita.hora}</TableCell>
              <TableCell>{cita.medico}</TableCell>
              <TableCell>
                <Button sx={{ backgroundColor: '#007bff' }} onClick={() => alert('Reagendar simulado')}>Reagendar</Button>
                <Button sx={{ backgroundColor: '#28a745' }} onClick={() => alert('Cancelar simulado')}>Cancelar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={logout} sx={{ mt: 2, backgroundColor: '#007bff' }}>Logout</Button>
    </Container>
  );
};