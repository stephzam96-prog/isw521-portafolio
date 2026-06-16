// =============================================
// MODO OSCURO CON LOCALSTORAGE
// Guardo la preferencia del usuario para que
// se mantenga aunque cierre y vuelva a abrir
// la página
// =============================================

// Busco el botón de modo oscuro en el HTML
const btnModoOscuro = document.getElementById('btnModoOscuro');

// Cuando la página carga, reviso si el usuario
// había activado el modo oscuro antes
// localStorage.getItem devuelve null si no existe nada guardado
const modoGuardado = localStorage.getItem('modoOscuro');

if (modoGuardado === 'activado') {
  document.body.classList.add('modo-oscuro');
  btnModoOscuro.textContent = '☀️ Modo claro';
}

// Cuando el usuario hace clic en el botón
btnModoOscuro.addEventListener('click', function () {

  // classList.toggle agrega la clase si no está, la quita si ya está
  document.body.classList.toggle('modo-oscuro');

  // Reviso si el modo oscuro está activo ahora
  if (document.body.classList.contains('modo-oscuro')) {
    localStorage.setItem('modoOscuro', 'activado'); // Guardo en localStorage
    btnModoOscuro.textContent = '☀️ Modo claro';
  } else {
    localStorage.setItem('modoOscuro', 'desactivado'); // Actualizo en localStorage
    btnModoOscuro.textContent = '🌙 Modo oscuro';
  }
});


// =============================================
// MENÚ HAMBURGUESA (para celular)
// Muestra y oculta el menú cuando se hace
// clic en el botón ☰
// =============================================

const btnMenu = document.getElementById('btnMenu');
const navLista = document.querySelector('.nav-lista');

btnMenu.addEventListener('click', function () {

  // Agrego o quito la clase "abierto" de la lista del menú
  // En el CSS definí que .nav-lista.abierto tiene display: flex
  navLista.classList.toggle('abierto');

  // Cambio el aria-expanded para que los lectores de pantalla
  // sepan si el menú está abierto o cerrado
  const estaAbierto = navLista.classList.contains('abierto');
  btnMenu.setAttribute('aria-expanded', estaAbierto);
});

// Si el usuario hace clic en un link del menú en celular,
// el menú se cierra solo
navLista.querySelectorAll('.nav-link').forEach(function (link) {
  link.addEventListener('click', function () {
    navLista.classList.remove('abierto');
    btnMenu.setAttribute('aria-expanded', false);
  });
});


// =============================================
// FORMULARIO DE CONTACTO
// Guardo el nombre con localStorage para que
// no se pierda si el usuario cierra la página
// =============================================

const campoNombre = document.getElementById('nombre');
const formContacto = document.getElementById('formContacto');
const mensajeEnviado = document.getElementById('mensajeEnviado');

// Cuando la página carga, reviso si hay un nombre guardado
// y lo pongo en el campo automáticamente
const nombreGuardado = localStorage.getItem('nombreContacto');
if (nombreGuardado) {
  campoNombre.value = nombreGuardado;
}

// Cada vez que el usuario escribe en el campo de nombre,
// lo guardo en localStorage
campoNombre.addEventListener('input', function () {
  localStorage.setItem('nombreContacto', campoNombre.value);
});

// Cuando el usuario envía el formulario
formContacto.addEventListener('submit', function (evento) {

  // Evito que la página se recargue (comportamiento por defecto del form)
  evento.preventDefault();

  // Muestro el mensaje de confirmación
  // El atributo hidden lo oculta, quitarlo lo hace visible
  mensajeEnviado.removeAttribute('hidden');

  // Limpio el formulario después de enviarlo
  formContacto.reset();

  // Borro el nombre guardado porque ya se envió
  localStorage.removeItem('nombreContacto');

  // Después de 4 segundos escondo el mensaje de confirmación de nuevo
  setTimeout(function () {
    mensajeEnviado.setAttribute('hidden', '');
  }, 4000);
});