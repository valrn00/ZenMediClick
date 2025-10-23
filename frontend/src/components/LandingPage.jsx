import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #a7f3d0 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1e40af', mb: 2 }}>
              Tu salud, nuestra prioridad
            </Typography>
            <Typography variant="body1" sx={{ color: '#1f2937', mb: 4 }}>
              Bienvenidos a Zenmediclick. Agendar tus citas médicas ahora es más rápido, fácil y personalizado. ¡Tu bienestar está a tu clic de distancia
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#3b82f6',
                  borderRadius: '50px',
                  px: 4,
                  '&:hover': { backgroundColor: '#2563eb' }
                }}
                onClick={() => navigate('/login')}
              >
                Iniciar sesión
              </Button>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#3b82f6',
                  borderRadius: '50px',
                  px: 4,
                  '&:hover': { backgroundColor: '#2563eb' }
                }}
                onClick={() => navigate('/register')}
              >
                Registrarse
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
            <img src={logo} alt="ZenMediClick" style={{ width: '200px' }} />
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 8, color: '#6b7280' }}>
          <Typography variant="body2">
            © 2025 Zenmediclick. Todos los derechos reservados
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};