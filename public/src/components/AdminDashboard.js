import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

function AdminDashboard() {
  // Datos simulados
  const pacientes = [
    { id: 1, nombre: 'Juan Doe', email: 'juan@example.com', ips: 'IPS Ejemplo' },
  ];
  const medicos = [
    { id: 1, nombre: 'Dr. Juan Pérez', email: 'juanperez@example.com', especialidad: 'General' },
  ];

  return (
    <Container>
      <Typography variant="h4">Panel de Administración</Typography>
      <Typography variant="h6">Lista de Pacientes</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>IPS</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pacientes.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.nombre}</TableCell>
              <TableCell>{p.email}</TableCell>
              <TableCell>{p.ips}</TableCell>
              <TableCell>
                <Button>Editar</Button>
                <Button>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h6">Lista de Médicos</Typography>
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
          {medicos.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.nombre}</TableCell>
              <TableCell>{m.email}</TableCell>
              <TableCell>{m.especialidad}</TableCell>
              <TableCell>
                <Button>Editar</Button>
                <Button>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default AdminDashboard;