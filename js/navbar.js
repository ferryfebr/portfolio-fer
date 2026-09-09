/* ============================================================
   Navbar — Fade-in intro
   ============================================================ */
window.addEventListener('load', () => {
  gsap.from('.navbar', {
    y: -20,
    autoAlpha: 0,
    duration: 0.6,
    ease: 'power2.out',
  });
});

/* Tablet: sembunyikan baris 1 saat scroll, badge tetap di atas */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});
