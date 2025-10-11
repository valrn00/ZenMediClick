import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { citasService } from '../services/citasService';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button } from '@mui/material';

export const DoctorDashboard = () => {
  const { user, token, logout } = useAuth();
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const fetchCitas = async () => {
      const res = await citasService.getCitas();
      setCitas(res.data.filter(c => c.id_medico === user.email) || []); // Filtra por médico
    };
    fetchCitas();
  }, [token]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, p: 3, backgroundColor: '#f4f7fa', borderRadius: 2 }}>
      <Typography variant="h4" color="#007bff">Dashboard Médico</Typography>
      <Typography variant="h6" color="#007bff">Citas del Día</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Paciente</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Hora</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {citas.map((cita) => (
            <TableRow key={cita.id}>
              <TableCell>{cita.id_paciente}</TableCell>
              <TableCell>{cita.fecha}</TableCell>
              <TableCell>{cita.hora}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={logout} sx={{ mt: 2, backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}>Logout</Button>
    </Container>
  );
};