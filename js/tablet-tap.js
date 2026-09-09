/* ============================================================
   Tablet — Tap Toggle (ganti hover jadi tap persist)
   Hanya jalan di tablet. Elemen kontrol: tap sekali nyala,
   tap lagi mati (class .is-tap). Tidak ganggu handler klik
   yang sudah ada (drawer, navigasi, dll).
   ============================================================ */
(function () {
  const isTablet = window.matchMedia('(max-width: 1024px)').matches;
  if (!isTablet) return;

  const tapSelectors = [
    '.nav-pill',
    '.nav-contact-btn',
    '.hero-cta-btn',
    '.skills-cta-btn',
    '.contact-pill',
    '.get-in-touch-btn',
    '.player-play-pause',
    '.go-to-web-btn.visible'
  ];

  const elements = document.querySelectorAll(tapSelectors.join(','));
  elements.forEach(function (el) {
    el.addEventListener('click', function () {
      el.classList.toggle('is-tap');
    });
  });
})();
