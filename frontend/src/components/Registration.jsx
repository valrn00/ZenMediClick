import { useState } from 'react';
import { 
    Container, 
    TextField, 
    Button, 
    Typography, 
    Box, 
    Alert, 
    CircularProgress,
    FormControlLabel, // Nuevo para envolver Checkbox
    Checkbox,
    Link,
    IconButton // Para el icono de visibilidad de contraseña
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment'; // Para el icono
import logo from '../assets/logo.png';

const API_REGISTER = "https://zenmediclick.onrender.com/auth/register";

export default function Registration() {
    const [form, setForm] = useState({ 
        nombre: '', 
        cedula: '', 
        email: '', 
        password: '', 
        rol: 'paciente', // Fijo: solo se permite auto-registro como paciente
        autorizacion: false 
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        // Validación de campos obligatorios
        if (!form.nombre || !form.cedula || !form.email || !form.password) {
            setErrorMsg('Todos los campos son obligatorios.');
            return false;
        }
        // Validación de email básico
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setErrorMsg('El formato del email no es válido.');
            return false;
        }
        // Validación de longitud mínima de contraseña (ej. 6 caracteres)
        if (form.password.length < 6) {
            setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
            return false;
        }
        if (!form.autorizacion) {
            setErrorMsg('Debes autorizar el tratamiento de datos para continuar.');
            return false;
        }
        setErrorMsg('');
        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            // Aseguramos que el rol siempre sea paciente para auto-registro
            const dataToSend = { ...form, rol: 'paciente' }; 
            
            const res = await fetch(API_REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
            
            const data = await res.json();

            if (res.ok && data.success) { 
                setSuccessMsg('Registro exitoso. Serás redirigido a Iniciar Sesión.');
                setTimeout(() => navigate('/login'), 2000); // Redirigir después de 2s
            } else {
                // Capturar errores del backend (ej. cédula o email ya existen)
                setErrorMsg(data.error || data.message || 'Error al registrarse. Intenta de nuevo.');
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            setErrorMsg('Error de conexión con el servidor. Por favor, verifica tu red.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
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
                    <Typography variant="h5" sx={{ mb: 3, color: '#1e40af', fontWeight: 'bold' }}>Crear Cuenta</Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        
                        {/* Mensajes de retroalimentación */}
                        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
                        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

                        <TextField 
                            fullWidth 
                            required
                            label="Nombre Completo" 
                            name="nombre"
                            value={form.nombre} 
                            onChange={handleInputChange} 
                            sx={{ mb: 2 }} 
                        />
                        <TextField 
                            fullWidth 
                            required
                            label="Cédula" 
                            name="cedula"
                            value={form.cedula} 
                            onChange={handleInputChange} 
                            sx={{ mb: 2 }} 
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Sugerir teclado numérico
                        />
                        <TextField 
                            fullWidth 
                            required
                            label="Email" 
                            name="email"
                            type="email"
                            value={form.email} 
                            onChange={handleInputChange} 
                            sx={{ mb: 2 }} 
                        />
                        
                        {/* Campo de Contraseña con visibilidad */}
                        <TextField 
                            fullWidth 
                            required
                            label="Contraseña" 
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={form.password} 
                            onChange={handleInputChange} 
                            sx={{ mb: 2 }} 
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
                        
                        {/* Se eliminó el Select de rol, el rol es fijo: Paciente */}
                        
                        {/* Checkbox de Autorización de Datos */}
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={form.autorizacion} 
                                    onChange={(e) => setForm({ ...form, autorizacion: e.target.checked })} 
                                    color="primary"
                                />
                            }
                            label={<Typography variant="body2">Autorizo el tratamiento de datos personales</Typography>}
                            sx={{ mb: 3 }}
                        />

                        <Button 
                            fullWidth 
                            variant="contained" 
                            type="submit" 
                            sx={{ borderRadius: '50px', py: 1.5, bgcolor: '#1e40af', '&:hover': { bgcolor: '#102a80' } }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'REGISTRARME'}
                        </Button>
                        
                        <Box sx={{ mt: 3 }}>
                            <Link component="button" onClick={() => navigate('/login')} underline="hover" color="#3b82f6" sx={{ cursor: 'pointer', fontSize: '0.875rem' }}>
                                ¿Ya tienes una cuenta? Inicia sesión
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}