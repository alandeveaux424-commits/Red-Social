const mensaje = document.getElementById("mensaje");

const formRegistro = document.getElementById("formRegistro");

if (formRegistro) {
  formRegistro.addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const cuenta = document.getElementById("cuenta").value;
    const password = document.getElementById("password").value;

    const datos = new FormData();
    datos.append("nombre", nombre);
    datos.append("email", email);
    datos.append("cuenta", cuenta);
    datos.append("password", password);

    fetch("/RedSocial/php/registro.php", {
      method: "POST",
      body: datos
    })
    .then(res => res.text())
    .then(text => {
      console.log("RESPUESTA:", text);

      try {
        const data = JSON.parse(text);

        mensaje.innerHTML = `
          <div class="alert alert-${data.status === "success" ? "success" : "danger"}">
            ${data.message}
          </div>
        `;
      } catch {
        mostrarError("Respuesta inválida del servidor");
      }
    })
    .catch(error => {
      console.error("ERROR:", error);
      mostrarError("Error de conexión");
    });
  });
}

const formLogin = document.getElementById("formLogin");

if (formLogin) {
  formLogin.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const user = usuarios.find(u => u.email === email);

    if (!user) {
      return mostrarError("Usuario no encontrado");
    }

    localStorage.setItem("sesion", JSON.stringify(user));

    actualizarBotonSesion();
  });
}

function mostrarError(msg) {
  if (!mensaje) return;
  mensaje.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
}
function actualizarBotonSesion() {
  const authArea = document.getElementById("authArea");
  if (!authArea) return;

  const sesion = JSON.parse(localStorage.getItem("sesion"));

  if (sesion) {
    authArea.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-light btn-sm dropdown-toggle" data-bs-toggle="dropdown">
          Perfil
        </button>

        <ul class="dropdown-menu dropdown-menu-end" style="min-width:250px;">
          <li class="px-3 py-2">
            <strong>${sesion.nombre}</strong><br>
            <small>${sesion.email}</small>
          </li>

          <li><hr></li>

          <li>
            <button class="dropdown-item" id="logout">Cerrar sesión</button>
          </li>
        </ul>
      </div>
    `;

    document.getElementById("logout").addEventListener("click", () => {
      localStorage.removeItem("sesion");
      location.reload();
    });
  }
}

document.addEventListener("DOMContentLoaded", actualizarBotonSesion);
