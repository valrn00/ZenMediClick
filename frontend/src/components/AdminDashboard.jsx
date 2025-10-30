import { Container, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/users`).then(res => setUsuarios(res.data));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#1e40af' }}>Admin: {user?.nombre}</Typography>

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
                    <Button size="small" color="error">Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Button onClick={logout} sx={{ mt: 4, float: 'right' }}>Cerrar Sesión</Button>
    </Container>
  );
}