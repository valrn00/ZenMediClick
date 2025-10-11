import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { Registration } from './components/Registration';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';

function App() {
  const { user, token } = useAuth();
  console.log('App - User:', user, 'Token:', token);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!token ? <Registration /> : <Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={token ? (
            user?.rol === 'Paciente' ? <PatientDashboard /> :
            user?.rol === 'Medico' ? <DoctorDashboard /> :
            user?.rol === 'Administrador' ? <AdminDashboard /> : <Navigate to="/login" />
          ) : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;