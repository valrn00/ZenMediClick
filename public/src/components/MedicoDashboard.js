import { Container, Typography } from '@mui/material';
import CitaTable from './CitaTable';

function MedicoDashboard() {
  // Datos simulados
  const citas = [
    { id: 1, paciente: 'Paciente Ejemplo', fecha: '2025-10-10', hora: '10:00' },
  ];

  return (
    <Container>
      <Typography variant="h4">Dashboard del Médico</Typography>
      <CitaTable citas={citas} isMedico={true} />
    </Container>
  );
}

export default MedicoDashboard;