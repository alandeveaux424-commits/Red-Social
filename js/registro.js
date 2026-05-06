const form = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");

// --- Lógica para ver/ocultar contraseña ---
const btnTogglePassword = document.getElementById("btnTogglePassword");
const passwordEl = document.getElementById("password");
const iconEye = document.getElementById("iconEye");

if (btnTogglePassword) {
  btnTogglePassword.addEventListener("click", function() {
    const isPassword = passwordEl.type === "password";
    passwordEl.type = isPassword ? "text" : "password";
    iconEye.classList.toggle("bi-eye");
    iconEye.classList.toggle("bi-eye-slash");
  });
}

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  // Referencias a los elementos
  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const cuenta = document.getElementById("cuenta");
  const password = document.getElementById("password");
  const fechaNac = document.getElementById("fecha_nacimiento");

  // Valores
  const nombreVal = nombre.value.trim();
  const emailVal = email.value.trim().toLowerCase(); // Convertimos a minúsculas
  const cuentaVal = cuenta.value.trim();
  const passwordVal = password.value;
  const fechaNacVal = fechaNac.value;

  // --- LISTA DE DOMINIOS PERMITIDOS ---
  const dominiosPermitidos = [
    "@unam.mx", "@arquitectura.unam.mx", "@fad.unam.mx", "@ciencias.unam.mx",
    "@politicas.unam.mx", "@fca.unam.mx", "@derecho.unam.mx", "@economia.unam.mx",
    "@filos.unam.mx", "@ingenieria.unam.mx", "@facmed.unam.mx", "@fmvz.unam.mx",
    "@musica.unam.mx", "@odontologia.unam.mx", "@psicologia.unam.mx", "@quimica.unam.mx",
    "@aragon.unam.mx", "@acatlan.unam.mx", "@cuautitlan.unam.mx", "@iztacala.unam.mx", 
    "@zaragoza.unam.mx", "@enes.morelia.unam.mx", "@enes.leon.unam.mx", 
    "@enes.juriquilla.unam.mx", "@cch.unam.mx", "@enp.unam.mx"
  ];

  // REGEX
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cuentaRegex = /^\d{9}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  // Reset estilos
  [nombre, email, cuenta, password, fechaNac].forEach(input => {
    input.classList.remove("is-invalid", "is-valid");
  });

  // --- VALIDACIONES FRONTEND ---
  if (!nombreVal || !nombreRegex.test(nombreVal)) {
    nombre.classList.add("is-invalid");
    return mostrarError("Nombre inválido (solo letras y acentos)");
  }

  if (!fechaNacVal) {
    fechaNac.classList.add("is-invalid");
    return mostrarError("La fecha de nacimiento es obligatoria");
  }

  const esDominioValido = dominiosPermitidos.some(dominio => emailVal.endsWith(dominio));
  if (!emailRegex.test(emailVal) || !esDominioValido) {
    email.classList.add("is-invalid");
    return mostrarError("Usa un correo institucional válido de la UNAM.");
  }

  if (!cuentaRegex.test(cuentaVal)) {
    cuenta.classList.add("is-invalid");
    return mostrarError("Número de cuenta inválido (9 dígitos)");
  }

  if (!passwordRegex.test(passwordVal)) {
    password.classList.add("is-invalid");
    return mostrarError("Contraseña insegura (mín 8, una mayúscula, un número y un símbolo)");
  }

try {
    if (!window.supabaseClient) throw new Error("Cliente no listo.");

    const { data, error } = await window.supabaseClient.auth.signUp({
      email: emailVal,
      password: passwordVal,
      options: {
        data: {
          nombre_completo: nombreVal,
          numero_cuenta: cuentaVal,
          fecha_nacimiento: fechaNacVal
        }
      }
    });

    if (error) {
      if (error.message.includes("already registered")) throw new Error("El correo ya está registrado");
      throw error;
    }

    form.style.display = "none";
    mensaje.innerHTML = `
      <div class="alert alert-success py-4 shadow text-center" style="border-radius: 15px;">
        <h4 class="fw-bold"><i class="bi bi-envelope-check-fill text-success" style="font-size: 2rem;"></i><br>¡Registro casi completo!</h4>
        <p class="mb-2">Hemos enviado un correo de confirmación a <strong>${emailVal}</strong>.</p>
        <hr>
        <p class="small mb-3">Por favor, revisa tu bandeja de entrada (y la carpeta de SPAM). <strong>Debes hacer clic en el enlace para activar tu cuenta antes de iniciar sesión.</strong></p>
        <a href="index.html" class="btn btn-outline-success fw-bold">Ir a Iniciar Sesión</a>
      </div>
    `;

    // setTimeout(() => { window.location.href = "index.html"; }, 2000);

  } catch (err) {
    mostrarError(err.message);
  }

function mostrarError(msg) {
  mensaje.innerHTML = `<div class="alert alert-danger py-2 small shadow-sm">${msg}</div>`;
}

function mostrarExito(msg) {
  mensaje.innerHTML = `<div class="alert alert-success py-2 small shadow-sm">${msg}</div>`;
}
