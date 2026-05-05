const form = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  let nombre = document.getElementById("nombre");
  let email = document.getElementById("email");
  let cuenta = document.getElementById("cuenta");
  let password = document.getElementById("password");

  let nombreVal = nombre.value.trim();
  let emailVal = email.value.trim();
  let cuentaVal = cuenta.value.trim();
  let passwordVal = password.value;

  const dominiosPermitidos = [
    "@unam.mx", "@arquitectura.unam.mx", "@fad.unam.mx", "@ciencias.unam.mx",
    "@politicas.unam.mx", "@fca.unam.mx", "@derecho.unam.mx", "@economia.unam.mx",
    "@filos.unam.mx", "@ingenieria.unam.mx", "@facmed.unam.mx", "@fmvz.unam.mx",
    "@musica.unam.mx", "@odontologia.unam.mx", "@psicologia.unam.mx", "@quimica.unam.mx",
    "@aragon.unam.mx", "@acatlan.unam.mx", "@cuautitlan.unam.mx", "@iztacala.unam.mx", 
    "@zaragoza.unam.mx", "@enes.morelia.unam.mx", "@enes.leon.unam.mx", 
    "@enes.juriquilla.unam.mx", "@cch.unam.mx", "@enp.unam.mx"
  ];

  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cuentaRegex = /^\d{9}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  // Reset estilos
  [nombre, email, cuenta, password].forEach(input => {
    input.classList.remove("is-invalid", "is-valid");
  });

  // VALIDACIONES FRONTEND
  if (!nombreVal) {
    nombre.classList.add("is-invalid");
    return mostrarError("El nombre es obligatorio");
  }

  if (!nombreRegex.test(nombreVal)) { 
    nombre.classList.add("is-invalid");
    return mostrarError("El nombre no debe contener números ni símbolos especiales (solo acentos)");
  }

  // VALIDACIÓN DE CORREO
  const esDominioValido = dominiosPermitidos.some(dominio => emailVal.endsWith(dominio));
  if (!emailRegex.test(emailVal) || !esDominioValido) {
    email.classList.add("is-invalid");
    return mostrarError("Correo no válido. Usa tu correo institucional de la UNAM.");
  }

  if (!cuentaRegex.test(cuentaVal)) {
    cuenta.classList.add("is-invalid");
    return mostrarError("Número de cuenta inválido (9 dígitos)");
  }

  if (!passwordRegex.test(passwordVal)) {
    password.classList.add("is-invalid");
    return mostrarError("Contraseña insegura (mín 8, mayúscula, número y símbolo)");
  }

  try {
    if (!window.supabaseClient) throw new Error("Error de conexión: Cliente no inicializado.");

    const { data, error } = await window.supabaseClient
      .from('usuarios')
      .insert([{ 
        nombre: nombreVal, 
        email: emailVal, 
        numero_cuenta: cuentaVal, 
        password: passwordVal 
      }]);

    if (error) {
      if (error.code === '23505') {
        email.classList.add("is-invalid");
        cuenta.classList.add("is-invalid");
        throw new Error("El correo o número de cuenta ya están registrados.");
      }
      throw error;
    }

    mostrarExito("Usuario registrado correctamente en la nube.");
    [nombre, email, cuenta, password].forEach(input => input.classList.add("is-valid"));
    form.reset();
    setTimeout(() => { window.location.href = "index.html"; }, 1500);

  } catch (err) {
    console.error("ERROR EN REGISTRO:", err.message);
    mostrarError(err.message || "Error al conectar con Supabase");
  }
});

function mostrarError(msg) {
  mensaje.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
  return false; 
}

function mostrarExito(msg) {
  mensaje.innerHTML = `<div class="alert alert-success">${msg}</div>`;
}
