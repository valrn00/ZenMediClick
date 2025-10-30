import { Container, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [citas, setCitas] = useState([]);
  const [obs, setObs] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/citas/medico`).then(res => setCitas(res.data));
  }, []);

  const addObs = async (id) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/observaciones`, { id_cita: id, contenido: obs });
    setObs('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#1e40af' }}>Dr. {user?.nombre}</Typography>

      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Agenda del Día</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Paciente</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Observaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {citas.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.paciente}</TableCell>
                  <TableCell>{c.hora}</TableCell>
                  <TableCell>
                    <TextField size="small" value={obs} onChange={(e) => setObs(e.target.value)} />
                    <Button size="small" onClick={() => addObs(c.id)}>Guardar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Button onClick={logout} sx={{ mt: 4, float: 'right' }}>Cerrar Sesión</Button>
    </Container>
  );
}