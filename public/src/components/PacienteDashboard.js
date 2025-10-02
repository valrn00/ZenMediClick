import { Container, Typography } from '@mui/material';
import CitaForm from './CitaForm';
import CitaTable from './CitaTable';

function PacienteDashboard() {
  // Datos simulados
  const citas = [
    { id: 1, fecha: '2025-10-10', hora: '10:00', medico: 'Dr. Juan Pérez' },
  ];

  return (
    <Container>
      <Typography variant="h4">Dashboard del Paciente</Typography>
      <CitaForm />
      <CitaTable citas={citas} />
      <Typography variant="h6">Historia Clínica</Typography>
      <p>[Contenido simulado de historia clínica]</p>
    </Container>
  );
}

export default PacienteDashboard;