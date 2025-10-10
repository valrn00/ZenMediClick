import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { Registration } from './components/Registration';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
// ...
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { citasService, useAuth } from './hooks/useAuth';

  function App() {
    const { user } = useAuth();
    return (
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Registration /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? (
            user.rol === 'paciente' ? <PatientDashboard /> :
              user.rol === 'medico' ? <DoctorDashboard /> :
                user.rol === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />
          ) : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }
  export default App;