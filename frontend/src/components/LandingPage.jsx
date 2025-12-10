import { Container, Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
// Importamos iconos de Material-UI para las características
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SecurityIcon from '@mui/icons-material/Security';


export default function LandingPage() {
    const navigate = useNavigate();

    const features = [
        { 
            icon: <AccessTimeFilledIcon sx={{ fontSize: 40, color: '#1e40af' }} />,
            title: "Agenda Rápida",
            description: "Encuentra y reserva citas en segundos, sin esperas ni llamadas telefónicas."
        },
        { 
            icon: <PeopleAltIcon sx={{ fontSize: 40, color: '#1e40af' }} />,
            title: "Doctores a tu Alcance",
            description: "Accede a la disponibilidad de todos nuestros especialistas y consultorios."
        },
        { 
            icon: <SecurityIcon sx={{ fontSize: 40, color: '#1e40af' }} />,
            title: "Información Segura",
            description: "Tu historial y datos personales están protegidos con los más altos estándares de seguridad."
        },
    ];

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e0f2fe 0%, #a7f3d0 100%)',
            display: 'flex',
            flexDirection: 'column', // Permitir que las secciones se apilen
            py: 4
        }}>
            <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                
                {/* ---------- SECCIÓN PRINCIPAL (HERO) ---------- */}
                <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1e40af', mb: 2 }}>
                            Tu salud, nuestra prioridad
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#1f2937', mb: 4 }}>
                            Bienvenidos a ZenMediClick. Agendar tus citas médicas ahora es más rápido, fácil y personalizado.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button 
                                variant="contained" 
                                size="large" 
                                sx={{ borderRadius: '50px', px: 4, bgcolor: '#1e40af', '&:hover': { bgcolor: '#102a80' } }} 
                                onClick={() => navigate('/login')}
                            >
                                Iniciar sesión
                            </Button>
                            <Button 
                                variant="outlined" 
                                size="large" 
                                sx={{ borderRadius: '50px', px: 4, borderColor: '#1e40af', color: '#1e40af', '&:hover': { borderColor: '#102a80', color: '#102a80', bgcolor: 'rgba(30, 64, 175, 0.04)' } }} 
                                onClick={() => navigate('/registration')} // Cambiado a '/registration' por convención
                            >
                                Registrarse
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
                        {/* El logo se mantiene, solo lo envolvemos en un Box para mejor control de estilo */}
                        <Box sx={{ p: 4 }}> 
                            <img src={logo} alt="ZenMediClick Logo" style={{ maxWidth: '300px', width: '100%', height: 'auto' }} />
                        </Box>
                    </Grid>
                </Grid>

                {/* --- NUEVA SECCIÓN: CARACTERÍSTICAS/BENEFICIOS --- */}
                <Box sx={{ pt: 4, pb: 8 }}>
                    <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: '#1e40af', mb: 6 }}>
                        ¿Por qué elegir ZenMediClick?
                    </Typography>
                    
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card sx={{ height: '100%', textAlign: 'center', p: 3, boxShadow: 6, borderRadius: '12px' }}>
                                    <CardContent>
                                        <Box sx={{ mb: 2 }}>
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#1f2937' }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                {/* --- FIN NUEVA SECCIÓN --- */}

            </Container>

            {/* ---------- FOOTER SIMPLE ---------- */}
            <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'rgba(30, 64, 175, 0.1)', mt: 'auto' }}>
                <Typography variant="body2" sx={{ color: '#1f2937' }}>© 2025 ZenMediClick. Todos los derechos reservados.</Typography>
            </Box>
        </Box>
    );
}