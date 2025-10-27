// Login.jsx (ejemplo simple)
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/login', {
        cedula,
        password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMsg('Login exitoso!');
      // Redirigir o recargar
    } catch (err) {
      setMsg(err.response?.data?.detail || 'Error');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input placeholder="Cédula" value={cedula} onChange={e => setCedula(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      <p>{msg}</p>
    </form>
  );
}