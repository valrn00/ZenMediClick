import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
export const Registration = () => {
  const [data, setData] = useState({ nombre: '', apellido: '', email: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(data);
    alert('Registrado. IPS asociada automáticamente.');
    navigate('/login');
  };
  return (
    <Container maxWidth="sm" sx={{ mt: 4, backgroundColor: '#f4f7fa', p: 3, borderRadius: 2 }}>
      <Typography variant="h4" color="#007bff">Registro</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField fullWidth label="Nombre" value={data.nombre} onChange={(e) => setData({...data, nombre: e.target.value})} sx={{ mb: 2 }} />
        <TextField fullWidth label="Apellido" value={data.apellido} onChange={(e) => setData({...data, apellido: e.target.value})} sx={{ mb: 2 }} />
        <TextField fullWidth label="Email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})} sx={{ mb: 2 }} />
        <TextField fullWidth label="Contraseña" type="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} sx={{ mb: 2 }} />
        <Button fullWidth variant="contained" sx={{ backgroundColor: '#007bff' }} type="submit">Registrarse</Button>
      </Box>
      <Button onClick={() => navigate('/login')}>Iniciar Sesión</Button>
    </Container>
  );
};