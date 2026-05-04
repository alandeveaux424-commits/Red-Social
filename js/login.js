const form = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const inputField = document.getElementById("email");
  const passwordField = document.getElementById("password");

  const input = inputField.value.trim();
  const password = passwordField.value;

  mensaje.innerHTML = "";
  inputField.classList.remove("is-invalid", "is-valid");
  passwordField.classList.remove("is-invalid", "is-valid");

  // ❌ Validación básica
  if (!input || !password) {
    inputField.classList.add("is-invalid");
    passwordField.classList.add("is-invalid");
    return mostrarError("Completa todos los campos");
  }

  const esEmail = input.includes("@");

  if (esEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input)) {
      inputField.classList.add("is-invalid");
      return mostrarError("Correo inválido");
    }
  } else {
    const cuentaRegex = /^\d{9}$/;
    if (!cuentaRegex.test(input)) {
      inputField.classList.add("is-invalid");
      return mostrarError("Número de cuenta inválido (9 dígitos)");
    }
  }

  const datos = new FormData();
  datos.append("input", input);
  datos.append("password", password);

  fetch("/RedSocial/php/login.php", {
    method: "POST",
    body: datos
  })
  .then(res => res.text())
  .then(text => {
    console.log("RESPUESTA SERVIDOR:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Respuesta inválida:", text);
      return mostrarError("Error del servidor");
    }

    if (!data || !data.status) {
      return mostrarError("Respuesta incompleta del servidor");
    }

    if (data.status === "success") {

      inputField.classList.add("is-valid");
      passwordField.classList.add("is-valid");

      mostrarExito("Bienvenido " + data.usuario.nombre + " ✔");

      localStorage.setItem("sesion", JSON.stringify(data.usuario));

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);

    } else {
      inputField.classList.add("is-invalid");
      passwordField.classList.add("is-invalid");

      mostrarError(data.message || "Credenciales incorrectas");
    }
  })
  .catch(error => {
    console.error("ERROR:", error);
    mostrarError("Error de conexión con el servidor");
  });
});

function mostrarError(msg) {
  mensaje.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
}

function mostrarExito(msg) {
  mensaje.innerHTML = `<div class="alert alert-success">${msg}</div>`;
}
