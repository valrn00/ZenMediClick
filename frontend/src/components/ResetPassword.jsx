import { Container, TextField, Button, Typography, Box, Alert, CircularProgress, Link } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';

// Usamos la constante API para consistencia, asumiendo que el proceso.env.REACT_APP_API_URL apunta a la misma URL base
const API = "https://zenmediclick.onrender.com";

export default function ResetPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    
    // Nuevos estados para UX
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    const navigate = useNavigate();

    const resetStates = () => {
        setErrorMsg('');
        setSuccessMsg('');
        setIsLoading(false);
    };

    // ------------------------------------
    // PASO 1: ENVIAR TOKEN
    // ------------------------------------
    const sendToken = async () => {
        if (!email) {
            setErrorMsg("Por favor, ingresa tu dirección de email.");
            return;
        }

        setIsLoading(true);
        resetStates();

        try {
            await axios.post(`${API}/auth/reset-password`, { email });
            setSuccessMsg(`Se ha enviado un código de recuperación a ${email}. ¡Revisa tu bandeja de entrada!`);
            setStep(2);
        } catch (error) {
            console.error("Error al enviar token:", error);
            setErrorMsg(error.response?.data?.error || 'Error al solicitar el token. Email no encontrado o fallo en el servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    // ------------------------------------
    // PASO 2: CONFIRMAR Y RESTABLECER
    // ------------------------------------
    const confirm = async () => {
        if (!token || !password) {
            setErrorMsg("Por favor, ingresa el token y la nueva contraseña.");
            return;
        }

        setIsLoading(true);
        resetStates();

        try {
            const res = await axios.post(`${API}/auth/reset-password/confirm`, { token, new_password: password });
            
            if (res.status === 200 || res.status === 201) {
                setSuccessMsg('Contraseña restablecida exitosamente. Redirigiendo...');
                setTimeout(() => navigate('/login'), 2000); // Redirigir al login después del mensaje
            } else {
                 setErrorMsg('Respuesta inesperada del servidor.');
            }

        } catch (error) {
            console.error("Error al confirmar:", error);
            setErrorMsg(error.response?.data?.error || 'Token inválido o expirado. Vuelve a intentarlo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #e0f2fe 0%, #a7f3d0 100%)', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Container maxWidth="xs">
                <Box sx={{ 
                    bgcolor: 'white', 
                    p: 4, 
                    borderRadius: 3, 
                    boxShadow: 6, 
                    textAlign: 'center' 
                }}>
                    <img src={logo} alt="Logo ZenMediClick" style={{ width: '80px', marginBottom: '16px' }} />
                    <Typography variant="h5" sx={{ mb: 3, color: '#1e40af', fontWeight: 'bold' }}>Recuperar Contraseña</Typography>
                    
                    {/* Mensajes de Retroalimentación */}
                    {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
                    {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

                    {step === 1 ? (
                        <>
                            <Typography variant="body2" sx={{ mb: 3, color: '#6b7280' }}>
                                Ingresa tu email para recibir un código de recuperación.
                            </Typography>
                            <TextField 
                                fullWidth 
                                required
                                label="Email" 
                                type="email"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                sx={{ mb: 3 }} 
                                disabled={isLoading}
                            />
                            <Button 
                                fullWidth 
                                variant="contained" 
                                onClick={sendToken} 
                                sx={{ borderRadius: '50px', py: 1.5, bgcolor: '#1e40af', '&:hover': { bgcolor: '#102a80' } }}
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Token'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="body2" sx={{ mb: 3, color: '#6b7280' }}>
                                Ingresa el token que recibiste y tu nueva contraseña.
                            </Typography>
                            <TextField 
                                fullWidth 
                                required
                                label="Token de Recuperación" 
                                value={token} 
                                onChange={(e) => setToken(e.target.value)} 
                                sx={{ mb: 2 }} 
                                disabled={isLoading}
                            />
                            <TextField 
                                fullWidth 
                                required
                                label="Nueva Contraseña" 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                sx={{ mb: 3 }} 
                                disabled={isLoading}
                            />
                            <Button 
                                fullWidth 
                                variant="contained" 
                                onClick={confirm} 
                                sx={{ borderRadius: '50px', py: 1.5, bgcolor: '#1e40af', '&:hover': { bgcolor: '#102a80' } }}
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Restablecer Contraseña'}
                            </Button>
                        </>
                    )}
                    
                    <Box sx={{ mt: 3 }}>
                        {/* Enlace para volver si el usuario recuerda la contraseña */}
                        <Link component="button" onClick={() => navigate('/login')} underline="hover" color="#3b82f6" sx={{ cursor: 'pointer', fontSize: '0.875rem' }}>
                            Volver a Iniciar Sesión
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}