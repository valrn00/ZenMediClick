import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Registro from './components/Registro';
import PacienteDashboard from './components/PacienteDashboard';
import MedicoDashboard from './components/MedicoDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState(null); // Estado para el rol del usuario
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="App">
        <Navbar userRole={userRole} setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<h1>Bienvenido a ZenMediClick</h1>} />
          <Route path="/login" element={<Login setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/paciente"
            element={isAuthenticated && userRole === 'paciente' ? <PacienteDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/medico"
            element={isAuthenticated && userRole === 'medico' ? <MedicoDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={isAuthenticated && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;