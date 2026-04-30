const form = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const input = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuario = usuarios.find(u =>
    (u.email === input || u.cuenta === input) &&
    u.password === password
  );

  if (usuario) {
    mostrarExito("Bienvenido " + usuario.nombre + " ✔");

    localStorage.setItem("sesion", JSON.stringify(usuario));

    setTimeout(() => {
      alert("Aquí iría el feed 😎");
    }, 1000);

  } else {
    mostrarError("Datos incorrectos");
  }
});

function mostrarError(msg) {
  mensaje.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
}

function mostrarExito(msg) {
  mensaje.innerHTML = `<div class="alert alert-success">${msg}</div>`;
}