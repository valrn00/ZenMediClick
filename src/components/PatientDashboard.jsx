import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCitas } from '../hooks/useCitas';
import { Container, Grid, Card, CardContent, Typography, Button, Select, MenuItem, TextField, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const { citas, agendarCita, cancelarCita, cargarCitas } = useCitas();
  const [nuevaCita, setNuevaCita] = useState({ especialidad: '', medico: '', fecha: '', motivo: '' });
  const [openCancel, setOpenCancel] = useState(false);
  const [citaToCancel, setCitaToCancel] = useState(null);

  useEffect(() => {
    cargarCitas();
  }, []);

  const handleAgendar = async () => {
    await agendarCita(nuevaCita);
    setNuevaCita({ especialidad: '', medico: '', fecha: '', motivo: '' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#1e40af' }}>Paciente: {user?.nombre}</Typography>

      <Grid container spacing={3}>
        {/* Agendar Cita */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Agendar cita médica</Typography>
              <Select fullWidth value={nuevaCita.especialidad} onChange={(e) => setNuevaCita({ ...nuevaCita, especialidad: e.target.value })} sx={{ mb: 2 }}>
                <MenuItem value="General">Medicina General</MenuItem>
                <MenuItem value="Pediatría">Pediatría</MenuItem>
              </Select>
              <Select fullWidth value={nuevaCita.medico} onChange={(e) => setNuevaCita({ ...nuevaCita, medico: e.target.value })} sx={{ mb: 2 }}>
                <MenuItem value="Dr. Gómez">Dr. Gómez</MenuItem>
              </Select>
              <TextField fullWidth label="Fecha disponible" type="date" value={nuevaCita.fecha} onChange={(e) => setNuevaCita({ ...nuevaCita, fecha: e.target.value })} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
              <TextField fullWidth label="Motivo de consulta" multiline rows={2} value={nuevaCita.motivo} onChange={(e) => setNuevaCita({ ...nuevaCita, motivo: e.target.value })} sx={{ mb: 2 }} />
              <Button fullWidth variant="contained" sx={{ backgroundColor: '#3b82f6', borderRadius: '50px' }} onClick={handleAgendar}>
                Confirmar cita
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Cancelar Cita */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Cancelar cita médica</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {citas.slice(0, 3).map((cita) => (
                    <TableRow key={cita.id}>
                      <TableCell>{cita.fecha}</TableCell>
                      <TableCell>{cita.hora}</TableCell>
                      <TableCell>{cita.estado}</TableCell>
                      <TableCell>
                        <Button size="small" color="error" onClick={() => { setCitaToCancel(cita); setOpenCancel(true); }}>
                          Cancelar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Historial */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Historial de citas</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Médico</TableCell>
                    <TableCell>Diagnóstico</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow><TableCell>20/04/25</TableCell><TableCell>Dr. Gómez</TableCell><TableCell>Gripe común</TableCell></TableRow>
                </TableBody>
              </Table>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>Ver detalles</Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recordatorios */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Configurar recordatorios</Typography>
              <Select fullWidth defaultValue="email" sx={{ mb: 2 }}>
                <MenuItem value="email">Correo electrónico</MenuItem>
                <MenuItem value="sms">Mensaje de texto</MenuItem>
              </Select>
              <Select fullWidth defaultValue="1dia" sx={{ mb: 2 }}>
                <MenuItem value="1dia">1 Día antes</MenuItem>
                <MenuItem value="2horas">2 Horas antes</MenuItem>
              </Select>
              <Button fullWidth variant="contained" sx={{ backgroundColor: '#10b981' }}>
                Guardar preferencia
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button onClick={logout} sx={{ mt: 4, float: 'right' }}>Cerrar Sesión</Button>

      <Dialog open={openCancel} onClose={() => setOpenCancel(false)}>
        <DialogTitle>¿Cancelar cita?</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro que deseas cancelar esta cita?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancel(false)}>No, volver</Button>
          <Button onClick={async () => { await cancelarCita(citaToCancel.id); setOpenCancel(false); }} color="error">
            Sí, cancelar Cita
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};