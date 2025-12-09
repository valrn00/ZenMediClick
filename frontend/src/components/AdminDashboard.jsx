import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";

const API = "http://localhost:8000/admin";

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [citas, setCitas] = useState([]);

  // formulario crear usuario
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    rol: "",
  });

  // -------------------------------
  //       CARGAR DATOS
  // -------------------------------
  useEffect(() => {
    cargarUsuarios();
    cargarConsultorios();
    cargarDisponibilidad();
    cargarCitas();
  }, []);

  const cargarUsuarios = async () => {
    const r = await fetch(`${API}/usuarios`);
    setUsuarios(await r.json());
  };

  const cargarConsultorios = async () => {
    const r = await fetch(`${API}/consultorios`);
    setConsultorios(await r.json());
  };

  const cargarDisponibilidad = async () => {
    const r = await fetch(`${API}/disponibilidad`);
    setDisponibilidad(await r.json());
  };

  const cargarCitas = async () => {
    const r = await fetch(`${API}/citas`);
    setCitas(await r.json());
  };

  // -------------------------------
  //   CREAR USUARIO (POST)
  // -------------------------------
  const crearUsuario = async () => {
    await fetch(`${API}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario),
    });

    cargarUsuarios();

    setNuevoUsuario({ nombre: "", email: "", rol: "" });
  };

  // -------------------------------
  //   ELIMINAR USUARIO (DELETE)
  // -------------------------------
  const eliminarUsuario = async (id) => {
    await fetch(`${API}/usuarios/${id}`, { method: "DELETE" });
    cargarUsuarios();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: "#1e40af" }}>
        Panel de Administración
      </Typography>

      {/* ---------- USUARIOS ---------- */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Gestión de Usuarios
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Nombre"
                value={nuevoUsuario.nombre}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Email"
                value={nuevoUsuario.email}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Rol (admin/doctor/paciente)"
                value={nuevoUsuario.rol}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={crearUsuario}
                sx={{ height: "100%" }}
              >
                Crear Usuario
              </Button>
            </Grid>
          </Grid>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.rol}</TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => eliminarUsuario(u.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ---------- CONSULTORIOS ---------- */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6">Consultorios</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {consultorios.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.nombre}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ---------- DISPONIBILIDAD ---------- */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6">Disponibilidad Médica</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Doctor</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora Inicio</TableCell>
                <TableCell>Hora Fin</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {disponibilidad.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.doctor_id}</TableCell>
                  <TableCell>{d.fecha}</TableCell>
                  <TableCell>{d.hora_inicio}</TableCell>
                  <TableCell>{d.hora_fin}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ---------- CITAS ---------- */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6">Citas Registradas</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {citas.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.paciente_id}</TableCell>
                  <TableCell>{c.doctor_id}</TableCell>
                  <TableCell>{c.fecha}</TableCell>
                  <TableCell>{c.hora}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}