import { useCitas } from '../hooks/useCitas';
import { useAuth } from '../hooks/useAuth';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button } from '@mui/material';
export const AdminDashboard = () => {
  const { citas, eliminar } = useCitas();
  const { logout } = useAuth();
  return (
    <Container maxWidth="lg" sx={{ mt: 4, p: 3, backgroundColor: '#f4f7fa', borderRadius: 2 }}>
      <Typography variant="h4" color="#007bff">Dashboard Admin</Typography>
      <Typography variant="h6" color="#007bff">Lista de Pacientes</Typography>
      <Table sx={{ mb: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>IPS</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {citas.map((cita) => (
            <TableRow key={cita.id}>
              <TableCell>{cita.paciente || 'Juan Doe'}</TableCell>
              <TableCell>{cita.email || 'juan@example.com'}</TableCell>
              <TableCell>IPS Ejemplo</TableCell>
              <TableCell>
                <Button sx={{ backgroundColor: '#007bff' }} onClick={() => alert('Editar')}>Editar</Button>
                <Button sx={{ backgroundColor: '#28a745' }} onClick={() => eliminar(cita.id)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h6" color="#007bff">Lista de Médicos</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Especialidad</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Dr. Pérez</TableCell>
            <TableCell>juanperez@example.com</TableCell>
            <TableCell>General</TableCell>
            <TableCell>
              <Button sx={{ backgroundColor: '#007bff' }} onClick={() => alert('Editar')}>Editar</Button>
              <Button sx={{ backgroundColor: '#28a745' }} onClick={() => alert('Eliminar')}>Eliminar</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button onClick={logout} sx={{ mt: 2, backgroundColor: '#007bff' }}>Logout</Button>
    </Container>
  );
};