import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import jsPDF from 'jspdf';

export default function PatientDashboard() {
  const [citas, setCitas] = useState([]);
  const [open, setOpen] = useState(false);
  const [nueva, setNueva] = useState({ fecha: '', hora: '', motivo: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost/backend/main.php/citas', {
      headers: { 'Authorization': token }
    })
    .then(r => r.json())
    .then(setCitas);
  }, [token]);

  const agendar = async () => {
    await fetch('http://localhost/backend/main.php/citas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ ...nueva, id_medico: 1 })
    });
    setOpen(false);
    window.location.reload();
  };

  const cancelar = async (id) => {
    await fetch('http://localhost/backend/main.php/citas/cancelar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ id })
    });
    setCitas(citas.filter(c => c.id !== id));
  };

  const generarPDF = (cita) => {
    const doc = new jsPDF();
    doc.text("Constancia de Cita", 20, 20);
    doc.text(`Paciente: ${JSON.parse(localStorage.getItem('user')).nombre}`, 20, 30);
    doc.text(`Fecha: ${cita.fecha}`, 20, 40);
    doc.save('constancia.pdf');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#1e40af' }}>Mis Citas</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Button fullWidth variant="contained" onClick={() => setOpen(true)}>Nueva Cita</Button>
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
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {citas.map((c) => (
                    <TableRow key={c.id}>
 aina                      <TableCell>{c.fecha}</TableCell>
                      <TableCell>{c.estado}</TableCell>
                      <TableCell>
                        <Button size="small" color="error" onClick={() => cancelar(c.id)}>Cancelar</Button>
                        <Button size="small" onClick={() => generarPDF(c)}>PDF</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Agendar Cita</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Fecha" type="date" value={nueva.fecha} onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Hora" type="time" value={nueva.hora} onChange={(e) => setNueva({ ...nueva, hora: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Motivo" value={nueva.motivo} onChange={(e) => setNueva({ ...nueva, motivo: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={agendar} variant="contained">Agendar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}