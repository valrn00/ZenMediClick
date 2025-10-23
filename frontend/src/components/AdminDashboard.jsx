import { useEffect, useState } from 'react';
import { usuarioService } from '../services/usuarioService';
import { Container, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Select, MenuItem } from '@mui/material';

export const AdminDashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [reporte, setReporte] = useState({ tipo: 'semana', formato: 'pdf' });

  useEffect(() => { usuarioService.getUsuarios().then(r => setUsuarios(r.data)); }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#1e40af' }}>Panel Administrador</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Gestionar Usuarios</Typography>
              <Button fullWidth variant="contained" sx={{ mb: 2, backgroundColor: '#10b981' }}>+ Agregar Usuario</Button>
              <Table size="small">
                <TableHead><TableRow><TableCell>Nombre</TableCell><TableCell>Rol</TableCell><TableCell>Estado</TableCell></TableRow></TableHead>
                <TableBody>
                  {usuarios.map(u => (
                    <TableRow key={u.id}>
                      <TableCell>{u.nombre}</TableCell>
                      <TableCell>{u.rol}</TableCell>
                      <TableCell>{u.activo ? 'Activo' : 'Inactivo'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TextField fullWidth label="Buscar usuario" sx={{ mt: 2 }} />
              <Button fullWidth variant="outlined" sx={{ mt: 1 }}>Buscar</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Reportes del sistema</Typography>
              <Select fullWidth value={reporte.tipo} onChange={e => setReporte({ ...reporte, tipo: e.target.value })} sx={{ mb: 2 }}>
                <MenuItem value="semana">Citas médicas por semana</MenuItem>
                <MenuItem value="usuarios">Usuarios registrados</MenuItem>
              </Select>
              <Select fullWidth value={reporte.formato} onChange={e => setReporte({ ...reporte, formato: e.target.value })} sx={{ mb: 2 }}>
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
              </Select>
              <Button fullWidth variant="contained" sx={{ backgroundColor: '#f59e0b' }}>Generar</Button>
              <Button fullWidth variant="text" sx={{ mt: 1 }}>Volver al panel</Button>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Configurar Disponibilidad</Typography>
              <TextField fullWidth label="Médico" sx={{ mb: 2 }} />
              <Table size="small">
                <TableHead><TableRow><TableCell>Día</TableCell><TableCell>Horario disponible</TableCell></TableRow></TableHead>
                <TableBody>
                  <TableRow><TableCell>Lunes</TableCell><TableCell>08:00 AM - 12:00 PM</TableCell></TableRow>
                </TableBody>
              </Table>
              <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: '#10b981' }}>+ Agregar Disponibilidad</Button>
              <Button fullWidth variant="outlined" sx={{ mt: 1 }}>Guardar Cambios</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};