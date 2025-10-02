import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { TextField, Button, Container, Typography } from '@mui/material';

function Login({ setUserRole, setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      const { role } = response; // Simula respuesta del backend
      setUserRole(role);
      setIsAuthenticated(true);
      if (role === 'paciente') navigate('/paciente');
      else if (role === 'medico') navigate('/medico');
      else if (role === 'admin') navigate('/admin');
    } catch (err) {
      setError('Error en el login');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Iniciar Sesión</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
        <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary">Login</Button>
      </form>
      {error && <Typography color="error">{error}</Typography>}
    </Container>
  );
}

export default Login;