import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const API = "https://zenmediclick.onrender.com";

export default function DoctorDashboard() {
  const [citas, setCitas] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`${API}/citas/medico/${user.id}`, {
      headers: { Authorization: token }
    })
      .then((r) => r.json())
      .then(setCitas);
  }, [token]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#1e40af' }}>Citas del Día</Typography>

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
                  <TableCell>{c.paciente}</TableCell>
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
