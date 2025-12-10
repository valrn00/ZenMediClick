import { useState, useEffect } from 'react';
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
    // Nuevos imports para la gestión de disponibilidad:
    Button,
    TextField,
    Grid,
    CircularProgress,
    Alert
} from '@mui/material';

const API = "https://zenmediclick.onrender.com";

export default function DoctorDashboard() {
    const [citas, setCitas] = useState([]);
    const [loadingCitas, setLoadingCitas] = useState(true);
    const [errorCitas, setErrorCitas] = useState(null);
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [nuevaDisponibilidad, setNuevaDisponibilidad] = useState({
        fecha: '',
        hora_inicio: '09:00', // Valor por defecto
        hora_fin: '17:00', // Valor por defecto
    });

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const doctorId = user?.id; // Usar optional chaining por seguridad

    // Función principal para cargar todos los datos
    useEffect(() => {
        if (doctorId && token) {
            cargarCitas();
            cargarDisponibilidad();
        }
    }, [doctorId, token]);

    // -------------------------------
    // 	 	CARGAR CITAS
    // -------------------------------
    const cargarCitas = () => {
        setLoadingCitas(true);
        setErrorCitas(null);
        fetch(`${API}/citas/medico/${doctorId}`, {
            headers: { Authorization: token }
        })
            .then((r) => {
                if (!r.ok) throw new Error("Error al cargar citas.");
                return r.json();
            })
            .then(data => {
                setCitas(data);
                setLoadingCitas(false);
            })
            .catch(error => {
                console.error(error);
                setErrorCitas("No se pudieron cargar las citas. Verifique la conexión.");
                setLoadingCitas(false);
            });
    };

    // -------------------------------
    // 	 	CARGAR DISPONIBILIDAD
    // -------------------------------
    const cargarDisponibilidad = () => {
        // Asumiendo que hay un endpoint similar al de AdminDashboard, pero filtrado por doctor
        fetch(`${API}/disponibilidad/medico/${doctorId}`, {
            headers: { Authorization: token }
        })
            .then((r) => r.json())
            .then(setDisponibilidad)
            .catch(error => console.error("Error cargando disponibilidad:", error));
    };


    // -------------------------------
    // 	CREAR DISPONIBILIDAD (POST)
    // -------------------------------
    const crearDisponibilidad = async () => {
        // Validación básica
        if (!nuevaDisponibilidad.fecha || !nuevaDisponibilidad.hora_inicio || !nuevaDisponibilidad.hora_fin) {
            alert("Por favor, complete todos los campos de disponibilidad.");
            return;
        }

        try {
            const body = {
                ...nuevaDisponibilidad,
                doctor_id: doctorId,
            };

            const response = await fetch(`${API}/disponibilidad`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: token },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                alert("Disponibilidad creada exitosamente.");
                cargarDisponibilidad(); // Recargar la lista
                setNuevaDisponibilidad({ fecha: '', hora_inicio: '09:00', hora_fin: '17:00' }); // Resetear
            } else {
                const errorData = await response.json();
                alert(`Error al crear disponibilidad: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error("Error en la solicitud POST:", error);
            alert("Error de conexión al crear disponibilidad.");
        }
    };


    if (!doctorId) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">Acceso denegado. No se encontró información del Doctor.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#1e40af' }}>Panel del Doctor: {user.nombre}</Typography>

            {/* ---------- GESTIÓN DE DISPONIBILIDAD ---------- */}
            <Card sx={{ mb: 4, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 2 }}>📅 Definir mi Disponibilidad</Typography>

                    <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Fecha"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={nuevaDisponibilidad.fecha}
                                onChange={(e) => setNuevaDisponibilidad({ ...nuevaDisponibilidad, fecha: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Hora Inicio"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                value={nuevaDisponibilidad.hora_inicio}
                                onChange={(e) => setNuevaDisponibilidad({ ...nuevaDisponibilidad, hora_inicio: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Hora Fin"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                value={nuevaDisponibilidad.hora_fin}
                                onChange={(e) => setNuevaDisponibilidad({ ...nuevaDisponibilidad, hora_fin: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={crearDisponibilidad}
                                sx={{ height: '56px' }}
                                disabled={!nuevaDisponibilidad.fecha}
                            >
                                Guardar Franja
                            </Button>
                        </Grid>
                    </Grid>
                    
                    {/* Tabla de Disponibilidad Existente */}
                    <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Franjas de Disponibilidad</Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Inicio</TableCell>
                                <TableCell>Fin</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {disponibilidad.length > 0 ? (
                                disponibilidad.map((d) => (
                                    <TableRow key={d.id}>
                                        <TableCell>{d.fecha}</TableCell>
                                        <TableCell>{d.hora_inicio}</TableCell>
                                        <TableCell>{d.hora_fin}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={3} align="center">No hay disponibilidad registrada.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>

                </CardContent>
            </Card>


            {/* ---------- CITAS DEL DOCTOR ---------- */}
            <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 2 }}>🧑‍⚕️ Mis Próximas Citas</Typography>

                    {loadingCitas && <Grid container justifyContent="center" sx={{ p: 3 }}><CircularProgress /></Grid>}
                    {errorCitas && <Alert severity="error">{errorCitas}</Alert>}

                    {!loadingCitas && !errorCitas && (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Paciente</TableCell>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Hora</TableCell>
                                    <TableCell>Motivo</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {citas.length > 0 ? (
                                    citas.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell>**{c.paciente}**</TableCell> {/* Asumiendo que el backend trae el nombre del paciente */}
                                            <TableCell>{c.fecha}</TableCell> {/* Añadido para mejor contexto */}
                                            <TableCell>{c.hora}</TableCell>
                                            <TableCell>{c.motivo}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={4} align="center">No tienes citas agendadas.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}