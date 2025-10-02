import { Link, useNavigate } from 'react-router-dom';

function Navbar({ userRole, setUserRole, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <header>
      <h1>ZenMediClick</h1>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          {!userRole && <li><Link to="/registro">Registro</Link></li>}
          {!userRole && <li><Link to="/login">Login</Link></li>}
          {userRole === 'paciente' && <li><Link to="/paciente">Dashboard Paciente</Link></li>}
          {userRole === 'medico' && <li><Link to="/medico">Dashboard Médico</Link></li>}
          {userRole === 'admin' && <li><Link to="/admin">Dashboard Admin</Link></li>}
          {userRole && <li><button onClick={handleLogout}>Logout</button></li>}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;