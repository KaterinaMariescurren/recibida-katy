// Fecha del evento: 11 de Abril de 2026, 21:00hs
const FECHA_EVENTO = new Date('2026-04-11T21:00:00');

function actualizarCountdown() {
  const ahora = new Date();
  const diferencia = FECHA_EVENTO - ahora;

  if (diferencia <= 0) {
    ['days','hours','minutes','seconds'].forEach(id => {
      document.getElementById(id).textContent = '00';
    });
    return;
  }

  const dias     = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas    = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos  = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  document.getElementById('days').textContent    = String(dias).padStart(2, '0');
  document.getElementById('hours').textContent   = String(horas).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutos).padStart(2, '0');
  document.getElementById('seconds').textContent = String(segundos).padStart(2, '0');
}

actualizarCountdown();
setInterval(actualizarCountdown, 1000);