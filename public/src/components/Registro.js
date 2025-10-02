import { useState } from 'react';
import { registro } from '../services/api';
import { TextField, Button, Container, Typography } from '@mui/material';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registro({ nombre, apellido, email, password });
      setSuccess('Registro completado. Asociado automáticamente a IPS.');
    } catch (err) {
      setSuccess('Error en el registro');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Registro de Paciente</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth margin="normal" />
        <TextField label="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} fullWidth margin="normal" />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
        <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary">Registrarse</Button>
      </form>
      {success && <Typography>{success}</Typography>}
    </Container>
  );
}

export default Registro;
