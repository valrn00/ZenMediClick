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
import { useNavigate } from 'react-router-dom';
// Asegúrate de que el logo esté accesible si lo quieres usar en el navbar
// import logo from '../assets/logo.png'; 

// Las props esperan 'children' que será el componente de la página actual (e.g., AdminDashboard)
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
                    // Podrías añadir más aquí (e.g., '/gestion-consultorios')
                ];
            case 'doctor':
                return [
                    { name: 'Dashboard Doctor', path: '/dashboard', icon: <DashboardIcon /> },
                    // Podrías añadir más aquí (e.g., '/mis-pacientes')
                ];
            case 'paciente':
                return [
                    { name: 'Agendar Cita', path: '/citas', icon: <DashboardIcon /> },
                    { name: 'Mis Citas', path: '/dashboard', icon: <DashboardIcon /> },
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

    // 4. Redirección si no hay token (simulación de protección de ruta)
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    // Si no está autenticado, no renderizamos el layout completo (opcional)
    if (!token) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;
    }
    
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
            
            {/* ---------- APP BAR (HEADER) ---------- */}
            <AppBar position="static" sx={{ bgcolor: '#1e40af' }}>
                <Toolbar>
                    
                    {/* Botón de Menú para la Sidebar (solo en móviles) */}
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
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        ZenMediClick - {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </Typography>
                    
                    {/* Nombre del Usuario */}
                    <Typography variant="body1" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                        Hola, **{userName}**
                    </Typography>

                    {/* Botón de Logout */}
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                        Salir
                    </Button>
                </Toolbar>
            </AppBar>

            {/* ---------- SIDEBAR (DRAWER) ---------- */}
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
                        {navItems.map((item) => (
                            <ListItem key={item.name} disablePadding>
                                <ListItemButton onClick={() => navigate(item.path)}>
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            
            {/* ---------- CONTENIDO PRINCIPAL (Donde se renderizan los Dashboards) ---------- */}
            <Container 
                maxWidth="xl" 
                component="main" 
                sx={{ flexGrow: 1, p: 3, pt: 4, bgcolor: '#f1f5f9' }} // Fondo claro para el área de contenido
            >
                {/* Aquí es donde se inserta el componente hijo (e.g., AdminDashboard) */}
                {children}
            </Container>

            {/* Opcional: Footer simple */}
            <Box sx={{ py: 1, bgcolor: '#e0f2fe', textAlign: 'center', borderTop: '1px solid #bae6fd' }}>
                <Typography variant="caption" color="textSecondary">© 2025 ZenMediClick</Typography>
            </Box>
        </Box>
    );
}