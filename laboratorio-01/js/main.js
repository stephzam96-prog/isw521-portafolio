/*═══════════════════════════════════════════════════════════════ */
 
 
/* ══════════════════════════════════════════════════════
   1. SELECCIÓN DE ELEMENTOS DEL DOM
   ────────────────────────────────────────────────────
   Agarramos todos los elementos que vamos a necesitar
   usando sus IDs (definidos en el index.html).
   Los declaramos con const porque la referencia al
   elemento nunca va a cambiar.
   ══════════════════════════════════════════════════════ */
const botonTema   = document.getElementById('toggle-tema');
const inputNombre = document.getElementById('nombre');
const inputEmail  = document.getElementById('email');
const selectDest  = document.getElementById('destino');
const btnGuardar  = document.getElementById('btn-guardar');
const mensajeConf = document.getElementById('mensaje-confirmacion');
 
 
/* ══════════════════════════════════════════════════════
   2. CARGAR PREFERENCIAS AL INICIAR LA PÁGINA
   ────────────────────────────────────────────────────
   Este código corre INMEDIATAMENTE cuando el script
   se carga. No espera ningún evento.
 
   Lo ponemos ANTES de los event listeners para que:
   a) El tema se aplique antes del primer render
      (evita el "flash" de modo claro → oscuro)
   b) El mensaje de bienvenida aparezca desde el inicio
   ══════════════════════════════════════════════════════ */
 
// ── 2a. Leer y aplicar el tema guardado ──
const temaGuardado = localStorage.getItem('tema-unuk');
// getItem devuelve el string guardado, o null si no existe
 
if (temaGuardado === 'oscuro') {
  // El usuario eligió modo oscuro en una visita anterior
  document.body.classList.add('modo-oscuro');
  // Agrega la clase al <body>, lo que activa las variables
  // CSS de modo oscuro definidas en styles.css

  botonTema.textContent = '☀️';
  // Cambiamos el ícono a sol (para indicar "clic aquí para modo claro")
  botonTema.setAttribute('aria-pressed', 'true');
  // aria-pressed comunica el estado del toggle a lectores de pantalla
}
// Si temaGuardado es null (primera visita) o 'claro',
// no hacemos nada — el modo claro es el default del CSS.
 
 
// ── 2b. Recuperar interés guardado de una visita anterior ──
const interesGuardado = localStorage.getItem('interes-unuk');
// Intentamos leer el objeto de interés guardado previamente
 
if (interesGuardado) {
  // interesGuardado existe (no es null ni string vacío)
  // Necesitamos convertir el string JSON de vuelta a objeto JS
  const datos = JSON.parse(interesGuardado);
  // JSON.parse hace lo inverso de JSON.stringify:
  // convierte '{"nombre":"Ana","destino":"peru"}' → { nombre:"Ana", destino:"peru" }

  // Mapa para convertir el value del select al nombre legible
  const nombresDestino = {
    guatemala: 'Guatemala',
    peru:      'Perú',
    mexico:    'México',
    colombia:  'Colombia',
  };

  mensajeConf.textContent =
    `👋 ¡Bienvenido/a de vuelta, ${datos.nombre}! ` +
    `Tu interés en ${nombresDestino[datos.destino] || datos.destino} sigue guardado.`;
  // Usamos template literals para insertar los valores guardados
}
 
 
/* ══════════════════════════════════════════════════════
   3. TOGGLE DE MODO OSCURO / CLARO
   ────────────────────────────────────────────────────
   Escuchamos el clic en el botón #theme-toggle.
   Al hacer clic:
     - Alterna la clase 'modo-oscuro' en el <body>
     - Cambia el ícono del botón (luna / sol)
     - Guarda la preferencia en localStorage
   ══════════════════════════════════════════════════════ */
botonTema.addEventListener('click', () => {
  // classList.toggle('modo-oscuro'):
  // - Si <body> NO tiene la clase → la AGREGA → retorna true
  // - Si <body> SÍ tiene la clase → la QUITA  → retorna false
  const modoOscuroActivo = document.body.classList.toggle('modo-oscuro');
  // La variable guarda el estado RESULTANTE (no el anterior)
 
  if (modoOscuroActivo) {
    // La clase quedó → modo oscuro activo
    botonTema.textContent = '☀️';           // sol = "podés volver al modo claro"
    botonTema.setAttribute('aria-pressed', 'true');
    localStorage.setItem('tema-unuk', 'oscuro');
    // Guardamos bajo la clave 'tema-unuk' el string 'oscuro'
  } else {
    // La clase fue quitada → modo claro activo
    botonTema.textContent = '🌙';           // luna = "podés ir al modo oscuro"
    botonTema.setAttribute('aria-pressed', 'false');
    localStorage.setItem('tema-unuk', 'claro');
  }
});
// ¿Por qué guardamos en localStorage?
// Para que al recargar la página o volver al sitio,
// el Bloque 2 lea la preferencia y aplique el tema correcto.
 
 
/* ══════════════════════════════════════════════════════
   4. GUARDAR INTERÉS DEL FORMULARIO
   ────────────────────────────────────────────────────
   Cuando el usuario hace clic en "Guardar mi interés":
     a) Obtiene los valores de los campos
     b) Valida que estén completos y en formato correcto
     c) Guarda el objeto de datos en localStorage
     d) Muestra un mensaje de confirmación
     e) Limpia los campos del formulario
   ══════════════════════════════════════════════════════ */
