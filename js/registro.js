const form = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  let nombre = document.getElementById("nombre").value.trim();
  let email = document.getElementById("email").value.trim();
  let cuenta = document.getElementById("cuenta").value.trim();
  let password = document.getElementById("password").value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cuentaRegex = /^\d{9}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!nombre || (!email && !cuenta) || !password) {
    return mostrarError("Completa todos los campos");
  }

  if (email && !emailRegex.test(email)) {
    return mostrarError("Correo inválido");
  }

  if (email && !email.endsWith("@unam.mx")) {
    return mostrarError("Solo correos UNAM");
  }

  if (cuenta && !cuentaRegex.test(cuenta)) {
    return mostrarError("Cuenta inválida");
  }

  if (!passwordRegex.test(password)) {
    return mostrarError("Contraseña insegura");
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const existe = usuarios.find(u => 
    u.email === email || u.cuenta === cuenta
  );

  if (existe) {
    return mostrarError("Usuario ya registrado");
  }

  usuarios.push({ nombre, email, cuenta, password });

  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  mostrarExito("Registro exitoso ✔");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});

function mostrarError(msg) {
  mensaje.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
}

function mostrarExito(msg) {
  mensaje.innerHTML = `<div class="alert alert-success">${msg}</div>`;
}