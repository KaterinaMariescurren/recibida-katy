// forms.js — Mi Graduación

// ===================================
// CONFIGURACIÓN
// ===================================
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzbE3R_mqREivVW0k_zxHlc4t21_7LYZdqNImiVbuelFVMKU050hx5ZJHRpvbRES0HKKQ/exec';

// ===================================
// ESTADO
// ===================================
let asistencia = null;

// ===================================
// SELECCIONAR ASISTENCIA
// Pinta el botón correcto, muestra/oculta
// la sección de restricción y el botón enviar.
// ===================================
function seleccionarAsistencia(valor) {
  asistencia = valor;

  const btnSi = document.getElementById('btn-si');
  const btnNo = document.getElementById('btn-no');

  // Limpiar ambos estados primero
  btnSi.classList.remove('selected-si', 'selected-no');
  btnNo.classList.remove('selected-si', 'selected-no');

  // Aplicar clase correcta (SI = rosa, NO = teal)
  if (valor === 'si') {
    btnSi.classList.add('selected-si');
  } else {
    btnNo.classList.add('selected-no');
  }

  // Limpiar error previo
  document.getElementById('form-error').textContent = '';

  const restriccionStep = document.getElementById('restriccion-step');
  const noMsgWrap       = document.getElementById('no-msg-wrap');
  const enviarWrap      = document.getElementById('enviar-wrap');

  if (valor === 'si') {
    // Mostrar restricción, ocultar mensaje de no
    restriccionStep.classList.add('open');
    noMsgWrap.classList.remove('open');
  } else {
    // Ocultar restricción + reset "Otro"
    restriccionStep.classList.remove('open');
    document.getElementById('otro-step').classList.remove('open');
    // Resetear el select para que no quede un valor stale si vuelve a elegir SI
    document.getElementById('restriccion').value = 'Sin restricciones';
    noMsgWrap.classList.add('open');
  }

  // Siempre mostrar botón enviar
  enviarWrap.classList.add('open');
}

// ===================================
// CAMPO LIBRE PARA "OTRO"
// ===================================
function checkOtro() {
  const select   = document.getElementById('restriccion');
  const otroStep = document.getElementById('otro-step');

  if (select.value === 'Otro') {
    otroStep.classList.add('open');
    // Pequeño delay para esperar que termine la animación antes de hacer focus
    setTimeout(() => {
      const campo = document.getElementById('restriccion-otro');
      if (campo) campo.focus();
    }, 400);
  } else {
    otroStep.classList.remove('open');
  }
}

// ===================================
// ENVÍO DEL FORMULARIO
// BUG FIX: la restricción se lee DENTRO de enviarRespuesta,
// no en el onchange, así toma siempre el valor actual al momento
// de presionar "Enviar". Se manda via form GET al iframe oculto.
// ===================================
function enviarRespuesta() {
  const nombreEl   = document.getElementById('nombre');
  const apellidoEl = document.getElementById('apellido');
  const errorEl    = document.getElementById('form-error');
  const loadingEl  = document.getElementById('loading');

  const nombre   = nombreEl.value.trim();
  const apellido = apellidoEl.value.trim();

  // --- Leer restricción en el momento del envío ---
  let restriccion = 'Sin restricciones';
  if (asistencia === 'si') {
    const selectEl = document.getElementById('restriccion');
    restriccion = selectEl ? (selectEl.value || 'Sin restricciones') : 'Sin restricciones';

    // Si eligió "Otro", usar el texto del campo libre
    if (restriccion === 'Otro') {
      const otroEl = document.getElementById('restriccion-otro');
      const otroVal = otroEl ? otroEl.value.trim() : '';
      restriccion = otroVal ? 'Otro: ' + otroVal : 'Otro';
    }
  } else {
    restriccion = 'No asiste';
  }

  // --- Validaciones ---
  errorEl.textContent = '';
  nombreEl.classList.remove('error');
  apellidoEl.classList.remove('error');

  let hayError = false;
  if (!nombre)   { nombreEl.classList.add('error');   hayError = true; }
  if (!apellido) { apellidoEl.classList.add('error'); hayError = true; }
  if (hayError)  { errorEl.textContent = 'Por favor completá tu nombre y apellido.'; return; }
  if (!asistencia) { errorEl.textContent = 'Por favor elegí si asistís o no.'; return; }

  // --- Mostrar loading ---
  loadingEl.style.display = 'flex';

  // --- Guardar en localStorage para la página de confirmación ---
  localStorage.setItem('invitado_nombre',      nombre);
  localStorage.setItem('invitado_asistencia',  asistencia);
  localStorage.setItem('invitado_restriccion', restriccion);

  // --- Construir y enviar form oculto al iframe (evita CORS) ---
  const form = document.createElement('form');
  form.method = 'GET';
  form.action = APPS_SCRIPT_URL;
  form.target = 'hidden_iframe';   // iframe ya existente en el HTML

  const campos = {
    nombre:      nombre,
    apellido:    apellido,
    asistencia:  asistencia === 'si' ? 'Sí asisto' : 'No puedo',
    restriccion: restriccion,       // ← CAMPO CORREGIDO
    fecha:       new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
  };

  Object.entries(campos).forEach(function(entry) {
    const input   = document.createElement('input');
    input.type    = 'hidden';
    input.name    = entry[0];
    input.value   = entry[1];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);

  // --- Redirigir a confirmación después de que el request salga ---
  setTimeout(function() {
    loadingEl.style.display = 'none';
    window.location.href = 'confirmacion.html?r=' + asistencia;
  }, 1200);
}

// ===================================
// COPIAR ALIAS
// ===================================
function copyAlias() {
  const alias = 'kmariescurrena.nx';

  navigator.clipboard.writeText(alias)
    .then(function() {
      mostrarToast();
    })
    .catch(function() {
      // Fallback para browsers que no soportan clipboard API
      const el = document.createElement('textarea');
      el.value = alias;
      el.style.position = 'fixed';
      el.style.opacity  = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      mostrarToast();
    });
}

function mostrarToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 2200);
}

// ===================================
// INIT — cosas que necesitan el DOM listo
// ===================================
document.addEventListener('DOMContentLoaded', function() {

  // Scroll reveal con IntersectionObserver
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function(el) {
    observer.observe(el);
  });

  // Navbar: resaltar link activo al hacer scroll
  window.addEventListener('scroll', function() {
    var current = '';
    document.querySelectorAll('section[id]').forEach(function(s) {
      if (window.scrollY >= s.offsetTop - 90) current = s.id;
    });
    document.querySelectorAll('.navbar a').forEach(function(a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  // Hamburger menu
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      var isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Calendario
  var calLink = document.getElementById('add-calendar-link');
  if (calLink) {
    calLink.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(
        'https://www.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + encodeURIComponent('Fiesta de Recibida de Katy') +
        '&dates=20260411T210000/20260412T040000' +
        '&location=' + encodeURIComponent('Salón Madagascar, 11 entre 56 y 57, La Plata') +
        '&details=' + encodeURIComponent('¡Celebramos la recibida!'),
        '_blank'
      );
    });
  }

});

// closeMobileMenu es llamado desde onclick en el HTML
function closeMobileMenu() {
  var mobileMenu = document.getElementById('mobile-menu');
  var hamburger  = document.getElementById('hamburger');
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (hamburger)  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}