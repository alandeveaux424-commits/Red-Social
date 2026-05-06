const form = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");

const btnTogglePassword = document.getElementById("btnTogglePassword");
const passwordField = document.getElementById("password");
const iconEye = document.getElementById("iconEye");

if (btnTogglePassword) {
    btnTogglePassword.addEventListener("click", () => {
        const isPassword = passwordField.type === "password";
        passwordField.type = isPassword ? "text" : "password";
        iconEye.classList.toggle("bi-eye");
        iconEye.classList.toggle("bi-eye-slash");
    });
}

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const inputField = document.getElementById("email");
  const input = inputField.value.trim();
  const password = passwordField.value;

  mensaje.innerHTML = "";
  inputField.classList.remove("is-invalid", "is-valid");
  passwordField.classList.remove("is-invalid", "is-valid");

  if (!input || !password) {
    inputField.classList.add("is-invalid");
    passwordField.classList.add("is-invalid");
    return mostrarError("Completa todos los campos");
  }

  try {
    if (!window.supabaseClient) throw new Error("Error: Cliente de base de datos no listo.");

    const { data, error } = await window.supabaseClient
      .from('usuarios')
      .select('*')
      .or(`email.eq."${input}",numero_cuenta.eq."${input}"`)
      .single();

    if (error || !data) {
      inputField.classList.add("is-invalid");
      throw new Error("Usuario no encontrado.");
    }

    if (data.password !== password) {
      passwordField.classList.add("is-invalid");
      throw new Error("Contraseña incorrecta.");
    }

    inputField.classList.add("is-valid");
    passwordField.classList.add("is-valid");

    mostrarExito(`¡Bienvenido de nuevo, ${data.nombre.split(' ')[0]}! ✔`);

    localStorage.setItem("sesion", JSON.stringify({
      id: data.id,
      nombre: data.nombre,
      email: data.email,
      numero_cuenta: data.numero_cuenta
    }));

    setTimeout(() => {
      window.location.href = "inicioRed.html"; 
    }, 1200);

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    mostrarError(err.message);
  }
});

function mostrarError(msg) {
  mensaje.innerHTML = `<div class="alert alert-danger py-2 small shadow-sm">${msg}</div>`;
}

function mostrarExito(msg) {
  mensaje.innerHTML = `<div class="alert alert-success py-2 small shadow-sm">${msg}</div>`;
}