btnGuardar.addEventListener('click', () => {
 
  /* ── 4a. OBTENER VALORES ── */
  const nombre  = inputNombre.value.trim();
  // .value lee el texto que el usuario escribió
  // .trim() elimina espacios al inicio y al final
  // Así 'Stephanie  ' se convierte en 'Stephanie'
 
  const email   = inputEmail.value.trim();
  const destino = selectDest.value;
  // Para <select>, .value devuelve el value de la <option> seleccionada
  // Ej: si eligió "Perú", destino = 'peru'
 
 
  /* ── 4b. VALIDAR — verificar que los campos estén completos ── */
 
  // Validación 1: nombre no vacío
  if (nombre === '') {
    // === compara valor Y tipo. Siempre usamos === (nunca ==)
    mensajeConf.textContent = '❌ Por favor ingresá tu nombre completo.';
    mensajeConf.style.color = '#E65100';  // color naranja/error
    inputNombre.focus();
    // .focus() mueve el cursor al campo con error
    // Mejora la experiencia del usuario — sabe exactamente dónde ir
    return;
    // return; sale de la función aquí. El código de abajo NO se ejecuta.
    // Esto evita guardar datos incompletos.
  }
 
  // Validación 2: email con formato correcto
  const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Esta es una expresión regular (regex) — un patrón de texto
  // Verifica que el email tenga: algo @ algo . algo
  // Ej: stephanie@gmail.com → válido ✅ | stephanie → inválido ❌
 
  if (!patronEmail.test(email)) {
    // .test() devuelve true si el email cumple el patrón
    // ! invierte el resultado: si NO cumple, entramos al if
    mensajeConf.textContent = '❌ Ingresá un correo válido (ejemplo: tu@correo.com).';
    mensajeConf.style.color = '#E65100';
    inputEmail.focus();
    return;
  }
 
  // Validación 3: destino seleccionado
  if (destino === '') {
    // La primera <option> tiene value="" (el "Seleccioná un destino")
    mensajeConf.textContent = '❌ Por favor seleccioná un destino de interés.';
    mensajeConf.style.color = '#E65100';
    selectDest.focus();
    return;
  }
 
 
  /* ── 4c. GUARDAR EN localStorage ── */
 
  // Creamos un objeto con todos los datos del formulario
  const datosInteres = {
    nombre:  nombre,
    email:   email,
    destino: destino,
    fecha:   new Date().toLocaleDateString('es-CR'),
    // new Date() → objeto con fecha y hora actual
    // .toLocaleDateString('es-CR') → la formatea como dd/mm/yyyy en español de CR
  };
 
  // localStorage solo acepta strings, no objetos.
  // JSON.stringify convierte el objeto en un string JSON:
  // { nombre: 'Ana', ... } → '{"nombre":"Ana",...}'
  localStorage.setItem('interes-unuk', JSON.stringify(datosInteres));
 
 
  /* ── 4d. MOSTRAR MENSAJE DE CONFIRMACIÓN ── */
  const nombreDestino = {
    guatemala: 'Guatemala',
    peru:      'Perú',
    mexico:    'México',
    colombia:  'Colombia',
  };
  // Objeto que mapea los values del <select> a nombres legibles
 
  mensajeConf.textContent =
    `✅ ¡Gracias, ${nombre}! Tu interés en ` +
    `${nombreDestino[destino] || destino} fue guardado. ` +
    `Te contactaremos a ${email} muy pronto. 🌍`;
  mensajeConf.style.color = '#0A5258';  // color teal oscuro = éxito
 
 
  /* ── 4e. LIMPIAR LOS CAMPOS ── */
  inputNombre.value = '';
  // Vaciamos el campo asignando string vacío a .value
  inputEmail.value  = '';
  selectDest.value  = '';
  // Después de guardar, el formulario queda listo para otra consulta
 
});