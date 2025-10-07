import { useCitas } from '../hooks/useCitas';
import { useAuth } from '../hooks/useAuth';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button } from '@mui/material';
export const DoctorDashboard = () => {
  const { citas } = useCitas();
  const { logout } = useAuth();
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
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {citas.map((cita) => (
            <TableRow key={cita.id}>
              <TableCell>{cita.paciente || 'Ejemplo'}</TableCell>
              <TableCell>{cita.fecha}</TableCell>
              <TableCell>{cita.hora}</TableCell>
              <TableCell>
                <Button sx={{ backgroundColor: '#007bff' }} onClick={() => alert('Ver historia')}>Ver Historia</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={logout} sx={{ mt: 2, backgroundColor: '#007bff' }}>Logout</Button>
    </Container>
  );
};