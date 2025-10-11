import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Send email, 2: Confirm

  const handleSendEmail = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:8000/api/reset-password', { email });
    if (res.data.success) {
      alert('Email enviado con token');
      setStep(2);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:8000/api/reset-password/confirm', { token, new_password: newPassword });
    if (res.data.success) {
      alert('Contraseña reestablecida');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, backgroundColor: '#f4f7fa', p: 3, borderRadius: 2 }}>
      <Typography variant="h4" color="#007bff">Reestablecer Contraseña</Typography>
      {step === 1 ? (
        <Box component="form" onSubmit={handleSendEmail}>
          <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
          <Button fullWidth variant="contained" sx={{ backgroundColor: '#007bff' }} type="submit">Enviar Token</Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleConfirm}>
          <TextField fullWidth label="Token" value={token} onChange={(e) => setToken(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Nueva Contraseña" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} sx={{ mb: 2 }} />
          <Button fullWidth variant="contained" sx={{ backgroundColor: '#007bff' }} type="submit">Confirmar</Button>
        </Box>
      )}
    </Container>
  );
};