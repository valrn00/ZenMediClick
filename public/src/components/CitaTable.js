import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

function CitaTable({ citas, isMedico = false }) {
  return (
    <div>
      <h3>{isMedico ? 'Citas del Día' : 'Citas Programadas'}</h3>
      <Table>
        <TableHead>
          <TableRow>
            {isMedico ? <TableCell>Paciente</TableCell> : null}
            <TableCell>Fecha</TableCell>
            <TableCell>Hora</TableCell>
            {!isMedico ? <TableCell>Médico</TableCell> : null}
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {citas.map((cita) => (
            <TableRow key={cita.id}>
              {isMedico ? <TableCell>{cita.paciente}</TableCell> : null}
              <TableCell>{cita.fecha}</TableCell>
              <TableCell>{cita.hora}</TableCell>
              {!isMedico ? <TableCell>{cita.medico}</TableCell> : null}
              <TableCell>
                {!isMedico && <Button>Reagendar</Button>}
                {!isMedico && <Button>Cancelar</Button>}
                {isMedico && <Button>Ver Historia</Button>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default CitaTable;