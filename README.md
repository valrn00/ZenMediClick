````markdown
# 🏥 ZenMediClick: Plataforma de Agendamiento Médico

## ✨ Título y Propósito

**ZenMediClick** es una plataforma web innovadora diseñada para optimizar el agendamiento de citas médicas en Instituciones Prestadoras de Servicios de Salud (IPS) privadas.

El proyecto está estructurado para ofrecer tres roles principales: **Administrador**, **Médico** y **Paciente**, asegurando una gestión eficiente desde la definición de disponibilidad hasta la cancelación y consulta de historial.

### ⚠️ CONTEXTO CLAVE: PROYECTO EN MODO DE SIMULACIÓN

> Para esta entrega, el proyecto se ejecuta en modo de **simulación de *frontend* (Single Page Application - SPA)**.
>
> **La persistencia de datos (usuarios, citas, consultorios) se maneja exclusivamente a través del `localStorage` del navegador,** replicando la respuesta de un *backend* real.
>
> Los módulos de servidor (FastAPI/PHP) y la base de datos (MySQL) están desactivados para la simulación, pero su estructura lógica es la base de los casos de prueba de integración.

---

## 🛠️ Tecnologías Utilizadas

El proyecto fue desarrollado bajo una arquitectura orientada a componentes, utilizando las siguientes tecnologías:

| Componente | Tecnología | Versión Base |
| :--- | :--- | :--- |
| **Frontend (Core)** | **React** (Capa de Presentación) | v18.x / v19.x |
| **Lenguaje** | JavaScript (o TypeScript) | ES6+ |
| **Estilo** | CSS, SCSS o Tailwind CSS | N/A |
| **Persistencia** | **`localStorage`** (MOCK de BD) | N/A |
| *Backend* (Estructura Original) | *FastAPI / PHP* | v3.x / v8.x |
| *Base de Datos* (Estructura Original) | *MySQL* | v8.x |

---

## 🚀 Requisitos y Ejecución (Modo Simulación)

### Requisitos Previos

* Node.js (LTS recomendado).
* npm o Yarn (Gestor de paquetes).
* Un navegador web moderno (Chrome/Firefox/Edge).

### 1. Instalación de Dependencias

Clonar el repositorio y descargar los paquetes del *frontend*:

```bash
git clone 
cd ZenMediClick
npm install
# o
yarn install
````

### 2\. Ejecución (Simulación `localStorage`)

Para iniciar la aplicación en modo desarrollo y simulación:

```bash
npm start
# o
yarn start
```

La aplicación se abrirá automáticamente en `http://localhost:3000/`.

### 3\. Simulación de Roles (Setup Inicial)

Para probar los diferentes roles en modo simulación, el *frontend* debe inicializar las claves en el `localStorage`.

1.  **Abrir el navegador** y dirigirse a la URL.
2.  **Abrir la Consola de Desarrollador** (F12) y seleccionar la pestaña **"Application"** -\> **"Local Storage"**.
3.  **Registrar un usuario Paciente** usando el formulario (`/register`) para crear el *mock* inicial de datos. Este registro almacenará la clave `usuarios` o `user_data`.
4.  **Para probar otros roles (Admin/Médico):** Utilice las credenciales de prueba predefinidas en el código de simulación.

-----

## 🔑 Funcionalidades Principales

El sistema está organizado para dar soporte a los siguientes procesos clave, validados en los Casos de Prueba de Integración (`INT-001` a `INT-013`):

| Módulo | Funcionalidades | Rol que accede | CP ID de Validación |
| :--- | :--- | :--- | :--- |
| **Autenticación** | Registro, Login (Paciente, Médico, Admin). | Todos | INT-001, INT-002, INT-006 |
| **Agendamiento** | Selección de médico, día y hora. | Paciente | INT-004 |
| **Gestión de Citas** | Visualización de historial, Cancelación de citas. | Paciente, Médico | INT-003, INT-005, INT-007 |
| **Administración** | CRUD de Usuarios (Crear Médico), CRUD de Consultorios. | Administrador | INT-009, INT-010, INT-011, INT-012 |
| **Disponibilidad** | Definición y modificación de franjas horarias. | Médico | INT-013 |

-----

## 🛡️ Estándares de Calidad y Contribución

Se han implementado rigurosas prácticas de calidad para garantizar la mantenibilidad y colaboración del código.

### Estilo de Código

  * **Regla:** Convención **`camelCase`** para variables y funciones.
  * **Regla:** **2 espacios** para indentación.
  * **Herramientas:** Uso de **ESLint** y **Prettier** configurados para asegurar la uniformidad automática del código.

### Control de Versiones (Git Flow)

Se sigue una convención de *commits* y flujo de ramas estricta:

| Tipo de Commit | Prefijo | Descripción |
| :--- | :--- | :--- |
| **Funcionalidad** | `feat:` | Desarrollo de una nueva característica (ej. `feat: agregar formulario de registro`). |
| **Corrección** | `fix:` | Solución de un *bug* (ej. `fix: error al cancelar cita`). |
| **Documentación** | `docs:` | Actualizaciones al `README` o documentación interna. |
| **Refactorización** | `refactor:` | Mejoras al código sin cambiar la funcionalidad. |

El flujo de trabajo se basa en **Git Flow simplificado**, utilizando ramas `main` para el código estable, y ramas `backend/` o `frontend/` para el desarrollo.

### Métricas de Proceso (PSP/TSP)

Se ha establecido una **Línea Base** para la gestión de tiempo y defectos, documentada en:

  * **Brecha Estimación vs. Real (A/E):** Medida para mejorar la predictibilidad de las estimaciones futuras.
  * **Tasa de Defectos (Yield):** Controlando la calidad del código entregado antes de la integración.

-----

**Hecho con ❤️ por el Equipo ZenMediClick.**

```
```
