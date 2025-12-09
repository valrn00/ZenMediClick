import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';

export default function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const sendToken = async () => {
    await axios.post(`${process.env.REACT_APP_API_URL}/reset-password`, { email });
    setStep(2);
  };

  const confirm = async () => {
    await axios.post(`${process.env.REACT_APP_API_URL}/reset-password/confirm`, { token, new_password: password });
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f2fe 0%, #a7f3d0 100%)', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 3, boxShadow: 3, textAlign: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '80px', marginBottom: '16px' }} />
          <Typography variant="h5" sx={{ mb: 3, color: '#1e40af' }}>Recuperar Contraseña</Typography>
          {step === 1 ? (
            <>
              <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 3 }} />
              <Button fullWidth variant="contained" onClick={sendToken} sx={{ borderRadius: '50px' }}>Enviar Token</Button>
            </>
          ) : (
            <>
              <TextField fullWidth label="Token" value={token} onChange={(e) => setToken(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth label="Nueva Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 3 }} />
              <Button fullWidth variant="contained" onClick={confirm} sx={{ borderRadius: '50px' }}>Confirmar</Button>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}