import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Route path="/register" element={<Registration />} />
        <Route 
          path="/dashboard" 
          element={
            <MainLayout>
              {(() => {
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                if (!user) return <Login />;
                if (user.rol === 'Paciente') return <PatientDashboard />;
                if (user.rol === 'Medico') return <DoctorDashboard />;
                if (user.rol === 'Administrador') return <AdminDashboard />;
                return <div>No tienes permisos</div>;
              })()}
            </MainLayout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;