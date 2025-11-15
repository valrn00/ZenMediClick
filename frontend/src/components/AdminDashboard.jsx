import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost/backend/main.php/users', {
      headers: { 'Authorization': token }
    })
    .then(r => r.json())
    .then(setUsuarios);
  }, [token]);

  const eliminar = async (id) => {
    await fetch(`http://localhost/backend/main.php/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': token }
    });
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#1e40af' }}>Panel Admin</Typography>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Gestión de Usuarios</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell>{u.rol}</TableCell>
                  <TableCell>
                    <Button size="small" color="error" onClick={() => eliminar(u.id)}>Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}