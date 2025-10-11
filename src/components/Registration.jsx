import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Container, 
  TextField, 
  Select, 
  MenuItem, 
  Button, 
  Typography, 
  Box, 
  Checkbox 
} from '@mui/material';

export const Registration = () => {
  const [data, setData] = useState({ 
    nombre: '', 
    apellido: '', 
    email: '', 
    password: '', 
    rol: 'Paciente' 
  });
  const [autorizacion, setAutorizacion] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*()_+-=]/.test(password)) {
      alert('Contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo (!@#$%^&*()_+-=)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.nombre || !data.apellido || !data.email || !data.password) {
      alert('Todos los campos son obligatorios');
      return;
    }
    if (!validatePassword(data.password)) {
      return;
    }
    if (!autorizacion) {
      alert('Debes autorizar el uso y tratamiento de datos');
      return;
    }
    const res = await register({ 
      nombre: data.nombre, 
      apellido: data.apellido, 
      email: data.email, 
      password: data.password, 
      rol: data.rol, 
      autorizacion_datos: autorizacion 
    });
    if (res.data && res.data.success) {
      alert('Registrado con éxito. Redirigiendo a login...');
      navigate('/login');
    } else {
      alert('Error al registrar: ' + (res.data?.detail || 'Intenta de nuevo'));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, backgroundColor: '#f4f7fa', p: 3, borderRadius: 2 }}>
      <Typography variant="h4" color="#007bff">Registro</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField 
          fullWidth 
          label="Nombre" 
          value={data.nombre} 
          onChange={(e) => setData({ ...data, nombre: e.target.value })} 
          sx={{ mb: 2 }} 
        />
        <TextField 
          fullWidth 
          label="Apellido" 
          value={data.apellido} 
          onChange={(e) => setData({ ...data, apellido: e.target.value })} 
          sx={{ mb: 2 }} 
        />
        <TextField 
          fullWidth 
          label="Email" 
          value={data.email} 
          onChange={(e) => setData({ ...data, email: e.target.value })} 
          sx={{ mb: 2 }} 
        />
        <TextField 
          fullWidth 
          label="Contraseña" 
          type="password" 
          value={data.password} 
          onChange={(e) => setData({ ...data, password: e.target.value })} 
          sx={{ mb: 2 }} 
        />
        <Select 
          fullWidth 
          value={data.rol} 
          onChange={(e) => setData({ ...data, rol: e.target.value })} 
          sx={{ mb: 2 }}
        >
          <MenuItem value="Paciente">Paciente</MenuItem>
          <MenuItem value="Medico">Médico</MenuItem>
          <MenuItem value="Administrador">Administrador</MenuItem>
        </Select>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Checkbox 
            checked={autorizacion} 
            onChange={(e) => setAutorizacion(e.target.checked)} 
            color="primary"
          />
          <Typography variant="body2">
            Autorizo el uso y tratamiento de datos <a href="/politica-privacidad" target="_blank" rel="noopener noreferrer">Ver política</a>
          </Typography>
        </Box>
        <Button 
          fullWidth 
          variant="contained" 
          sx={{ 
            backgroundColor: '#007bff', 
            '&:hover': { backgroundColor: '#0056b3' } 
          }} 
          type="submit"
        >
          Registrarse
        </Button>
      </Box>
      <Button 
        onClick={() => navigate('/login')} 
        sx={{ mt: 1 }}
      >
        Iniciar Sesión
      </Button>
    </Container>
  );
};