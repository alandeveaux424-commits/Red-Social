const mensaje = document.getElementById("mensaje");

// ========================
// REGISTRO CON SUPABASE
// ========================
const formRegistro = document.getElementById("formRegistro");

if (formRegistro) {
  formRegistro.addEventListener("submit", async function(e) {
    e.preventDefault();

    // Referencias a los inputs
    const nombreInput = document.getElementById("nombre");
    const emailInput = document.getElementById("email");
    const cuentaInput = document.getElementById("cuenta");
    const passwordInput = document.getElementById("password");
    const fechaNacInput = document.getElementById("fecha_nacimiento"); // <--- NUEVO

    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const cuenta = cuentaInput.value.trim();
    const password = passwordInput.value;
    const fecha_nacimiento = fechaNacInput ? fechaNacInput.value : null; // <--- NUEVO

    try {
      // 🚀 Insertar en la tabla con el nuevo campo
      const { data, error } = await window.supabaseClient
        .from('usuarios')
        .insert([
          { 
            nombre, 
            email, 
            numero_cuenta: cuenta, 
            password,
            fecha_nacimiento // <--- AGREGADO A LA INSERCIÓN
          }
        ]);

      if (error) {
        if (error.code === '23505') throw new Error("El correo o cuenta ya existen");
        throw error;
      }

      mensaje.innerHTML = `
        <div class="alert alert-success">
          ¡Cuenta UNAM creada con éxito! Redirigiendo...
        </div>
      `;

      setTimeout(() => { window.location.href = "index.html"; }, 1500);

    } catch (err) {
      mostrarError(err.message || "Error al registrar");
    }
  });
}

// ========================
// LOGIN CON SUPABASE
// ========================
const formLogin = document.getElementById("formLogin");

if (formLogin) {
  formLogin.addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      // Buscar usuario por email o número de cuenta
      const { data, error } = await window.supabaseClient
        .from('usuarios')
        .select('*')
        .or(`email.eq.${email},numero_cuenta.eq.${email}`)
        .single();

      if (error || !data) throw new Error("Usuario no encontrado");

      // Verificación de contraseña
      if (data.password !== password) throw new Error("Contraseña incorrecta");

      // Guardar sesión en el navegador
      localStorage.setItem("sesion", JSON.stringify(data));
      
      // Cerrar modal si existe
      const modalElement = document.getElementById('loginModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
      }

      actualizarBotonSesion();
      
      // Redirigir si no estamos en el index
      if (!window.location.pathname.endsWith("index.html") && window.location.pathname !== "/") {
        window.location.href = "index.html";
      }

    } catch (err) {
      mostrarError(err.message);
    }
  });
}

// ========================
// FUNCIONES DE APOYO
// ========================
function mostrarError(msg) {
  if (!mensaje) return;
  mensaje.innerHTML = `<div class="alert alert-danger py-2 small shadow-sm">${msg}</div>`;
}

function actualizarBotonSesion() {
  const authArea = document.getElementById("authArea");
  if (!authArea) return;

  const sesion = JSON.parse(localStorage.getItem("sesion"));

  if (sesion) {
    authArea.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-light btn-sm dropdown-toggle shadow-sm" data-bs-toggle="dropdown">
          <i class="bi bi-person-circle me-1"></i> Hola, ${sesion.nombre.split(' ')[0]}
        </button>

        <ul class="dropdown-menu dropdown-menu-end shadow border-0">
          <li class="px-3 py-2 text-center">
            <div class="fw-bold text-truncate" style="max-width: 150px;">${sesion.nombre}</div>
            <small class="text-muted">${sesion.email}</small>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="perfil.html"><i class="bi bi-gear me-2"></i>Mi Perfil</a></li>
          <li>
            <button class="dropdown-item text-danger" id="logout">
              <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    `;

    document.getElementById("logout").addEventListener("click", () => {
      localStorage.removeItem("sesion");
      location.reload();
    });
  }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    actualizarBotonSesion();

    // Control del Carrusel
    const myCarousel = document.querySelector('#carouselUnam');
    if (myCarousel) {
        new bootstrap.Carousel(myCarousel, {
            interval: 2500,
            ride: 'carousel',
            pause: false
        }).cycle();
    }
});
