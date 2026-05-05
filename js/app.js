const mensaje = document.getElementById("mensaje");

// ========================
// REGISTRO CON SUPABASE
// ========================
const formRegistro = document.getElementById("formRegistro");

if (formRegistro) {
  formRegistro.addEventListener("submit", async function(e) { // Se agrega async
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const cuenta = document.getElementById("cuenta").value.trim();
    const password = document.getElementById("password").value;

    try {
      // Insertar directamente en la tabla de Supabase
      const { data, error } = await window.supabaseClient
        .from('usuarios')
        .insert([
          { nombre, email, numero_cuenta: cuenta, password }
        ]);

      if (error) {
        if (error.code === '23505') throw new Error("El correo o cuenta ya existen");
        throw error;
      }

      mensaje.innerHTML = `
        <div class="alert alert-success">
          Usuario registrado correctamente. Redirigiendo...
        </div>
      `;

      setTimeout(() => { window.location.href = "login.html"; }, 1500);

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
  formLogin.addEventListener("submit", async function(e) { // Se agrega async
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      // Buscar el usuario en la base de datos
      const { data, error } = await window.supabaseClient
        .from('usuarios')
        .select('*')
        .or(`email.eq.${email},numero_cuenta.eq.${email}`)
        .single();

      if (error || !data) throw new Error("Usuario no encontrado");

      // Verificar contraseña (comparación simple para fines académicos)
      if (data.password !== password) throw new Error("Contraseña incorrecta");

      // Guardar sesión real
      localStorage.setItem("sesion", JSON.stringify(data));
      
      // Si el login es en un modal en el index
      const modalElement = document.getElementById('loginModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
      }

      actualizarBotonSesion();
      
      // Si el login es una página aparte, redirigir
      if (window.location.pathname.includes("login.html")) {
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
  mensaje.innerHTML = `<div class="alert alert-danger py-2">${msg}</div>`;
}

function actualizarBotonSesion() {
  const authArea = document.getElementById("authArea");
  if (!authArea) return;

  const sesion = JSON.parse(localStorage.getItem("sesion"));

  if (sesion) {
    authArea.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-light btn-sm dropdown-toggle" data-bs-toggle="dropdown">
          Hola, ${sesion.nombre.split(' ')[0]}
        </button>

        <ul class="dropdown-menu dropdown-menu-end shadow">
          <li class="px-3 py-2 text-center">
            <strong>${sesion.nombre}</strong><br>
            <small class="text-muted">${sesion.email}</small>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <button class="dropdown-item text-danger" id="logout">Cerrar sesión</button>
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

document.addEventListener("DOMContentLoaded", actualizarBotonSesion);

// ==========================================
// CONTROL DEL CARRUSEL (AUTOMÁTICO Y RÁPIDO)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const myCarousel = document.querySelector('#carouselUnam');
    
    if (myCarousel) {
        const carousel = new bootstrap.Carousel(myCarousel, {
            interval: 2500, // Tiempo de cambio (2.5 segundos)
            ride: 'carousel',
            pause: false    // No se detiene si pasas el mouse
        });
        
        // Refuerzo para asegurar que empiece a girar
        carousel.cycle();
    }
});
