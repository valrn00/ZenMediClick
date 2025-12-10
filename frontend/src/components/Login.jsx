import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

// EN LOGIN.JSX
const API_REGISTER = "http://localhost:8000/auth/register";
export default function Login() {
  const [form, setForm] = useState({ cedula: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDACIÓN 1: Verificar que los campos no estén vacíos
    if (!form.cedula || !form.password) {
      setErrorMsg('Por favor, ingresa tu cédula/email y contraseña.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch(API_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok && data.success) { // Se verifica res.ok para un mejor control
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirecciona al dashboard (App.js se encargará de llevar al rol correcto)
        navigate('/dashboard');
      } else {
        // Muestra el error que viene del backend
        setErrorMsg(data.error || data.message || 'Credenciales incorrectas. Intenta de nuevo.');
      }
    } catch (error) {
      // Manejar fallas de red
      console.error("Error de conexión:", error);
      setErrorMsg('No se pudo conectar con el servidor. Por favor, revisa tu conexión a internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #a7f3d0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Centrar horizontalmente
        py: 4 // Padding vertical para evitar que el contenido se pegue en pantallas pequeñas
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            bgcolor: 'white',
            p: 4,
            borderRadius: 3,
            boxShadow: 6, // Un poco más de sombra para que destaque
            textAlign: 'center'
          }}
        >
          <img src={logo} alt="Logo ZenMediClick" style={{ width: '80px', marginBottom: '16px' }} />
          <Typography variant="h5" sx={{ mb: 3, color: '#1e40af', fontWeight: 'bold' }}>Bienvenido</Typography>

          <Box component="form" onSubmit={handleSubmit}>

            {/* Mostrar mensaje de error si existe */}
            {errorMsg && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMsg}
              </Alert>
            )}

            <TextField
              fullWidth
              required // Marcado como requerido
              label="Cédula o Email"
              name="cedula" // Añadir el atributo name para el handler
              value={form.cedula}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              required // Marcado como requerido
              label="Contraseña"
              name="password" // Añadir el atributo name para el handler
              type="password"
              value={form.password}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ borderRadius: '50px', py: 1.5, bgcolor: '#1e40af', '&:hover': { bgcolor: '#102a80' } }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            {/* USO DE NAVIGATE: Más idiomático con React Router */}
            <Link
              component="button"
              onClick={() => navigate('/registration')}
              underline="hover"
              color="#3b82f6"
              sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
            >
              Registrarse
            </Link>
            <Link
              component="button"
              onClick={() => navigate('/reset-password')}
              underline="hover"
              color="#3b82f6"
              sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}