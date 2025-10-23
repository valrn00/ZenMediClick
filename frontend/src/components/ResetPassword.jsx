import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { usuarioService } from '../services/usuarioService';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await usuarioService.resetPassword(email);
    setSent(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f2fe 0%, #a7f3d0 100%)', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 3, boxShadow: 3, textAlign: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '80px', marginBottom: '16px' }} />
          <Typography variant="h5" sx={{ mb: 3, color: '#1e40af' }}>
            ¿Olvidaste tu contraseña?
          </Typography>
          {sent ? (
            <Typography color="success.main">Revisa tu correo. Te enviamos un enlace para restablecerla.</Typography>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>Ingresa tu cédula o correo registrado</Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField fullWidth label="Cédula o Email" value={email} onChange={e => setEmail(e.target.value)} sx={{ mb: 2 }} />
                <Button fullWidth variant="contained" type="submit" sx={{ backgroundColor: '#3b82f6', borderRadius: '50px' }}>
                  Enviar enlace
                </Button>
              </Box>
            </>
          )}
          <Button onClick={() => navigate('/login')} sx={{ mt: 2 }}>← Volver al login</Button>
        </Box>
      </Container>
    </Box>
  );
};