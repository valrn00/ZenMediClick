import { useState } from 'react';
import { Container, TextField, Select, MenuItem, Button, Typography, Box, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Registration() {
  const [form, setForm] = useState({ 
    nombre: '', 
    cedula: '', 
    email: '', 
    password: '', 
    rol: 'Paciente', 
    autorizacion: false 
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.autorizacion) {
      alert('Debes autorizar el tratamiento de datos');
      return;
    }

    const res = await fetch("https://zenmediclick.onrender.com/auth/register", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();

    if (data.success) {
      alert('Registro exitoso. Inicia sesión.');
      navigate('/login');
    } else {
      // EVITAR "undefined"
      alert(data.error || 'Error al registrarse. Intenta de nuevo.');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e0f2fe 0%, #a7f3d0 100%)', 
      display: 'flex', 
      alignItems: 'center' 
    }}>
      <Container maxWidth="xs">
        <Box sx={{ 
          bgcolor: 'white', 
          p: 4, 
          borderRadius: 3, 
          boxShadow: 3, 
          textAlign: 'center' 
        }}>
          <img src={logo} alt="Logo" style={{ width: '80px', marginBottom: '16px' }} />
          <Typography variant="h5" sx={{ mb: 3, color: '#1e40af' }}>Registro</Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField 
              fullWidth 
              label="Nombre" 
              value={form.nombre} 
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Cédula" 
              value={form.cedula} 
              onChange={(e) => setForm({ ...form, cedula: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Email" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Contraseña" 
              type="password" 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <Select 
              fullWidth 
              value={form.rol} 
              onChange={(e) => setForm({ ...form, rol: e.target.value })} 
              sx={{ mb: 2 }}
            >
              <MenuItem value="Paciente">Paciente</MenuItem>
              <MenuItem value="Medico">Médico</MenuItem>
              <MenuItem value="Administrador">Administrador</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Checkbox 
                checked={form.autorizacion} 
                onChange={(e) => setForm({ ...form, autorizacion: e.target.checked })} 
              />
              <Typography variant="body2">Autorizo el tratamiento de datos</Typography>
            </Box>
            <Button 
              fullWidth 
              variant="contained" 
              type="submit" 
              sx={{ borderRadius: '50px', py: 1.5 }}
            >
              REGISTRARME
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}