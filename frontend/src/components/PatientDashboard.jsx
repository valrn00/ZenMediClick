import { Container, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useCitas } from '../hooks/useCitas';
import { useState } from 'react';
import jsPDF from 'jspdf';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const { citas, agendar, cancelar } = useCitas();
  const [open, setOpen] = useState(false);
  const [nueva, setNueva] = useState({ medico: '', fecha: '', motivo: '' });

  const handleAgendar = () => {
    agendar(nueva);
    setOpen(false);
    setNueva({ medico: '', fecha: '', motivo: '' });
  };

  const generarConstancia = (cita) => {
    const doc = new jsPDF();
    doc.text(`Constancia de Cita`, 20, 20);
    doc.text(`Paciente: ${user.nombre}`, 20, 30);
    doc.text(`Médico: ${cita.medico}`, 20, 40);
    doc.text(`Fecha: ${cita.fecha}`, 20, 50);
    doc.save('constancia.pdf');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#1e40af' }}>Hola, {user?.nombre}</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Agendar Cita</Typography>
              <Button fullWidth variant="contained" onClick={() => setOpen(true)}>Nueva Cita</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Mis Citas</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Médico</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {citas.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.fecha}</TableCell>
                      <TableCell>{c.medico}</TableCell>
                      <TableCell>{c.estado}</TableCell>
                      <TableCell>
                        <Button size="small" color="error" onClick={() => cancelar(c.id)}>Cancelar</Button>
                        <Button size="small" onClick={() => generarConstancia(c)}>PDF</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button onClick={logout} sx={{ mt: 4, float: 'right' }}>Cerrar Sesión</Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Agendar Cita</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Médico" value={nueva.medico} onChange={(e) => setNueva({ ...nueva, medico: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth type="date" value={nueva.fecha} onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Motivo" multiline rows={2} value={nueva.motivo} onChange={(e) => setNueva({ ...nueva, motivo: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleAgendar} variant="contained">Agendar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}