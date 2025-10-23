import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Registration } from './components/Registration';
import { ResetPassword } from './components/ResetPassword';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard'; // Renombrado de developerDashboard

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1. PÁGINA PRINCIPAL: Landing (antes del login) */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. AUTENTICACIÓN */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* 3. DASHBOARD PROTEGIDO POR ROL */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <RoleBasedDashboard />
              </PrivateRoute>
            }
          />

          {/* 4. REDIRECCIÓN POR DEFECTO */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Ruta protegida (SENA: useAuth)
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Dashboard según rol (SENA: lógica en hook)
const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (user?.rol === 'Paciente') return <PatientDashboard />;
  if (user?.rol === 'Medico') return <DoctorDashboard />;
  if (user?.rol === 'Administrador') return <AdminDashboard />;

  return <Navigate to="/login" />;
};

export default App;