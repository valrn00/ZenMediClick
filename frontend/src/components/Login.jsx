import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Login() {
  const [form, setForm] = useState({ cedula: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost/backend/main.php/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard'); // Redirecciona a App.jsx que decide el dashboard
    } else {
      alert(data.error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f2fe 0%, #a7f3d0 100%)', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 3, boxShadow: 3, textAlign: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '80px', marginBottom: '16px' }} />
          <Typography variant="h5" sx={{ mb: 3, color: '#1e40af' }}>Iniciar Sesión</Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Cédula o Email" value={form.cedula} onChange={(e) => setForm({ ...form, cedula: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Contraseña" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} sx={{ mb: 3 }} />
            <Button fullWidth variant="contained" type="submit" sx={{ borderRadius: '50px', py: 1.5 }}>Entrar</Button>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Link href="/register" underline="hover" color="#3b82f6">Registrarse</Link>
            <Link href="/reset-password" underline="hover" color="#3b82f6">¿Olvidaste tu contraseña?</Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}