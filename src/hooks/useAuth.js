export const citasService = {
  async getCitas() { return { data: [] }; },
  async agendarCita(cita) { return { data: { success: true } }; },
  async actualizarCita(id, data) { return { data: { success: true } }; },
  async eliminarCita(id) { return { data: { success: true } }; }
};