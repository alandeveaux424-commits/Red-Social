const form = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");

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

  if (email && !email.endsWith("@unam.mx")) {
    return mostrarError("Solo correos institucionales UNAM");
  }

  if (cuenta && !cuentaRegex.test(cuenta)) {
    return mostrarError("Número de cuenta inválido");
  }

  if (!passwordRegex.test(password)) {
    return mostrarError("Contraseña insegura (usa mayúscula, número y símbolo)");
  }

  mostrarExito("Validación exitosa ✔");
});

// UI
function mostrarError(msg) {
  mensaje.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
}

function mostrarExito(msg) {
  mensaje.innerHTML = `<div class="alert alert-success">${msg}</div>`;
}