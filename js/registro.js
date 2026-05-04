const form = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  let nombre = document.getElementById("nombre");
  let email = document.getElementById("email");
  let cuenta = document.getElementById("cuenta");
  let password = document.getElementById("password");

  let nombreVal = nombre.value.trim();
  let emailVal = email.value.trim();
  let cuentaVal = cuenta.value.trim();
  let passwordVal = password.value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cuentaRegex = /^\d{9}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  [nombre, email, cuenta, password].forEach(input => {
    input.classList.remove("is-invalid", "is-valid");
  });

  let error = false;

  if (!nombreVal) {
    nombre.classList.add("is-invalid");
    error = true;
  }

  if (!emailVal && !cuentaVal) {
    email.classList.add("is-invalid");
    cuenta.classList.add("is-invalid");
    error = true;
  }

  if (emailVal) {
    if (!emailRegex.test(emailVal)) {
      email.classList.add("is-invalid");
      return mostrarError("Correo inválido");
    }

    if (!emailVal.endsWith("@unam.mx")) {
      email.classList.add("is-invalid");
      return mostrarError("Solo correos UNAM");
    }
  }

  if (cuentaVal && !cuentaRegex.test(cuentaVal)) {
    cuenta.classList.add("is-invalid");
    return mostrarError("Número de cuenta inválido (9 dígitos)");
  }

  if (!passwordRegex.test(passwordVal)) {
    password.classList.add("is-invalid");
    return mostrarError("Contraseña insegura (mín 8, mayúscula, número y símbolo)");
  }

  if (error) {
    return mostrarError("Completa correctamente los campos");
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const existe = usuarios.some(u =>
    u.email === emailVal || u.cuenta === cuentaVal
  );

  if (existe) {
    email.classList.add("is-invalid");
    cuenta.classList.add("is-invalid");
    return mostrarError("El usuario ya existe");
  }

  const datos = new FormData();
  datos.append("nombre", nombreVal);
  datos.append("email", emailVal);
  datos.append("cuenta", cuentaVal);
  datos.append("password", passwordVal);

  fetch("/RedSocial/php/registro.php", {
    method: "POST",
    body: datos
  })
  .then(res => res.text())
  .then(text => {
    console.log("RESPUESTA DEL SERVIDOR:", text);

    try {
      const data = JSON.parse(text);

      if (data.status === "success") {

        // GUARDAR TAMBIÉN EN LOCAL (para login frontend)
        const nuevoUsuario = {
          nombre: nombreVal,
          email: emailVal,
          cuenta: cuentaVal,
          password: passwordVal
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        mostrarExito(data.message);

        // Marcar como válidos
        [nombre, email, cuenta, password].forEach(input => {
          input.classList.add("is-valid");
        });

        form.reset();

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1200);

      } else {
        mostrarError(data.message);
      }

    } catch {
      console.error("Respuesta no JSON:", text);
      mostrarError("Error del servidor (respuesta inválida)");
    }
  })
  .catch(error => {
    console.error("ERROR REAL:", error);
    mostrarError("Error de conexión con el servidor");
  });

});

function mostrarError(msg) {
  mensaje.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
}

function mostrarExito(msg) {
  mensaje.innerHTML = `<div class="alert alert-success">${msg}</div>`;
}
