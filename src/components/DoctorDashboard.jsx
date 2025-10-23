import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { citasService } from '../services/citasService';
import { Container, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogActions, TextField } from '@mui/material';

export const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [citas, setCitas] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [obs, setObs] = useState('');
  const [openObs, setOpenObs] = useState(false);

  useEffect(() => { citasService.getCitas().then(r => setCitas(r.data)); }, []);

  const verDetalle = (cita) => setDetalle(cita);
  const abrirObservaciones = (cita) => { setDetalle(cita); setOpenObs(true); };
  const guardarObs = async () => {
    await citasService.registrarObservacion(detalle.id, obs);
    setOpenObs(false);
    setObs('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#1e40af' }}>Médico: {user?.nombre}</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Agenda del médico</Typography>
              <TextField label="Fecha" type="date" fullWidth sx={{ mb: 2 }} />
              <Button variant="contained" sx={{ mb: 2, backgroundColor: '#3b82f6' }}>Buscar</Button>
              <Table size="small">
                <TableHead><TableRow><TableCell>Hora</TableCell><TableCell>Paciente</TableCell><TableCell>Estado</TableCell><TableCell></TableCell></TableRow></TableHead>
                <TableBody>
                  {citas.map(c => (
                    <TableRow key={c.id}>
                      <TableCell>{c.hora}</TableCell>
                      <TableCell>{c.paciente_nombre}</TableCell>
                      <TableCell>{c.estado}</TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => verDetalle(c)}>Ver detalles</Button>
                        <Button size="small" color="secondary" onClick={() => abrirObservaciones(c)}>Registrar observaciones</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {detalle && (
          <Grid item xs={12} md={5}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Detalles de la cita</Typography>
                <Typography><strong>Paciente:</strong> {detalle.paciente_nombre}</Typography>
                <Typography><strong>Fecha:</strong> {detalle.fecha}</Typography>
                <Typography><strong>Hora:</strong> {detalle.hora}</Typography>
                <Typography><strong>Motivo:</strong> {detalle.motivo}</Typography>
                <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={() => setDetalle(null)}>Volver a Agenda</Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Dialog open={openObs} onClose={() => setOpenObs(false)}>
        <DialogTitle>Registrar observaciones</DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline rows={4} value={obs} onChange={e => setObs(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenObs(false)}>Cancelar</Button>
          <Button onClick={guardarObs} variant="contained" color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>

      <Button onClick={logout} sx={{ mt: 4, float: 'right' }}>Cerrar Sesión</Button>
    </Container>
  );
};