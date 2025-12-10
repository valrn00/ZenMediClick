import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Registration from './components/Registration';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        {/* MODIFICACIÓN CLAVE: Cambiamos /register por /registration */}
        <Route path="/registration" element={<Registration />} />

        <Route
          path="/dashboard"
          element={
            // Aquí puedes añadir la protección de token para que no cargue si no hay token
            <MainLayout>
              {(() => {
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                const token = localStorage.getItem('token'); // Verificamos el token

                if (!token) return <Navigate to="/login" replace />; // Usamos Navigate para una redirección limpia

                if (user && user.rol === 'paciente') return <PatientDashboard />;
                if (user && user.rol === 'doctor') return <DoctorDashboard />;
                if (user && user.rol === 'admin') return <AdminDashboard />;

                // Si hay token pero el rol no está definido (o no es uno esperado)
                return <div>No tienes permisos de acceso o tu rol es desconocido.</div>;
              })()}
            </MainLayout>
          }
        />
        {/* Puedes añadir una ruta para el caso en que el token exista pero no la información del usuario */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;