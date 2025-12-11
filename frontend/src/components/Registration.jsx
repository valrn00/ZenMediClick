import { useState } from 'react';
import { 
    Container, 
    TextField, 
    Button, 
    Typography, 
    Box, 
    Alert, 
    CircularProgress,
    FormControlLabel, 
    Checkbox,
    Link,
    IconButton,
    // --- NUEVAS IMPORTACIONES PARA EL SELECT ---
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem
    // --- FIN NUEVAS IMPORTACIONES ---
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment'; 
// Asumiendo que esta ruta es correcta en tu proyecto
import logo from '../assets/logo.png'; 

// --- CONFIGURACIÓN DE SIMULACIÓN ---
const SIMULATE_SUCCESS = true; 
const API_REGISTER = "http://localhost:8000/auth/register";

// Usaremos 'medico' en lugar de 'doctor' para el rol para que coincida con el Select
// También añadimos especialidad, aunque el Select no lo pide en el diseño actual, 
// la simulación lo guardará si se añade el campo después.
// Por ahora, solo usamos los campos presentes en el formulario.
export default function Registration() {
    const [form, setForm] = useState({ 
        nombre: '', 
        cedula: '', 
        email: '', 
        password: '', 
        rol: 'paciente', // Valor por defecto
        autorizacion: false,
        especialidad: '' // Añadido para futura expansión del rol 'medico'
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validateForm = () => {
        // Se mantiene la validación de campos obligatorios, email, password y autorización
        if (!form.nombre || !form.cedula || !form.email || !form.password) {
            setErrorMsg('Todos los campos son obligatorios.');
            return false;
        }
        if (!/^\d+$/.test(form.cedula)) {
            setErrorMsg('La cédula solo debe contener números.');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setErrorMsg('El formato del email no es válido.');
            return false;
        }
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

        // --- LÓGICA DE SIMULACIÓN (Usando localStorage y RF01) ---
        if (SIMULATE_SUCCESS) {
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

            // Objeto de nuevo usuario con campos para la simulación
            const newUser = {
                id: Date.now().toString(), // Usamos string para el ID
                nombre: form.nombre,
                cedula: form.cedula,
                email: form.email,
                password: form.password, 
                rol: form.rol, 
                especialidad: form.rol === 'medico' ? form.especialidad : undefined,
            };
            
            // Simular Validaciones de Único (RF01)
            const emailExists = storedUsers.some(user => user.email === newUser.email);
            const cedulaExists = storedUsers.some(user => user.cedula === newUser.cedula);

            if (emailExists) {
                setErrorMsg(`El email ya está registrado.`);
                setIsLoading(false);
                return;
            }

            if (cedulaExists) {
                setErrorMsg(`La cédula ya está registrada.`);
                setIsLoading(false);
                return;
            }

            // Guardar usuario
            storedUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
            
            setSuccessMsg(`✅ Registro de ${form.rol} exitoso (SIMULADO). Serás redirigido a Iniciar Sesión.`);
            setIsLoading(false);
            
            // Redirigir
            setTimeout(() => navigate('/login'), 2000); 
            return; 
        }
        // --- FIN DE LA LÓGICA DE SIMULACIÓN ---

        // --- CÓDIGO DEL BACKEND REAL (Mantenido) ---
        try {
            const dataToSend = { 
                nombre: form.nombre, 
                cedula: form.cedula,
                email: form.email, 
                password: form.password,
                rol: form.rol
            }; 
            
            const res = await fetch(API_REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
            
            if (res.ok) {
                 const data = await res.json();
                 setSuccessMsg('Registro exitoso. Inicia sesión.');
                 setTimeout(() => navigate('/login'), 2000); 
            } else {
                 const errorData = await res.json();
                 setErrorMsg(errorData.message || 'Error en el registro.');
            }
        } catch (error) {
            setErrorMsg('Error de conexión con el servidor.');
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
                        
                        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
                        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

                        <TextField fullWidth required label="Nombre Completo" name="nombre" value={form.nombre} onChange={handleInputChange} sx={{ mb: 2 }} />
                        <TextField fullWidth required label="Cédula" name="cedula" value={form.cedula} onChange={handleInputChange} sx={{ mb: 2 }} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
                        
                        {/* --- SELECTOR DE ROL AÑADIDO (Conservado) --- */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="rol-label">Rol</InputLabel>
                            <Select
                                labelId="rol-label"
                                id="rol"
                                name="rol"
                                value={form.rol}
                                label="Rol"
                                onChange={handleInputChange}
                            >
                                <MenuItem value="paciente">Paciente</MenuItem>
                                <MenuItem value="medico">Médico</MenuItem>
                            </Select>
                        </FormControl>
                        {/* --- FIN SELECTOR DE ROL --- */}

                        {/* Campo de Especialidad (Si el rol es médico) */}
                        {form.rol === 'medico' && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="especialidad-label">Especialidad</InputLabel>
                                <Select
                                    labelId="especialidad-label"
                                    name="especialidad"
                                    value={form.especialidad}
                                    label="Especialidad"
                                    onChange={handleInputChange}
                                >
                                    {/* Opciones de especialidad simuladas */}
                                    <MenuItem value="Medicina General">Medicina General</MenuItem>
                                    <MenuItem value="Pediatria">Pediatría</MenuItem>
                                    <MenuItem value="Cardiologia">Cardiología</MenuItem>
                                    <MenuItem value="Ginecologia">Ginecología</MenuItem>
                                </Select>
                            </FormControl>
                        )}


                        <TextField fullWidth required label="Email" name="email" type="email" value={form.email} onChange={handleInputChange} sx={{ mb: 2 }} />
                        
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