const form = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async function(e) { // Añadimos async para usar await con Supabase
  e.preventDefault();

  let nombre = document.getElementById("nombre");
  let email = document.getElementById("email");
  let cuenta = document.getElementById("cuenta");
  let password = document.getElementById("password");

  // Valores
  let nombreVal = nombre.value.trim();
  let emailVal = email.value.trim();
  let cuentaVal = cuenta.value.trim();
  let passwordVal = password.value;

  // REGEX
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

  if (!emailRegex.test(emailVal) || !emailVal.endsWith("@unam.mx")) {
    email.classList.add("is-invalid");
    return mostrarError("Solo se permiten correos @unam.mx");
  }

  if (!cuentaRegex.test(cuentaVal)) {
    cuenta.classList.add("is-invalid");
    return mostrarError("Número de cuenta inválido (9 dígitos)");
  }

  if (!passwordRegex.test(passwordVal)) {
    password.classList.add("is-invalid");
    return mostrarError("Contraseña insegura (mín 8, mayúscula, número y símbolo)");
  }

  // 🚀 CONEXIÓN CON SUPABASE (Sustituye al fetch de PHP)
  try {
    // Insertamos directamente en la tabla 'usuarios' que ya tienes
    const { data, error } = await window.supabaseClient
      .from('usuarios')
      .insert([
        { 
          nombre: nombreVal, 
          email: emailVal, 
          numero_cuenta: cuentaVal, 
          password: passwordVal // Supabase protege la conexión vía SSL automáticamente
        }
      ]);

    // Manejo de errores de la base de datos (Ej: Usuario ya existe)
    if (error) {
      if (error.code === '23505') { // Código de PostgreSQL para duplicados (Unique constraint)
        email.classList.add("is-invalid");
        cuenta.classList.add("is-invalid");
        throw new Error("El correo o número de cuenta ya están registrados.");
      }
      throw error;
    }

    // 🟢 TODO SALIÓ BIEN
    mostrarExito("Usuario registrado correctamente en la nube.");

    // Marcar como válidos visualmente
    [nombre, email, cuenta, password].forEach(input => {
      input.classList.add("is-valid");
    });

    // Limpiar formulario
    form.reset();

    // 🔁 Redirigir al login después de un momento
    setTimeout(() => {
      window.location.href = "login.html"; 
    }, 1500);

  } catch (err) {
    console.error("ERROR EN REGISTRO:", err.message);
    mostrarError(err.message || "Error al conectar con Supabase");
  }
});

// 🔴 FUNCIÓN MOSTRAR ERROR
function mostrarError(msg) {
  mensaje.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
  return false; 
}

// 🟢 FUNCIÓN MOSTRAR ÉXITO
function mostrarExito(msg) {
  mensaje.innerHTML = `<div class="alert alert-success">${msg}</div>`;
}
