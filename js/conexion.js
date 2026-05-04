// 1. Conexión (Reemplaza con tus llaves de Settings > API)
const supabaseUrl = 'https://csicfyvadluenphbfkot.supabase.co/rest/v1/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzaWNmeXZhZGx1ZW5waGJma290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NTg3NzgsImV4cCI6MjA5MzQzNDc3OH0.R7mAUDg3-SWQWjIQM0qLjgBWQVK_4kybzK5Gi-AIzZ8';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function registrarUsuario(event) {
    event.preventDefault(); // Evita que la página se recargue

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const cuenta = document.getElementById('cuenta').value;
    const password = document.getElementById('password').value;

    // VALIDACIONES (Las mismas que tenías en PHP)
    if (!email.endsWith("@unam.mx") && !email.endsWith(".unam.mx")) {
        alert("Solo correos de la UNAM");
        return;
    }

    if (cuenta.length !== 9) {
        alert("La cuenta debe tener 9 dígitos");
        return;
    }

    // INSERTAR EN SUPABASE
    const { data, error } = await _supabase
        .from('usuarios') // Tu tabla en Supabase
        .insert([
            { nombre, email, numero_cuenta: cuenta, password }
        ]);

    if (error) {
        console.error("Error:", error.message);
        alert("Error al registrar: " + error.message);
    } else {
        alert("¡Registro exitoso!");
    }
}
