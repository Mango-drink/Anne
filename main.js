// ====================================================================
// main.js — sitio ENMyH
// ====================================================================

// Espera a que el DOM esté listo para evitar "null" en getElementById
document.addEventListener('DOMContentLoaded', () => {
  // Año dinámico en el footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Botón CV:
  // Ya no usamos window.print(). El botón/Link debe ser un <a href="...pdf" download>.
  // Aun así protegemos por si existe el id y quieres hacer algo en el futuro.
  const btnCv = document.getElementById('btn-cv');
  if (btnCv) {
    // Ejemplo opcional: tracking
    // btnCv.addEventListener('click', () => console.log('Descargando CV'));
  }

  // Scroll suave (fallback simple)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Galería - Carrusel simple
  document.querySelectorAll('.carousel').forEach(initCarousel);
});

// ====================== Carrusel ======================
function initCarousel(root) {
  const track = root.querySelector('.c-track');
  const slides = Array.from(root.querySelectorAll('.c-slide'));
  const prevBtn = root.querySelector('.c-prev');
  const nextBtn = root.querySelector('.c-next');
  const dotsWrap = root.querySelector('.c-dots');
  const autoplayMs = parseInt(root.dataset.autoplay || '0', 10);

  if (!track || !slides.length || !prevBtn || !nextBtn || !dotsWrap) return;

  let index = 0;
  let timer = null;
  let isHover = false;
  let startX = 0;
  let deltaX = 0;
  let isDragging = false;

  // Crear dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'c-dot' + (i === 0 ? ' is-active' : '');
    dot.type = 'button';
    dot.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function update() {
    track.style.transform = `translateX(${index * -100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }
  function goTo(i, user = false) {
    index = (i + slides.length) % slides.length;
    update();
    if (user && autoplayMs) restartAutoplay();
  }
  const next = (user = false) => goTo(index + 1, user);
  const prev = (user = false) => goTo(index - 1, user);

  // Botones
  prevBtn.addEventListener('click', () => prev(true));
  nextBtn.addEventListener('click', () => next(true));

  // Autoplay
  function startAutoplay() {
    if (!autoplayMs) return;
    stopAutoplay();
    timer = setInterval(() => {
      if (!isHover && !isDragging) next(false);
    }, autoplayMs);
  }
  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  root.addEventListener('mouseenter', () => { isHover = true; });
  root.addEventListener('mouseleave', () => { isHover = false; });

  // Teclado (accesible)
  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(true); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(true); }
  });

  // Swipe / drag
  function onPointerDown(e) {
    isDragging = true;
    root.classList.add('grabbing');
    startX = getX(e);
    deltaX = 0;
  }
  function onPointerMove(e) {
    if (!isDragging) return;
    deltaX = getX(e) - startX;
    // arrastre visual
    track.style.transform = `translateX(calc(${index * -100}% + ${deltaX * -0.3}px))`;
  }
  function onPointerUp() {
    if (!isDragging) return;
    root.classList.remove('grabbing');
    isDragging = false;
    const threshold = 50; // px
    if (deltaX < -threshold) next(true);
    else if (deltaX > threshold) prev(true);
    else update();
  }
  const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  root.addEventListener('mousedown', onPointerDown);
  root.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  root.addEventListener('touchstart', onPointerDown, { passive: true });
  root.addEventListener('touchmove', onPointerMove, { passive: true });
  root.addEventListener('touchend', onPointerUp);

  // Iniciar
  update();
  startAutoplay();
}
// ==================== Fin Carrusel ====================
