import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function DoctorDashboard() {
  const [citas, setCitas] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost/backend/main.php/citas/medico', {
      headers: { 'Authorization': token }
    })
    .then(r => r.json())
    .then(setCitas);
  }, [token]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#1e40af' }}>Citas de Hoy</Typography>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Paciente</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Motivo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {citas.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.nombre}</TableCell>
                  <TableCell>{c.hora}</TableCell>
                  <TableCell>{c.motivo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}