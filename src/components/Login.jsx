import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container, TextField, Select, MenuItem, Button, Typography, Box } from '@mui/material';
export const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '', rol: 'paciente' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials);
    navigate('/dashboard');
  };
  return (
    <Container maxWidth="sm" sx={{ mt: 4, backgroundColor: '#f4f7fa', p: 3, borderRadius: 2 }}>
      <Typography variant="h4" color="#007bff">Login</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField fullWidth label="Email" value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} sx={{ mb: 2 }} />
        <TextField fullWidth label="Contraseña" type="password" value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} sx={{ mb: 2 }} />
        <Select fullWidth value={credentials.rol} onChange={(e) => setCredentials({...credentials, rol: e.target.value})} sx={{ mb: 2 }}>
          <MenuItem value="paciente">Paciente</MenuItem>
          <MenuItem value="medico">Médico</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
        <Button fullWidth variant="contained" sx={{ backgroundColor: '#007bff' }} type="submit">Iniciar</Button>
      </Box>
      <Button onClick={() => navigate('/register')}>Registrarse</Button>
    </Container>
  );
};