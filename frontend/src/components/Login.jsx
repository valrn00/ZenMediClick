import { useState, useEffect } from 'react';
import { 
    Container, 
    TextField, 
    Button, 
    Typography, 
    Box, 
    Alert, 
    CircularProgress,
    Link,
    IconButton,
    InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// Asumiendo que esta ruta es correcta
import logo from '../assets/logo.png'; 

// --- CONFIGURACIÓN DE SIMULACIÓN ---
const SIMULATE_LOGIN = true; 

// Usuarios Administradores Preexistentes (RF03)
const ADMIN_USERS = [
    { 
        id: 'admin-001', 
        nombre: 'Valery Gaona', 
        email: 'valrn00@gmail.com', 
        password: 'valerygaona_1234', // ¡Solo para simulación!
        rol: 'admin',
        cedula: '1028863049'
    }
  
    , { 
        id: 'admin-002', 
        nombre: 'Nicolás Bayona', 
        email: 'nicolasoelds@gmail.com', 
        password: 'nicolas_1234', // ¡Solo para simulación!
        rol: 'admin',
        cedula: '1023869341'
    }
];


export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();

    // ----------------------------------------
    //      CONFIGURACIÓN INICIAL (RF03)
    // ----------------------------------------
    useEffect(() => {
        const storedUsersJson = localStorage.getItem('registeredUsers');
        let storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : [];
        let usersUpdated = false;

        ADMIN_USERS.forEach(admin => {
            const adminExists = storedUsers.some(user => user.email === admin.email);
            if (!adminExists) {
                storedUsers.push(admin);
                usersUpdated = true;
            }
        });

        if (usersUpdated) {
            localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
        }
    }, []);
    

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrorMsg('');
    };

    // ----------------------------------------
    //      LÓGICA DE LOGIN (RF02)
    // ----------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.email || !form.password) {
            setErrorMsg('Email y contraseña son obligatorios.');
            return;
        }

        setIsLoading(true);
        setErrorMsg('');

        // --- SIMULACIÓN DE AUTENTICACIÓN (RF02) ---
        if (SIMULATE_LOGIN) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

            const userFound = storedUsers.find(
                user => user.email === form.email && user.password === form.password
            );

            if (userFound) {
                // Autenticación exitosa. Guardar token y usuario (RF02)
                const token = `fake-token-${userFound.id}-${Date.now()}`;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userFound)); 
                localStorage.setItem('currentUser', JSON.stringify(userFound)); 

                // **REDIRECCIÓN CORREGIDA**
                let dashboardPath = '/'; 
                
                if (userFound.rol === 'admin') {
                    dashboardPath = '/admin-dashboard';
                } else if (userFound.rol === 'medico') {
                    dashboardPath = '/doctor-dashboard';
                } else if (userFound.rol === 'paciente') {
                    dashboardPath = '/patient-dashboard';
                }
                
                navigate(dashboardPath, { replace: true });
                return;

            } else {
                setErrorMsg('Credenciales inválidas. Verifique su email y contraseña.');
            }
        }
        // --- FIN DE LA LÓGICA DE SIMULACIÓN ---

        setIsLoading(false);
    };

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                // Estilo unificado
                background: 'linear-gradient(135deg, #e0f2fe 0%, #a7f3d0 100%)', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                py: 4
            }}
        >
            <Container maxWidth="xs">
                <Box 
                    sx={{ 
                        bgcolor: 'white', 
                        p: 4, 
                        borderRadius: 3, 
                        boxShadow: 6, 
                        textAlign: 'center' 
                    }}
                >
                    <img src={logo} alt="Logo ZenMediClick" style={{ width: '80px', marginBottom: '16px' }} />
                    <Typography variant="h5" sx={{ mb: 3, color: '#1e40af', fontWeight: 'bold' }}>Bienvenido de Nuevo</Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        
                        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

                        <TextField fullWidth required label="Email" name="email" type="email" value={form.email} onChange={handleInputChange} sx={{ mb: 2 }} />
                        
                        <TextField 
                            fullWidth 
                            required
                            label="Contraseña" 
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={form.password} 
                            onChange={handleInputChange} 
                            sx={{ mb: 3 }} 
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        
                        <Button 
                            fullWidth 
                            variant="contained" 
                            type="submit" 
                            sx={{ borderRadius: '50px', py: 1.5, bgcolor: '#1e40af', '&:hover': { bgcolor: '#102a80' } }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'INICIAR SESIÓN'}
                        </Button>
                        
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                            <Link component="button" onClick={() => navigate('/reset-password')} underline="hover" color="#3b82f6" sx={{ cursor: 'pointer', fontSize: '0.875rem' }}>
                                ¿Olvidaste la contraseña?
                            </Link>
                            <Link component="button" onClick={() => navigate('/registration')} underline="hover" color="#3b82f6" sx={{ cursor: 'pointer', fontSize: '0.875rem' }}>
                                Registrarme
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}