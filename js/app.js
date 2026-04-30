const form = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");

// ============================
// REGISTRO DE USUARIO
// ============================
if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    let nombre = document.getElementById("nombre").value.trim();
    let email = document.getElementById("email").value.trim();
    let cuenta = document.getElementById("cuenta").value.trim();
    let password = document.getElementById("password").value;

    // Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cuentaRegex = /^\d{9}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    // Sanitización básica
    const limpiar = (texto) => texto.replace(/<.*?>/g, "");

    nombre = limpiar(nombre);
    email = limpiar(email);

    // Validaciones
    if (!nombre || (!email && !cuenta) || !password) {
      return mostrarError("Todos los campos son obligatorios");
    }

    if (email && !emailRegex.test(email)) {
      return mostrarError("Correo inválido");
    }

    if (email && !email.endsWith("@aragon.unam.mx") && !email.endsWith("@unam.mx")) {
      return mostrarError("Solo correos institucionales UNAM");
    }

    if (cuenta && !cuentaRegex.test(cuenta)) {
      return mostrarError("Número de cuenta inválido");
    }

    if (!passwordRegex.test(password)) {
      return mostrarError("Contraseña insegura (mayúscula, número y símbolo)");
    }

    // Guardar usuario en localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    usuarios.push({
      nombre,
      email,
      cuenta,
      password
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mostrarExito("Usuario registrado correctamente ✔");
    form.reset();
  });
}

// ============================
// UI MENSAJES
// ============================
function mostrarError(msg) {
  if (!mensaje) return;
  mensaje.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
}

function mostrarExito(msg) {
  if (!mensaje) return;
  mensaje.innerHTML = `<div class="alert alert-success">${msg}</div>`;
}

// ============================
// SESIÓN Y BOTÓN PERFIL
// ============================
function actualizarBotonSesion() {
  const authArea = document.getElementById("authArea");
  if (!authArea) return;

  const sesion = JSON.parse(localStorage.getItem("sesion"));

  if (sesion) {
    authArea.innerHTML = `
  <div class="dropdown me-3">
    <button class="btn btn-light btn-sm dropdown-toggle" data-bs-toggle="dropdown">
      Perfil
    </button>

    <ul class="dropdown-menu perfil-dropdown dropdown-menu-end">
      <li class="px-3 py-2">
        <div class="fw-bold text-wrap">${sesion.nombre}</div>
        <div class="small text-muted text-wrap">${sesion.email}</div>
      </li>

      <li><hr class="dropdown-divider"></li>

      <li>
        <button class="dropdown-item" id="cerrarSesion">
          Cerrar sesión
        </button>
      </li>
    </ul>
  </div>
`;

    document.getElementById("cerrarSesion").addEventListener("click", () => {
      localStorage.removeItem("sesion");
      location.reload();
    });

  } else {
    authArea.innerHTML = `
      <button class="btn btn-light btn-sm" data-bs-toggle="modal" data-bs-target="#loginModal">
        Iniciar sesión
      </button>
    `;
  }
}

// Ejecutar cuando cargue el DOM
document.addEventListener("DOMContentLoaded", actualizarBotonSesion);