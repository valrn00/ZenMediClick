import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Registration from './components/Registration';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import MainLayout from './components/MainLayout';

/**
 * Componente de protección de ruta
 * Verifica si el usuario está logueado (existe 'currentUser') y si su rol coincide con el requerido.
 * @param {string} roleRequired - El rol que se requiere para acceder a la ruta.
 * @param {React.Component} element - El componente a renderizar si el usuario tiene permiso.
 */
const ProtectedRoute = ({ roleRequired, element }) => {
    // Usamos 'currentUser' tal como lo guardamos en Login.jsx
    const userJson = localStorage.getItem('currentUser');
    const user = userJson ? JSON.parse(userJson) : null;
    
    // Si no hay usuario logueado, redirige a login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si el usuario existe pero el rol no coincide, muestra un mensaje de error (o puedes redirigir a una página de error)
    if (roleRequired && user.rol !== roleRequired) {
        return <Navigate to="/login" replace />; 
        // Alternativamente: return <Navigate to="/unauthorized" replace />;
    }

    // Si todo es correcto, renderiza el componente dentro del layout
    return <MainLayout>{element}</MainLayout>;
};


function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        {/* Agrega una ruta de reset-password si tienes el componente */}
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}

        {/* Rutas Protegidas (Dashboard por Rol) */}
        
        <Route 
            path="/patient-dashboard" 
            element={<ProtectedRoute roleRequired="paciente" element={<PatientDashboard />} />} 
        />
        
        <Route 
            path="/doctor-dashboard" 
            element={<ProtectedRoute roleRequired="medico" element={<DoctorDashboard />} />} 
        />
        
        <Route 
            path="/admin-dashboard" 
            element={<ProtectedRoute roleRequired="admin" element={<AdminDashboard />} />} 
        />

        {/* Manejo de rutas no encontradas (404) */}
        <Route path="*" element={<Navigate to="/" />} /> 
      </Routes>
    </Router>
  );
}

export default App;