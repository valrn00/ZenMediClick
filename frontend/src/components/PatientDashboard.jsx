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
    TextField,
    Grid,
    CircularProgress,
    Alert,
    Box, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

import FileDownloadIcon from '@mui/icons-material/FileDownload'; 

// --- IMPORTACIONES PARA EL CALENDARIO ---
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
// Importar utilidades de localización (Necesitas instalar 'date-fns')
import { es } from 'date-fns/locale'; 
import { parseISO } from 'date-fns'; // Para convertir strings ISO a Date objects

// --- FUNCIÓN AUXILIAR DE FORMATO ---
const formatDate = (date) => {
    if (!date) return '';
    // Formatea un objeto Date a la cadena YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- CONFIGURACIÓN DE ESTILOS INLINE PARA REACT-DATEPICKER ---
// Este estilo es crucial para que el input del DatePicker se vea bien con MUI
const datePickerInputStyle = {
    padding: '16.5px 14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box',
    cursor: 'pointer',
};


// --- CONFIGURACIÓN DE SIMULACIÓN ---
const SIMULATE_PATIENT_DASHBOARD = true;

export default function PatientDashboard() {
    // ----------------------------------------
    //      ESTADO DEL COMPONENTE
    // ----------------------------------------
    const [citas, setCitas] = useState([]);
    const [loadingCitas, setLoadingCitas] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [disponibilidad, setDisponibilidad] = useState([]);
    
    // Usamos el objeto Date nativo para el DatePicker, inicializado en null.
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null); 
    
    const [nuevaCita, setNuevaCita] = useState({
        id_medico: '',
        fecha: '', // Esta será una cadena 'YYYY-MM-DD'
        hora: '',
        motivo: '',
        consultorio: 'Consultorio A' 
    });

    // ----------------------------------------
    //      DATOS DEL USUARIO
    // ----------------------------------------
    const currentUserJson = localStorage.getItem("currentUser");
    const user = currentUserJson ? JSON.parse(currentUserJson) : {};
    const patientId = user?.id;

    const allUsers = useMemo(() => {
        const usersJson = localStorage.getItem('registeredUsers');
        return usersJson ? JSON.parse(usersJson) : [];
    }, []);

    const getDoctorName = (doctorId) => {
        const doctor = allUsers.find(u => u.id === doctorId && u.rol === 'medico');
        return doctor ? `${doctor.nombre} (${doctor.especialidad || 'General'})` : 'Médico Desconocido';
    };

    // ----------------------------------------
    //      Carga de Datos Inicial (RF05, RF07)
    // ----------------------------------------
    useEffect(() => {
        if (SIMULATE_PATIENT_DASHBOARD && patientId) {
            simulateLoadData();
        }
    }, [patientId]);

    const simulateLoadData = () => {
        setLoadingCitas(true);
        setErrorMsg(null);
        
        const availableDoctors = allUsers.filter(u => u.rol === 'medico');
        setDoctors(availableDoctors);

        const allAppointments = JSON.parse(localStorage.getItem('simulatedAppointments') || '[]');
        const patientAppointments = allAppointments
            .filter(c => c.id_paciente === patientId)
            .map(c => ({
                ...c,
                medico: getDoctorName(c.id_medico)
            }))
            .sort((a, b) => {
                if (a.fecha !== b.fecha) return new Date(a.fecha) - new Date(b.fecha);
                return a.hora.localeCompare(b.hora);
            });
        
        setCitas(patientAppointments);
        setLoadingCitas(false);
    };

    // ----------------------------------------
    //      Lógica de Agendamiento (RF05, RF06)
    // ----------------------------------------

    // Maneja el cambio de fecha del DatePicker (Recibe un objeto Date)
    const handleDateChange = (date) => {
        setFechaSeleccionada(date);
        
        // Convertir objeto Date a formato 'YYYY-MM-DD' para la simulación
        const formattedDate = date ? formatDate(date) : ''; 
        
        setNuevaCita(prev => ({ 
            ...prev, 
            fecha: formattedDate,
            hora: '' // Resetear hora al cambiar fecha (RF06)
        }));
    };


    // Carga la disponibilidad del médico seleccionado
    const cargarDisponibilidadPorDoctorSimulada = (doctorId) => {
        const allAvailability = JSON.parse(localStorage.getItem('simulatedAvailability') || '[]');
        const doctorAvailability = allAvailability.filter(d => d.doctor_id === doctorId);
        setDisponibilidad(doctorAvailability);
        setFechaSeleccionada(null); // Resetear selección de fecha/hora
        setNuevaCita(prev => ({ ...prev, fecha: '', hora: '' })); 
    };

    const handleDoctorChange = (e) => {
        const doctorId = e.target.value;
        setNuevaCita(prev => ({ ...prev, id_medico: doctorId }));
        if (doctorId) {
            cargarDisponibilidadPorDoctorSimulada(doctorId);
        } else {
            setDisponibilidad([]);
        }
    };

    const simulateAppointment = async () => {
        if (!nuevaCita.id_medico || !nuevaCita.fecha || !nuevaCita.hora || !nuevaCita.motivo) {
            setErrorMsg("Por favor, complete todos los campos de la cita.");
            return;
        }

        setLoadingAction(true);
        setErrorMsg(null);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const allAppointments = JSON.parse(localStorage.getItem('simulatedAppointments') || '[]');
        
        // Simulación de validación de cita duplicada del paciente
        const patientAppointmentExists = allAppointments.some(c => 
            c.id_paciente === patientId && 
            c.fecha === nuevaCita.fecha && 
            c.hora === nuevaCita.hora &&
            c.estado !== 'cancelada'
        );

        if (patientAppointmentExists) {
            setErrorMsg("Ya tienes una cita agendada para esa fecha y hora.");
            setLoadingAction(false);
            return;
        }
        
        // Crear nueva cita
        const newAppointment = {
            id: Date.now().toString(),
            id_paciente: patientId,
            estado: 'pendiente', // RF05: estado inicial
            ...nuevaCita,
        };

        allAppointments.push(newAppointment);
        localStorage.setItem('simulatedAppointments', JSON.stringify(allAppointments));

        alert("✅ Cita agendada exitosamente (RF05).");
        setOpenDialog(false);
        setLoadingAction(false);
        simulateLoadData(); // Recargar citas
        setNuevaCita({ id_medico: '', fecha: '', hora: '', motivo: '', consultorio: 'Consultorio A' });
        setFechaSeleccionada(null);
        setDisponibilidad([]);
    };

    // ----------------------------------------
    //      Lógica de Cancelación (RF07)
    // ----------------------------------------
    const cancelAppointment = async (citaId) => {
        if (!window.confirm("¿Está seguro que desea cancelar esta cita?")) return;

        setLoadingAction(true);
        setErrorMsg(null);
        await new Promise(resolve => setTimeout(resolve, 500)); 

        const allAppointments = JSON.parse(localStorage.getItem('simulatedAppointments') || '[]');
        
        const updatedAppointments = allAppointments.map(c => {
            if (c.id === citaId) {
                return { ...c, estado: 'cancelada' }; // RF07
            }
            return c;
        });

        localStorage.setItem('simulatedAppointments', JSON.stringify(updatedAppointments));
        alert("❌ Cita cancelada exitosamente (RF07).");
        setLoadingAction(false);
        simulateLoadData(); // Recargar citas
    };

    // ----------------------------------------
    //      Simulación de Descarga de PDF (RF12)
    // ----------------------------------------
    const handleDownloadPDF = (cita) => {
        alert(`Simulando descarga del reporte médico para la cita del ${cita.fecha} con ${cita.medico}.`);
        window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
    };

    if (!patientId) {
        return <Alert severity="error">Acceso denegado. No se encontró información del Paciente.</Alert>;
    }

    // Obtener las fechas únicas disponibles para el médico seleccionado, convertidas a objetos Date
    const availableDates = useMemo(() => {
        // Mapear los strings 'YYYY-MM-DD' a objetos Date válidos para react-datepicker
        return disponibilidad
            .map(d => d.fecha) // Obtener solo las fechas en formato string
            .filter((value, index, self) => self.indexOf(value) === index) // Obtener fechas únicas
            .map(dateString => parseISO(dateString)); // Convertir string a Date object
    }, [disponibilidad]);


    return (
        <Container maxWidth="md" sx={{ mt: 0, mb: 0 }}>
            <Card sx={{ boxShadow: 8, p: 4, bgcolor: 'white' }}>
                <CardContent>
                    <Typography variant="h4" sx={{ mb: 4, color: '#1e40af', fontWeight: 'bold', textAlign: 'center' }}>
                        🏥 Dashboard del Paciente: {user.nombre}
                    </Typography>

                    {/* ---------- ACCIÓN PRINCIPAL ---------- */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Button 
                            variant="contained" 
                            size="large"
                            onClick={() => setOpenDialog(true)}
                            sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                        >
                            Agendar Nueva Cita
                        </Button>
                    </Box>

                    {/* ---------- MIS CITAS (RF05, RF07, RF12) ---------- */}
                    <Typography variant="h5" sx={{ mt: 3, mb: 2, color: '#065f46' }}>📋 Mis Citas Programadas</Typography>
                    
                    {loadingCitas && <Grid container justifyContent="center" sx={{ p: 3 }}><CircularProgress /></Grid>}
                    {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

                    {!loadingCitas && (
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#eff6ff' }}>
                                    <TableCell>Médico</TableCell>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Hora</TableCell>
                                    <TableCell>Motivo</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {citas.length > 0 ? (
                                    citas.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell>**{c.medico}**</TableCell>
                                            <TableCell>{c.fecha}</TableCell>
                                            <TableCell>{c.hora}</TableCell>
                                            <TableCell>{c.motivo}</TableCell>
                                            
                                            {/* Celda de Estado (Mejorada para ver todos los estados) */}
                                            <TableCell>
                                                <Box 
                                                    sx={{ 
                                                        p: 0.5, 
                                                        borderRadius: '4px',
                                                        fontWeight: 'bold',
                                                        display: 'inline-block',
                                                        bgcolor: c.estado === 'pendiente' ? '#ffedd5' : 
                                                                 c.estado === 'cancelada' ? '#fee2e2' : 
                                                                 c.estado === 'finalizada' ? '#d1fae5' : 
                                                                 c.estado === 'en atencion' ? '#fef3c7' : '#f3f4f6', 
                                                                 
                                                        color: c.estado === 'pendiente' ? '#9a3412' : 
                                                               c.estado === 'cancelada' ? '#991b1b' : 
                                                               c.estado === 'finalizada' ? '#065f46' : 
                                                               c.estado === 'en atencion' ? '#a16207' : '#4b5563', 
                                                    }}
                                                >
                                                    {c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}
                                                </Box>
                                            </TableCell>

                                            {/* Celda de Acción (Corregida) */}
                                            <TableCell>
                                                {c.estado === 'pendiente' && (
                                                    <Button 
                                                        size="small" 
                                                        color="error"
                                                        onClick={() => cancelAppointment(c.id)}
                                                        disabled={loadingAction}
                                                    >
                                                        Cancelar (RF07)
                                                    </Button>
                                                )}
                                                
                                                {c.estado === 'finalizada' && (
                                                    <Button 
                                                        size="small" 
                                                        variant="contained" 
                                                        color="success"
                                                        startIcon={<FileDownloadIcon />}
                                                        onClick={() => handleDownloadPDF(c)}
                                                        sx={{ bgcolor: '#065f46', '&:hover': { bgcolor: '#044c33' } }}
                                                    >
                                                        Reporte (RF12)
                                                    </Button>
                                                )}
                                                
                                                {(c.estado === 'en atencion') && (
                                                    <Typography variant="body2" color="warning.main">
                                                        En Atención
                                                    </Typography>
                                                )}
                                                
                                                {(c.estado === 'cancelada') && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        No aplica
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={6} align="center">No tienes citas agendadas.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* ---------- DIALOGO DE AGENDAR CITA (RF05, RF06) ---------- */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ bgcolor: '#1e40af', color: 'white' }}>Agendar Nueva Cita (RF05)</DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
                        
                        {/* Seleccionar Médico */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Seleccionar Médico</InputLabel>
                            <Select
                                value={nuevaCita.id_medico}
                                label="Seleccionar Médico"
                                onChange={handleDoctorChange}
                            >
                                <MenuItem value="">
                                    <em>Seleccione un médico</em>
                                </MenuItem>
                                {doctors.map((doc) => (
                                    <MenuItem key={doc.id} value={doc.id}>
                                        {doc.nombre} ({doc.especialidad})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {nuevaCita.id_medico && (
                            <Grid container spacing={2}>
                                {/* Seleccionar Fecha (USANDO REACT-DATEPICKER) */}
                                <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
                                    {/* Campo de fecha */}
                                    <InputLabel htmlFor="react-datepicker-input" sx={{ mb: 1, ml: 1, fontSize: '0.8rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                                        Seleccionar una fecha
                                    </InputLabel>
                                    <DatePicker
                                        id="react-datepicker-input"
                                        selected={fechaSeleccionada}
                                        onChange={handleDateChange}
                                        dateFormat="dd/MM/yyyy"
                                        minDate={new Date()}
                                        placeholderText="Haga clic para seleccionar"
                                        locale={es} // Usar localización en español
                                        // IMPORTANTE: usamos 'includeDates' para restringir la selección
                                        includeDates={availableDates} 
                                        customInput={<input style={datePickerInputStyle} />} // Aplicar estilo
                                    />
                                    {availableDates.length === 0 && (
                                        <Typography variant="caption" color="error">
                                            {nuevaCita.id_medico && disponibilidad.length === 0 
                                                ? "Cargando disponibilidad o el médico no tiene franjas disponibles." 
                                                : "Seleccione un médico primero."}
                                        </Typography>
                                    )}
                                </Grid>

                                {/* Seleccionar Hora (RF06) */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel>Hora Disponible</InputLabel>
                                        <Select
                                            value={nuevaCita.hora}
                                            label="Hora Disponible"
                                            onChange={(e) => setNuevaCita({ ...nuevaCita, hora: e.target.value })}
                                            disabled={!nuevaCita.fecha} // Deshabilitado hasta que haya fecha
                                        >
                                            <MenuItem value="">
                                                <em>Seleccione una hora</em>
                                            </MenuItem>
                                            {/* Solo mostrar horas para la fecha seleccionada */}
                                            {disponibilidad
                                                .filter(d => d.fecha === nuevaCita.fecha)
                                                .map((d) => (
                                                    <MenuItem key={d.hora_inicio} value={d.hora_inicio}>{d.hora_inicio}</MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}

                        <TextField
                            fullWidth
                            label="Motivo de la Cita"
                            multiline
                            rows={3}
                            sx={{ mb: 2 }}
                            value={nuevaCita.motivo}
                            onChange={(e) => setNuevaCita({ ...nuevaCita, motivo: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} disabled={loadingAction} color="error">Cancelar</Button>
                        <Button 
                            variant="contained" 
                            color="success"
                            onClick={simulateAppointment} 
                            disabled={loadingAction || !nuevaCita.id_medico || !nuevaCita.fecha || !nuevaCita.hora || !nuevaCita.motivo}
                        >
                            {loadingAction ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Cita (RF05)'}
                        </Button>
                    </DialogActions>
                </Dialog>
        </Container>
    );
}