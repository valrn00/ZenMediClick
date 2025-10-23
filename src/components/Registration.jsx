import { Container, TextField, Select, MenuItem, Button, Typography, Box, Checkbox } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/logo.png';

export const Registration = () => {
  const [form, setForm] = useState({
    nombre: '', cedula: '', password: '', rol: 'Paciente', autorizacion: false
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[!@#$%^&*()_+\-=]/.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(form.password)) {
      alert('Contraseña debe tener 8+ caracteres, 1 mayúscula, 1 número, 1 símbolo');
      return;
    }
    if (!form.autorizacion) {
      alert('Debes autorizar el tratamiento de datos');
      return;
    }

    const res = await register({
      nombre: form.nombre,
      apellido: '',
      email: form.cedula,
      password: form.password,
      rol: form.rol,
      autorizacion_datos: true
    });

    if (res.data.success) {
      navigate('/login');
    } else {
      alert(res.data.detail || 'Error al registrarse');
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
            Registro de usuario
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Cédula" value={form.cedula} onChange={(e) => setForm({ ...form, cedula: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Contraseña" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} sx={{ mb: 2 }} />
            <Select fullWidth value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })} sx={{ mb: 2 }}>
              <MenuItem value="Paciente">Paciente</MenuItem>
              <MenuItem value="Medico">Médico</MenuItem>
              <MenuItem value="Administrador">Administrador</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Checkbox checked={form.autorizacion} onChange={(e) => setForm({ ...form, autorizacion: e.target.checked })} />
              <Typography variant="body2">
                Autorizo el uso y tratamiento de datos <a href="/politica" target="_blank">Ver política</a>
              </Typography>
            </Box>
            <Button fullWidth variant="contained" type="submit" sx={{
              backgroundColor: '#3b82f6', borderRadius: '50px', py: 1.5,
              '&:hover': { backgroundColor: '#2563eb' }
            }}>
              Registrarme
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};