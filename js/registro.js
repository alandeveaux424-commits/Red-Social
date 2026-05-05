const form = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");

// --- NUEVO: Lógica para ver/ocultar contraseña ---
const btnTogglePassword = document.getElementById("btnTogglePassword");
const passwordEl = document.getElementById("password");
const iconEye = document.getElementById("iconEye");

if (btnTogglePassword) {
  btnTogglePassword.addEventListener("click", function() {
    const isPassword = passwordEl.type === "password";
    passwordEl.type = isPassword ? "text" : "password";
    // Cambia el icono si usas Bootstrap Icons
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
  const emailVal = email.value.trim();
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
    return mostrarError("Usa tu correo institucional de la UNAM.");
  }

  if (!cuentaRegex.test(cuentaVal)) {
    cuenta.classList.add("is-invalid");
    return mostrarError("Número de cuenta inválido (9 dígitos)");
  }

  if (!passwordRegex.test(passwordVal)) {
    password.classList.add("is-invalid");
    return mostrarError("Contraseña insegura (mín 8, una mayúscula, un número y un símbolo)");
  }

  // 🚀 ENVÍO A SUPABASE
  try {
    if (!window.supabaseClient) throw new Error("Error de conexión: Cliente no inicializado.");

    const { data, error } = await window.supabaseClient
      .from('usuarios')
      .insert([{ 
        nombre: nombreVal, 
        email: emailVal, 
        numero_cuenta: cuentaVal, 
        password: passwordVal,
        fecha_nacimiento: fechaNacVal 
      }]);

    if (error) {
      if (error.code === '23505') {
        email.classList.add("is-invalid");
        cuenta.classList.add("is-invalid");
        throw new Error("El correo o número de cuenta ya están registrados.");
      }
      throw error;
    }

    mostrarExito("¡Cuenta UNAM creada con éxito!");
    [nombre, email, cuenta, password, fechaNac].forEach(input => input.classList.add("is-valid"));
    form.reset();
    
    setTimeout(() => { window.location.href = "index.html"; }, 1500);

  } catch (err) {
    console.error("ERROR EN REGISTRO:", err.message);
    mostrarError(err.message || "Error al conectar con Supabase");
  }
});

function mostrarError(msg) {
  mensaje.innerHTML = `<div class="alert alert-danger py-2 small shadow-sm">${msg}</div>`;
}

function mostrarExito(msg) {
  mensaje.innerHTML = `<div class="alert alert-success py-2 small shadow-sm">${msg}</div>`;
}
