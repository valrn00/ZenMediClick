import { useState, useEffect, useMemo } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Divider,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// --- CONFIGURACIÓN DE SIMULACIÓN ---
const SIMULATE_DOCTOR_DASHBOARD = true;
const ALL_USERS = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

export default function DoctorDashboard() {
    const [citasPendientes, setCitasPendientes] = useState([]);
    const [historialPaciente, setHistorialPaciente] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);
    
    // Estados para la gestión de disponibilidad (RF04)
    const [openDispoDialog, setOpenDispoDialog] = useState(false);
    const [newAvailability, setNewAvailability] = useState({ fecha: '', hora_inicio: '', hora_fin: '' });
    const [currentAvailability, setCurrentAvailability] = useState([]);

    // Estados para la atención y diagnóstico (RF09, RF10)
    const [openAttentionDialog, setOpenAttentionDialog] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');


    const currentUserJson = localStorage.getItem("currentUser");
    const user = currentUserJson ? JSON.parse(currentUserJson) : {};
    const doctorId = user?.id;
    const doctorName = user?.nombre || 'Médico';
    const doctorSpeciality = user?.especialidad || 'General';

    // Función auxiliar para obtener el nombre del paciente
    const getPatientName = (patientId) => {
        const patient = ALL_USERS.find(u => u.id === patientId && u.rol === 'paciente');
        return patient ? patient.nombre : 'Paciente Desconocido';
    };

    // ----------------------------------------
    //      CARGA DE DATOS (RF08)
    // ----------------------------------------
    useEffect(() => {
        if (SIMULATE_DOCTOR_DASHBOARD && doctorId) {
            simulateLoadCitas();
            simulateLoadAvailability(); // RF04
        }
    }, [doctorId]);
    
    const simulateLoadCitas = () => {
        setLoading(true);
        const allAppointments = JSON.parse(localStorage.getItem('simulatedAppointments') || '[]');
        
        // Filtrar solo citas para este médico, excluyendo canceladas y finalizadas (RF08)
        const pending = allAppointments
            .filter(c => c.id_medico === doctorId && c.estado !== 'cancelada' && c.estado !== 'finalizada')
            .map(c => ({
                ...c,
                paciente: getPatientName(c.id_paciente),
            }))
            .sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));

        setCitasPendientes(pending);
        setLoading(false);
    };

    const simulateLoadAvailability = () => {
        const allAvailability = JSON.parse(localStorage.getItem('simulatedAvailability') || '[]');
        const doctorAvailability = allAvailability.filter(d => d.doctor_id === doctorId);
        setCurrentAvailability(doctorAvailability);
    };

    // ----------------------------------------
    //      GESTIÓN DE DISPONIBILIDAD (RF04)
    // ----------------------------------------
    const saveAvailability = async () => {
        if (!newAvailability.fecha || !newAvailability.hora_inicio || !newAvailability.hora_fin) {
            setErrorMsg("Debe completar todos los campos de disponibilidad.");
            return;
        }

        setLoadingAction(true);
        setErrorMsg(null);
        await new Promise(resolve => setTimeout(resolve, 500));

        const allAvailability = JSON.parse(localStorage.getItem('simulatedAvailability') || '[]');
        
        const newEntry = {
            id: `dispo-${Date.now()}`,
            doctor_id: doctorId,
            ...newAvailability
        };

        allAvailability.push(newEntry);
        localStorage.setItem('simulatedAvailability', JSON.stringify(allAvailability));

        alert("✅ Disponibilidad registrada exitosamente (RF04).");
        setOpenDispoDialog(false);
        setNewAvailability({ fecha: '', hora_inicio: '', hora_fin: '' });
        simulateLoadAvailability();
        setLoadingAction(false);
    };

    // ----------------------------------------
    //      ATENCIÓN AL PACIENTE (RF09, RF10, RF13)
    // ----------------------------------------
    
    // Iniciar Atención (RF09)
    const startAttention = async (appointment) => {
        setCurrentAppointment(appointment);
        setDiagnosis('');
        setTreatment('');
        setLoadingAction(true);
        setErrorMsg(null);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Cambiar estado a 'en atencion'
        changeAppointmentState(appointment.id, 'en atencion');
        
        // Cargar historial del paciente (RF13)
        loadPatientHistory(appointment.id_paciente); 
        
        setOpenAttentionDialog(true);
        setLoadingAction(false);
    };

    // Finalizar Atención (RF09, RF10)
    const finishAttention = async () => {
        if (!diagnosis || !treatment) {
            setErrorMsg("El diagnóstico y el tratamiento son obligatorios para finalizar la cita.");
            return;
        }

        if (!window.confirm("¿Está seguro de finalizar la cita y cerrar el reporte médico?")) return;

        setLoadingAction(true);
        setErrorMsg(null);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 1. Cambiar estado a 'finalizada' (RF10)
        let allAppointments = JSON.parse(localStorage.getItem('simulatedAppointments') || '[]');
        
        const updatedAppointments = allAppointments.map(c => {
            if (c.id === currentAppointment.id) {
                return { 
                    ...c, 
                    estado: 'finalizada', // RF10
                    diagnostico: diagnosis, // RF09
                    tratamiento: treatment, // RF09
                    fecha_finalizacion: new Date().toISOString().split('T')[0]
                };
            }
            return c;
        });

        localStorage.setItem('simulatedAppointments', JSON.stringify(updatedAppointments));
        
        alert(`✅ Cita con ${currentAppointment.paciente} finalizada y reporte guardado (RF09/RF10).`);

        setOpenAttentionDialog(false);
        simulateLoadCitas();
        setLoadingAction(false);
    };

    // Cambiar estado genérico (usado para 'en atencion')
    const changeAppointmentState = (citaId, newState) => {
        let allAppointments = JSON.parse(localStorage.getItem('simulatedAppointments') || '[]');
        
        const updatedAppointments = allAppointments.map(c => {
            if (c.id === citaId) {
                return { ...c, estado: newState };
            }
            return c;
        });
        localStorage.setItem('simulatedAppointments', JSON.stringify(updatedAppointments));
        simulateLoadCitas(); // Recargar la lista de pendientes
    };

    // Cargar Historial (RF13)
    const loadPatientHistory = (patientId) => {
        const allAppointments = JSON.parse(localStorage.getItem('simulatedAppointments') || '[]');
        
        // Obtener citas finalizadas del paciente
        const history = allAppointments
            .filter(c => c.id_paciente === patientId && c.estado === 'finalizada')
            .sort((a, b) => new Date(b.fecha_finalizacion) - new Date(a.fecha_finalizacion));
        
        setHistorialPaciente(history); // RF13
    };


    if (!doctorId) {
        return <Alert severity="error">Acceso denegado. No se encontró información del Médico.</Alert>;
    }


    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, color: "#1e40af", fontWeight: 'bold' }}>
                🩺 Dashboard Médico: {doctorName}
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: "#065f46" }}>
                Especialidad: {doctorSpeciality}
            </Typography>

            {/* ---------- GESTIÓN DE DISPONIBILIDAD (RF04) ---------- */}
            <Card sx={{ mb: 4, boxShadow: 6, borderLeft: '5px solid #3b82f6' }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#3b82f6' }} startIcon={<EventAvailableIcon />}>
                        Registrar Disponibilidad (RF04)
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={() => setOpenDispoDialog(true)}
                        startIcon={<ScheduleIcon />}
                        sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                    >
                        Añadir Nuevo Horario
                    </Button>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">Disponibilidad Registrada:</Typography>
                        {currentAvailability.length > 0 ? (
                            currentAvailability.slice(0, 3).map((d, index) => (
                                <Typography key={index} variant="body2">{d.fecha}: {d.hora_inicio} a {d.hora_fin}</Typography>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">No hay horarios registrados.</Typography>
                        )}
                        {currentAvailability.length > 3 && <Typography variant="caption">... y {currentAvailability.length - 3} más.</Typography>}
                    </Box>
                </CardContent>
            </Card>

            {/* ---------- CITAS PENDIENTES / SALA DE ESPERA (RF08) ---------- */}
            <Card sx={{ mb: 4, boxShadow: 6 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 3, color: '#9a3412' }}>
                        ⏳ Citas Pendientes y en Espera (RF08)
                    </Typography>
                    
                    {loading && <Grid container justifyContent="center" sx={{ p: 3 }}><CircularProgress /></Grid>}
                    
                    {!loading && (
                        <Table size="medium">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#fff7ed' }}>
                                    <TableCell>Paciente</TableCell>
                                    <TableCell>Fecha/Hora</TableCell>
                                    <TableCell>Motivo</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Acción (RF09)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {citasPendientes.length > 0 ? (
                                    citasPendientes.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell>**{c.paciente}**</TableCell>
                                            <TableCell>{c.fecha} - {c.hora}</TableCell>
                                            <TableCell>{c.motivo}</TableCell>
                                            <TableCell>
                                                <Box sx={{ 
                                                    p: 0.5, borderRadius: 1, display: 'inline-block',
                                                    bgcolor: c.estado === 'en atencion' ? '#fef3c7' : '#e0f2fe',
                                                    color: c.estado === 'en atencion' ? '#a16207' : '#1e40af',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="contained" 
                                                    size="small"
                                                    onClick={() => startAttention(c)}
                                                    disabled={loadingAction}
                                                    color={c.estado === 'en atencion' ? 'warning' : 'success'}
                                                >
                                                    {c.estado === 'en atencion' ? 'Continuar Atención' : 'Iniciar Atención (RF09)'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={5} align="center">No hay citas pendientes hoy.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* ---------------------------------------- */}
            {/*     DIALOGO: GESTIONAR DISPONIBILIDAD (RF04) */}
            {/* ---------------------------------------- */}
            <Dialog open={openDispoDialog} onClose={() => setOpenDispoDialog(false)}>
                <DialogTitle sx={{ bgcolor: '#3b82f6', color: 'white' }}>Registrar Horario Disponible (RF04)</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {errorMsg && <Alert severity="error" sx={{ my: 2 }}>{errorMsg}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Fecha"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={newAvailability.fecha}
                                onChange={(e) => setNewAvailability({ ...newAvailability, fecha: e.target.value })}
                                sx={{ mt: 1 }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Hora Inicio"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                value={newAvailability.hora_inicio}
                                onChange={(e) => setNewAvailability({ ...newAvailability, hora_inicio: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Hora Fin"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                value={newAvailability.hora_fin}
                                onChange={(e) => setNewAvailability({ ...newAvailability, hora_fin: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDispoDialog(false)} color="error" disabled={loadingAction}>Cancelar</Button>
                    <Button onClick={saveAvailability} variant="contained" color="primary" disabled={loadingAction}>
                        {loadingAction ? <CircularProgress size={24} color="inherit" /> : 'Guardar Disponibilidad'}
                    </Button>
                </DialogActions>
            </Dialog>


            {/* ---------------------------------------- */}
            {/*     DIALOGO: ATENCIÓN Y DIAGNÓSTICO (RF09, RF10, RF13) */}
            {/* ---------------------------------------- */}
            <Dialog open={openAttentionDialog} onClose={() => setOpenAttentionDialog(false)} fullWidth maxWidth="lg">
                <DialogTitle sx={{ bgcolor: '#9a3412', color: 'white' }}>
                    Atención Médica (RF09/RF10) - Paciente: {currentAppointment?.paciente}
                </DialogTitle>
                <DialogContent>
                    
                    <Grid container spacing={4} sx={{ mt: 1 }}>
                        
                        {/* Columna de Historial (RF13) */}
                        <Grid item xs={12} md={5}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" color="#1e40af" sx={{ mb: 2 }} startIcon={<HistoryIcon />}>
                                        Historial Médico (RF13)
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    {historialPaciente.length > 0 ? (
                                        historialPaciente.map((h, index) => (
                                            <Box key={index} sx={{ borderLeft: '3px solid #e0f2fe', pl: 1, mb: 2 }}>
                                                <Typography variant="subtitle2" color="textPrimary">
                                                    Fecha: **{h.fecha_finalizacion}**
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Motivo: *{h.motivo}*
                                                </Typography>
                                                <Typography variant="caption">
                                                    Diagnóstico: {h.diagnostico || 'N/A'}
                                                </Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Alert severity="info">No hay historial previo de citas finalizadas.</Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Columna de Diagnóstico/Tratamiento (RF09) */}
                        <Grid item xs={12} md={7}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" color="#9a3412" sx={{ mb: 2 }}>
                                        Registro de Atención (RF09)
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
                                    
                                    <TextField
                                        fullWidth
                                        label="Motivo de la Cita Actual"
                                        multiline
                                        rows={2}
                                        value={currentAppointment?.motivo || ''}
                                        disabled
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Diagnóstico (RF09)"
                                        multiline
                                        rows={4}
                                        value={diagnosis}
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                        sx={{ mb: 2 }}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Tratamiento/Recomendaciones (RF09)"
                                        multiline
                                        rows={4}
                                        value={treatment}
                                        onChange={(e) => setTreatment(e.target.value)}
                                        required
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
                    <Button onClick={() => setOpenAttentionDialog(false)} color="error" disabled={loadingAction}>
                        Guardar Borrador / Cerrar
                    </Button>
                    <Button 
                        onClick={finishAttention} 
                        variant="contained" 
                        color="success" 
                        startIcon={<CheckCircleIcon />}
                        disabled={loadingAction || !diagnosis || !treatment}
                    >
                        {loadingAction ? <CircularProgress size={24} color="inherit" /> : 'Finalizar Cita y Generar Reporte (RF10)'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}