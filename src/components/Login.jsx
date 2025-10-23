import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/logo.png';

export const Login = () => {
  const [form, setForm] = useState({ cedula: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login({ email: form.cedula, password: form.password });
    if (res.data.user) {
      navigate('/dashboard');
    } else {
      alert('Cédula o contraseña incorrecta');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #a7f3d0 100%)',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            bgcolor: 'white',
            p: 4,
            borderRadius: 3,
            boxShadow: 3,
            textAlign: 'center'
          }}
        >
          <img src={logo} alt="Logo" style={{ width: '80px', marginBottom: '16px' }} />
          <Typography variant="h5" sx={{ mb: 3, color: '#1e40af' }}>
            Inicio de sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Cédula"
              value={form.cedula}
              onChange={(e) => setForm({ ...form, cedula: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: '#3b82f6',
                borderRadius: '50px',
                py: 1.5,
                '&:hover': { backgroundColor: '#2563eb' }
              }}
            >
              Iniciar sesión
            </Button>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Link href="/register" underline="hover" color="#3b82f6">
              ← Registrarse
            </Link>
            <Link href="/reset-password" underline="hover" color="#3b82f6">
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};