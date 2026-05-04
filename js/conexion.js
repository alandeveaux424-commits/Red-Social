/**
 * ARCHIVO: js/conexion.js
 * 
 * Este archivo inicializa la conexión con Supabase. 
 * Debe cargarse en el HTML DESPUÉS de la librería de Supabase 
 * y ANTES de tus archivos de lógica (registro.js o login.js).
 */

// 1. URL base de tu proyecto (Sin /rest/v1/ al final)
const supabaseUrl = 'https://csicfyvadluenphbfkot.supabase.co';

// 2. Tu llave pública (Anon Key) obtenida de Settings > API
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzaWNmeXZhZGx1ZW5waGJma290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NTg3NzgsImV4cCI6MjA5MzQzNDc3OH0.R7mAUDg3-SWQWjIQM0qLjgBWQVK_4kybzK5Gi-AIzZ8';

// 3. Crear el cliente y asignarlo al objeto global 'window'[cite: 1]
// Esto permite que uses 'window.supabaseClient' en cualquier otra parte de tu código.
window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Mensaje de confirmación en consola para depuración
console.log("Conexión con Supabase configurada correctamente.");
