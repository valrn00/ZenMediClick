import { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Button,
  Table, TableBody, TableCell, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import jsPDF from 'jspdf';

export default function PatientDashboard() {
  const [citas, setCitas] = useState([]);
  const [open, setOpen] = useState(false);
  const [nueva, setNueva] = useState({ fecha: '', hora: '', motivo: '' });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // 🔥 Cargar citas
  useEffect(() => {
    fetch('http://localhost:4000/api/citas', {
      headers: { 'Authorization': token }
    })
      .then(res => res.json())
      .then(setCitas)
      .catch(() => console.error('Error cargando citas'));
  }, [token]);

  // 🔥 Agendar nueva cita
  const agendar = async () => {
    if (!nueva.fecha || !nueva.hora || !nueva.motivo) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const res = await fetch('http://localhost:4000/api/citas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ ...nueva, id_medico: 1 })
    });

    if (res.ok) {
      const creada = await res.json();
      setCitas([...citas, creada]);
      setOpen(false);
      setNueva({ fecha: '', hora: '', motivo: '' });
    } else {
      alert('Error al agendar cita');
    }
  };

  // 🔥 Cancelar cita
  const cancelar = async (id) => {
    const res = await fetch(`http://localhost:4000/api/citas/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': token }
    });

    if (res.ok) {
      setCitas(citas.filter(c => c.id !== id));
    }
  };

  // 🔥 Generar PDF
  const generarPDF = (cita) => {
    const doc = new jsPDF();
    doc.text("Constancia de Cita Médica", 20, 20);
    doc.text(`Paciente: ${user.nombre}`, 20, 35);
    doc.text(`Fecha: ${cita.fecha}`, 20, 45);
    doc.text(`Hora: ${cita.hora}`, 20, 55);
    doc.text(`Motivo: ${cita.motivo}`, 20, 65);
    doc.text(`Estado: ${cita.estado}`, 20, 75);
    doc.save('constancia_cita.pdf');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#1e40af' }}>
        Mis Citas
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Button fullWidth variant="contained" onClick={() => setOpen(true)}>
                Nueva Cita
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Motivo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {citas.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.fecha}</TableCell>
                      <TableCell>{c.hora}</TableCell>
                      <TableCell>{c.motivo}</TableCell>
                      <TableCell>{c.estado}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => cancelar(c.id)}
                        >
                          Cancelar
                        </Button>
                        <Button size="small" onClick={() => generarPDF(c)}>
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {citas.length === 0 && (
                <Typography sx={{ mt: 2, textAlign: 'center', color: 'gray' }}>
                  No tienes citas registradas.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 🔥 Modal Nueva Cita */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Agendar Cita</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Fecha"
            type="date"
            value={nueva.fecha}
            onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Hora"
            type="time"
            value={nueva.hora}
            onChange={(e) => setNueva({ ...nueva, hora: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Motivo"
            value={nueva.motivo}
            onChange={(e) => setNueva({ ...nueva, motivo: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
          <Button variant="contained" onClick={agendar}>Agendar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
