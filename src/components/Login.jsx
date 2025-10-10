import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(credentials);
    if (res.data.user) {
      navigate('/dashboard'); // Redirige a dashboard; rol viene de DB en backend
    } else {
      alert('Credenciales inválidas');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, backgroundColor: '#f4f7fa', p: 3, borderRadius: 2 }}>
      <Typography variant="h4" color="#007bff">Login</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField fullWidth label="Email" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} sx={{ mb: 2 }} />
        <TextField fullWidth label="Contraseña" type="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} sx={{ mb: 2 }} />
        <Button fullWidth variant="contained" sx={{ backgroundColor: '#007bff' }} type="submit">Iniciar Sesión</Button>
      </Box>
    </Container>
  );
};