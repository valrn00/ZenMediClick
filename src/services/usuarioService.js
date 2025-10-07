export const usuarioService = {
  async loginUsuario({ email, password, rol }) {
    // Mock; real: axios.post('/api/login')
    return { data: { user: { email, rol }, token: 'mock' } };
  },
  async registerUsuario({ nombre, apellido, email, password }) {
    // Mock IPS auto-asociada
    return { data: { success: true, ips: 'IPS Ejemplo' } };
  }
};