import { useState, useEffect } from 'react';
import { 
    Container, 
    Grid, 
    Card, 
    CardContent, 
    Typography, 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField,
    // Nuevos imports para selección de doctor
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress 
} from '@mui/material';
import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';


const API = "https://zenmediclick.onrender.com";

export default function PatientDashboard() {
    const [citas, setCitas] = useState([]);
    const [doctores, setDoctores] = useState([]); // Nuevo estado para la lista de doctores
    const [disponibilidadDoctor, setDisponibilidadDoctor] = useState([]); // Nuevo estado para disponibilidad
    
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [nueva, setNueva] = useState({ 
        fecha: '', 
        hora: '', 
        motivo: '', 
        id_medico: '' // Nuevo: ID del médico seleccionado
    });

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const pacienteId = user?.id;
    
    // ------------------------------------
    // 1. CARGA INICIAL DE CITAS Y DOCTORES
    // ------------------------------------
    useEffect(() => {
        if (pacienteId && token) {
            cargarCitas();
            cargarDoctores();
        }
    }, [pacienteId, token]);

    const cargarCitas = async () => {
        try {
            const r = await fetch(`${API}/citas/mias/${pacienteId}`, {
                headers: { Authorization: token }
            });
            setCitas(await r.json());
        } catch (error) {
            console.error("Error cargando citas:", error);
        }
    };
    
    const cargarDoctores = async () => {
        try {
            // Asumiendo un endpoint para obtener la lista de doctores (rol=doctor)
            const r = await fetch(`${API}/usuarios/doctores`, {
                headers: { Authorization: token }
            });
            setDoctores(await r.json());
        } catch (error) {
            console.error("Error cargando doctores:", error);
        }
    };

    // ------------------------------------
    // 2. LÓGICA DE DISPONIBILIDAD
    // ------------------------------------
    const cargarDisponibilidad = async (doctorId) => {
        if (!doctorId) {
            setDisponibilidadDoctor([]);
            return;
        }
        try {
            // Asumiendo un endpoint para obtener la disponibilidad por doctor
            const r = await fetch(`${API}/disponibilidad/medico/${doctorId}`, {
                headers: { Authorization: token }
            });
            setDisponibilidadDoctor(await r.json());
        } catch (error) {
            console.error("Error cargando disponibilidad:", error);
            setDisponibilidadDoctor([]);
        }
    };
    
    const handleDoctorChange = (e) => {
        const id_medico = e.target.value;
        setNueva({ ...nueva, id_medico: id_medico, fecha: '', hora: '' }); // Resetear fecha/hora
        cargarDisponibilidad(id_medico);
    };

    // ------------------------------------
    // 3. ACCIÓN DE AGENDAR
    // ------------------------------------
    const agendar = async () => {
        if (!nueva.id_medico || !nueva.fecha || !nueva.hora || !nueva.motivo) {
            alert("Por favor, selecciona un doctor, fecha, hora y motivo.");
            return;
        }
        
        setIsLoading(true);

        try {
            const res = await fetch(`${API}/citas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                body: JSON.stringify({
                    ...nueva,
                    id_paciente: pacienteId,
                })
            });
            
            if (res.ok) {
                alert("Cita agendada exitosamente.");
                setOpen(false);
                cargarCitas(); // Recargar citas en lugar de recargar la página completa
                setNueva({ fecha: '', hora: '', motivo: '', id_medico: '' }); // Resetear formulario
            } else {
                const errorData = await res.json();
                alert(`Error al agendar: ${errorData.message || res.statusText}`);
            }

        } catch (error) {
            console.error("Error al agendar cita:", error);
            alert("Error de conexión al agendar cita.");
        } finally {
            setIsLoading(false);
        }
    };

    // ------------------------------------
    // 4. ACCIÓN DE CANCELAR
    // ------------------------------------
    const cancelar = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres cancelar esta cita?")) return;

        try {
            const res = await fetch(`${API}/citas/cancelar/${id}`, {
                method: "POST",
                headers: { Authorization: token }
            });

            if (res.ok) {
                alert("Cita cancelada correctamente.");
                setCitas(citas.filter((c) => c.id !== id));
            } else {
                alert("No se pudo cancelar la cita. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error al cancelar:", error);
            alert("Error de conexión al cancelar la cita.");
        }
    };

    // ------------------------------------
    // 5. GENERAR PDF (sin cambios significativos)
    // ------------------------------------
    const generarPDF = (cita) => {
        const doc = new jsPDF();
        doc.text("Constancia de Cita ZenMediClick", 20, 20);
        doc.text("-----------------------------------", 20, 25);
        doc.text(`Paciente: ${user.nombre}`, 20, 35);
        // Nota: Si el backend incluye el nombre del doctor, se debe añadir aquí.
        doc.text(`Fecha: ${cita.fecha}`, 20, 45);
        doc.text(`Hora: ${cita.hora}`, 20, 55);
        doc.text(`Motivo: ${cita.motivo}`, 20, 65);
        doc.save(`constancia_cita_${cita.id}.pdf`);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#1e40af' }}>👋 Hola, {user?.nombre || 'Paciente'}</Typography>
            
            <Grid container spacing={3}>
                {/* Botón de Nueva Cita */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Button fullWidth variant="contained" size="large" onClick={() => setOpen(true)} sx={{ py: 2 }}>
                                ➕ Agendar Nueva Cita
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                
                {/* Cuadro de Resumen (Opcional, se puede expandir) */}
                <Grid item xs={12} md={8}>
                     <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Resumen</Typography>
                            <Typography variant="body1">Tienes **{citas.length}** citas registradas en tu historial.</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tabla de Citas */}
                <Grid item xs={12}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" sx={{ mb: 2 }}>Citas Agendadas</Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Fecha</TableCell>
                                        <TableCell>Hora</TableCell>
                                        <TableCell>Doctor</TableCell> 
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {citas.length > 0 ? (
                                        citas.map((c) => (
                                            <TableRow key={c.id}>
                                                <TableCell>{c.fecha}</TableCell>
                                                <TableCell>{c.hora}</TableCell>
                                                {/* Asumiendo que el backend ahora provee c.doctor_nombre */}
                                                <TableCell>{c.doctor_nombre || "Doctor ID: " + c.doctor_id}</TableCell> 
                                                <TableCell>{c.estado}</TableCell>
                                                <TableCell>
                                                    {c.estado === 'pendiente' ? (
                                                        <Button 
                                                            size="small" 
                                                            color="error" 
                                                            onClick={() => cancelar(c.id)} 
                                                            startIcon={<CloseIcon />}
                                                            sx={{ mr: 1 }}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    ) : (
                                                        <Button size="small" disabled>
                                                            {c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}
                                                        </Button>
                                                    )}
                                                    
                                                    <Button size="small" onClick={() => generarPDF(c)} startIcon={<DownloadIcon />}>
                                                        PDF
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow><TableCell colSpan={5} align="center">No tienes citas agendadas.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ---------- DIALOGO DE AGENDAR CITA (MODIFICADO) ---------- */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Agendar Nueva Cita</DialogTitle>
                <DialogContent>
                    
                    {/* 1. SELECCIÓN DE DOCTOR */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="select-doctor-label">Médico Especialista</InputLabel>
                        <Select
                            labelId="select-doctor-label"
                            label="Médico Especialista"
                            value={nueva.id_medico}
                            onChange={handleDoctorChange}
                        >
                            <MenuItem value="">
                                <em>Selecciona un Doctor</em>
                            </MenuItem>
                            {doctores.map((doc) => (
                                <MenuItem key={doc.id} value={doc.id}>
                                    {doc.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* 2. SELECCIÓN DE FECHA */}
                    <FormControl fullWidth sx={{ mb: 2 }} disabled={!nueva.id_medico}>
                        <InputLabel id="select-fecha-label">Fecha de Cita</InputLabel>
                        <Select
                            labelId="select-fecha-label"
                            label="Fecha de Cita"
                            value={nueva.fecha}
                            onChange={(e) => setNueva({ ...nueva, fecha: e.target.value, hora: '' })} // Resetear hora al cambiar fecha
                        >
                            <MenuItem value="">
                                <em>Selecciona una Fecha</em>
                            </MenuItem>
                            {disponibilidadDoctor.map((d) => (
                                <MenuItem key={d.fecha} value={d.fecha}>
                                    {d.fecha} ({d.hora_inicio} - {d.hora_fin})
                                </MenuItem>
                            ))}
                        </Select>
                        {nueva.id_medico && disponibilidadDoctor.length === 0 && (
                            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                Este doctor no tiene disponibilidad registrada.
                            </Typography>
                        )}
                    </FormControl>
                    
                    {/* 3. SELECCIÓN DE HORA (Simulación de franja horaria) */}
                    {/* Nota: En un sistema real, necesitarías dividir la franja d.hora_inicio/fin en slots (ej: cada 30 min) */}
                     <TextField 
                        fullWidth 
                        type="time" 
                        label="Hora (Manual)"
                        helperText="Selecciona una hora dentro de la franja disponible."
                        InputLabelProps={{ shrink: true }}
                        value={nueva.hora}
                        onChange={(e) => setNueva({ ...nueva, hora: e.target.value })}
                        sx={{ mb: 2 }}
                        disabled={!nueva.fecha}
                    />

                    {/* 4. MOTIVO */}
                    <TextField 
                        fullWidth 
                        label="Motivo de la Cita"
                        value={nueva.motivo}
                        onChange={(e) => setNueva({ ...nueva, motivo: e.target.value })}
                        disabled={!nueva.fecha}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={isLoading}>Cancelar</Button>
                    <Button 
                        variant="contained" 
                        onClick={agendar} 
                        disabled={isLoading || !nueva.id_medico || !nueva.fecha || !nueva.hora || !nueva.motivo}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Agendar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}