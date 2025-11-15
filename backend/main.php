<?php
// backend/main.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

$conn = new mysqli("localhost", "root", "", "zenmediclick", 3306);
if ($conn->connect_error) die(json_encode(["error" => "DB Error"]));

$conn->query("INSERT IGNORE INTO ips (nombre) VALUES ('ZenMediClick IPS')");

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$base = '/backend/main.php';

function send($data) { echo json_encode($data); exit; }
function getUser($conn) {
    $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!$token) return null;
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $user;
}

// === HU1: REGISTER ===
if ($path === "$base/register" && $method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $rol = $data['rol'] ?? 'Paciente';

    if ($rol === 'Administrador') {
        $count = $conn->query("SELECT COUNT(*) as c FROM usuarios WHERE rol = 'Administrador'")->fetch_assoc()['c'];
        if ($count >= 2) send(["error" => "Máximo 2 admins"]);
        if (!in_array($data['email'], ['valrn00@gmail.com', 'nbayona000@gmail.com'])) send(["error" => "Email no autorizado"]);
    }

    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, cedula, email, password, rol) VALUES (?, ?, ?, ?, ?)");
    $pass = password_hash($data['password'], PASSWORD_BCRYPT);
    $stmt->bind_param("sssss", $data['nombre'], $data['cedula'], $data['email'], $pass, $rol);
    $stmt->execute();
    $id = $stmt->insert_id;
    $stmt->close();

    if ($rol === 'Paciente') $conn->query("INSERT INTO pacientes (id_usuario) VALUES ($id)");
    if ($rol === 'Medico') $conn->query("INSERT INTO medicos (id_usuario, especialidad, id_ips) VALUES ($id, 'General', 1)");

    send(["success" => true, "user_id" => $id]);
}

// === LOGIN ===
if ($path === "$base/login" && $method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['cedula'] ?? $data['email'];

    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE cedula = ? OR email = ?");
    $stmt->bind_param("ss", $id, $ $id);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($user && password_verify($data['password'], $user['password'])) {
        $token = bin2hex(random_bytes(32));
        $conn->prepare("UPDATE usuarios SET token = ? WHERE id = ?")->execute([$token, $user['id']]);
        send([
            "success" => true,
            "token" => $token,
            "user" => ["id" => $user['id'], "nombre" => $user['nombre'], "rol" => $user['rol']]
        ]);
    } else {
        send(["error" => "Credenciales inválidas"]);
    }
}

// === HU3: AGENDAR CITA ===
if ($path === "$base/citas" && $method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $user = getUser($conn);
    if (!$user || $user['rol'] !== 'Paciente') send(["error" => "No autorizado"]);

    $stmt = $conn->prepare("INSERT INTO citas (fecha, hora, motivo, id_paciente, id_medico, id_consultorio, estado) VALUES (?, ?, ?, ?, ?, 1, 'Pendiente')");
    $stmt->bind_param("sssii", $data['fecha'], $data['hora'], $data['motivo'], $user['id'], $data['id_medico']);
    $stmt->execute();
    send(["success" => true]);
}

// === HU6: VER CITAS ===
if ($path === "$base/citas" && $method === 'GET') {
    $user = getUser($conn);
    if (!$user) send(["error" => "No autorizado"]);
    $res = $conn->query("SELECT c.*, m.especialidad FROM citas c LEFT JOIN medicos m ON c.id_medico = m.id_usuario WHERE c.id_paciente = " . $user['id']);
    $citas = [];
    while ($row = $res->fetch_assoc()) $citas[] = $row;
    send($citas);
}

// === HU7: CANCELAR CITA ===
if ($path === "$base/citas/cancelar" && $method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $conn->query("UPDATE citas SET estado = 'Cancelada' WHERE id = " . $data['id']);
    send(["success" => true]);
}

// === HU5: OBSERVACIONES ===
if ($path === "$base/observaciones" && $method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("INSERT INTO observaciones (contenido, id_cita) VALUES (?, ?)");
    $stmt->bind_param("si", $data['contenido'], $data['id_cita']);
    $stmt->execute();
    send(["success" => true]);
}

// === DOCTOR: CITAS HOY ===
if ($path === "$base/citas/medico" && $method === 'GET') {
    $user = getUser($conn);
    if (!$user || $user['rol'] !== 'Medico') send(["error" => "No autorizado"]);
    $hoy = date('Y-m-d');
    $res = $conn->query("SELECT c.id, u.nombre, c.hora, c.motivo FROM citas c JOIN pacientes p ON c.id_paciente = p.id_usuario JOIN usuarios u ON p.id_usuario = u.id WHERE c.id_medico = {$user['id']} AND DATE(c.fecha) = '$hoy'");
    $citas = [];
    while ($row = $res->fetch_assoc()) $citas[] = $row;
    send($citas);
}

// === ADMIN: USUARIOS ===
if ($path === "$base/users" && $method === 'GET') {
    $user = getUser($conn);
    if (!$user || $user['rol'] !== 'Administrador') send(["error" => "No autorizado"]);
    $res = $conn->query("SELECT id, nombre, rol FROM usuarios");
    $users = [];
    while ($row = $res->fetch_assoc()) $users[] = $row;
    send($users);
}

// === ADMIN: ELIMINAR USUARIO ===
if (preg_match("#^$base/users/(\d+)$#", $path, $m) && $method === 'DELETE') {
    $user = getUser($conn);
    if (!$user || $user['rol'] !== 'Administrador') send(["error" => "No autorizado"]);
    $id = $m[1];
    $conn->query("DELETE FROM usuarios WHERE id = $id");
    send(["success" => true]);
}

// === HU9: RECORDATORIO (REAL CON mail()) ===
if ($path === "$base/recordatorio" && $method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $to = $data['email'];
    $subject = "Recordatorio de Cita - ZenMediClick";
    $message = "Tu cita está programada para mañana. ¡No olvides asistir!";
    $headers = "From: no-reply@zenmediclick.com";

    if (mail($to, $subject, $message, $headers)) {
        send(["success" => true]);
    } else {
        send(["error" => "Error al enviar email"]);
    }
}

// === HU14: GENERAR PDF (REAL CON jsPDF EN FRONTEND) → YA ESTÁ EN PatientDashboard.jsx

// === HU15: BACKUP (REAL CON mysqldump) ===
if ($path === "$base/backup" && $method === 'GET') {
    $backup_file = "zenmediclick_backup_" . date('Ymd_His') . ".sql";
    $command = "mysqldump --user=root --password= --host=localhost zenmediclick > /path/to/backups/$backup_file";
    system($command);
    send(["success" => true, "file" => $backup_file]);
}

// === HU16: ESTADÍSTICAS ===
if ($path === "$base/estadisticas" && $method === 'GET') {
    $total = $conn->query("SELECT COUNT(*) as total FROM citas")->fetch_assoc()['total'];
    $pendientes = $conn->query("SELECT COUNT(*) as total FROM citas WHERE estado = 'Pendiente'")->fetch_assoc()['total'];
    $canceladas = $conn->query("SELECT COUNT(*) as total FROM citas WHERE estado = 'Cancelada'")->fetch_assoc()['total'];
    send(["total" => $total, "pendientes" => $pendientes, "canceladas" => $canceladas]);
}

send(["message" => "API lista"]);
?>