import { useState, useEffect } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Box, 
    Container, 
    Drawer, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText,
    IconButton,
    CircularProgress 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { useNavigate } from 'react-router-dom';

export default function MainLayout({ children }) {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    // 1. Obtener la info del usuario y su rol
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const userName = user?.nombre || 'Usuario';
    const userRole = user?.rol || 'guest';
    
    // 2. Definir las opciones de navegación según el rol
    const getNavItems = (role) => {
        switch (role) {
            case 'admin':
                return [
                    { name: 'Dashboard Admin', path: '/dashboard', icon: <DashboardIcon /> },
                    // RF14: Gestión de Usuarios, RF15: Reportes
                ];
            case 'medico': // Usamos 'medico' para ser consistente con Registration.jsx
                return [
                    { name: 'Mi Panel Médico', path: '/dashboard', icon: <DashboardIcon /> },
                    { name: 'Disponibilidad (RF04)', path: '#', icon: <DateRangeIcon /> },
                ];
            case 'paciente':
                return [
                    { name: 'Mis Citas', path: '/dashboard', icon: <DateRangeIcon /> },
                    { name: 'Agendar Cita (RF05)', path: '#', icon: <EventNoteIcon /> },
                ];
            default:
                return [];
        }
    };
    
    const navItems = getNavItems(userRole);

    // 3. Función de Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // 4. Redirección si no hay token
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    if (!token) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;
    }
    
    return (
        // El Box principal ahora tiene el fondo degradado de las pantallas de Login/Register
        <Box 
            sx={{ 
                minHeight: '100vh', 
                flexDirection: 'column', 
                // FONDO APLICADO AL ENVOLTORIO PRINCIPAL
                background: 'linear-gradient(135deg, #e0f2fe 0%, #a7f3d0 100%)', 
                display: 'flex',
            }}
        >
            
            {/* ---------- APP BAR (HEADER) - ESTILOS MEJORADOS ---------- */}
            <AppBar position="sticky" sx={{ bgcolor: '#1e40af', boxShadow: 3 }}> {/* Color y Sombra consistentes */}
                <Toolbar>
                    
                    {/* Botón de Menú para la Sidebar (Siempre visible para Dashboards) */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={() => setDrawerOpen(true)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    
                    {/* Logo/Título principal */}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        ZenMediClick - {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </Typography>
                    
                    {/* Nombre del Usuario */}
                    <Typography variant="body1" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                        Hola, **{userName}**
                    </Typography>

                    {/* Botón de Logout */}
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />} sx={{ 
                        // Botón de salida con estilo más limpio
                        fontWeight: 'bold', 
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid white'
                        }
                    }}>
                        Salir
                    </Button>
                </Toolbar>
            </AppBar>

            {/* ---------- SIDEBAR (DRAWER) - Mantenido ---------- */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={() => setDrawerOpen(false)}
                    onKeyDown={() => setDrawerOpen(false)}
                >
                    <List>
                        {/* Título o cabecera del Drawer */}
                        <Box sx={{ p: 2, bgcolor: '#e0f2fe', borderBottom: '1px solid #bae6fd' }}>
                            <Typography variant="h6" color="#1e40af">Menú Principal</Typography>
                        </Box>
                        
                        {navItems.map((item) => (
                            <ListItem key={item.name} disablePadding>
                                <ListItemButton onClick={() => navigate(item.path === '#' ? '/dashboard' : item.path)}>
                                    <ListItemIcon sx={{ color: '#561eafff' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListItem disablePadding sx={{ mt: 2, borderTop: '1px solid #eee' }}>
                            <ListItemButton onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon color="error" />
                                </ListItemIcon>
                                <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ color: 'error' }} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            
            {/* ---------- CONTENIDO PRINCIPAL ---------- */}
            <Container 
                maxWidth="xl" 
                component="main" 
                // QUITAMOS EL FONDO BLANCO AQUÍ, permitiendo que se vea el degradado del Box principal.
                sx={{ flexGrow: 1, p: 3, pt: 4, py: { xs: 4, sm: 6 } }} 
            >
                {/* Aquí es donde se inserta el componente hijo (e.g., PatientDashboard) */}
                {children}
            </Container>

            {/* Opcional: Footer simple - con estilo acorde */}
            <Box sx={{ py: 1, bgcolor: '#a7f3d0', textAlign: 'center', borderTop: '1px solid #bae6fd' }}>
                <Typography variant="caption" color="#065f46" fontWeight="bold">© 2025 ZenMediClick</Typography>
            </Box>
        </Box>
    );
}