/* ============================================================
   Work — Scroll-Pinned Card Stack (rise & cover + paper 3D exit)
   Card 1 terlihat dulu; saat scroll, card berikutnya naik dari
   bawah menutupi card sebelumnya, sambil card lama terbang ke
   belakang serong kiri seperti kertas 3D.
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

function buildTimeline(tl, cards, HOLD, TRANSITION, EXIT_DELAY) {
  cards.forEach((card, i) => {
    if (i === 0) return;
    const start = HOLD + (i - 1) * (HOLD + TRANSITION);
    // card baru naik dari bawah menutupi card lama (smooth)
    tl.to(card, { yPercent: 0, duration: TRANSITION, ease: 'power2.inOut' }, start);
    // card lama terbang ke belakang serong kiri (mulai SETELAH card baru nutup)
    tl.to(
      cards[i - 1],
      {
        xPercent: -1,
        yPercent: -2,
        rotate: -3,
        rotateY: 10,
        scale: 0.8,
        transformPerspective: 800,
        duration: TRANSITION * 0.8,
        ease: 'power2.inOut',
      },
      start + EXIT_DELAY
    );
  });
}

function pinnedCardStack() {
  const section = document.querySelector('.work-stack-section');
  const pinWrap = document.querySelector('.work-stack-pin');
  const cards = gsap.utils.toArray('.work-card');
  const totalCards = cards.length;
  if (!section || !cards.length) return;

  /* Sembunyikan semua card kecuali pertama */
  cards.forEach((card, i) => {
    if (i > 0) gsap.set(card, { yPercent: 100 });
  });

  const mm = gsap.matchMedia();

  /* ---------- Desktop (>=1025px): GSAP pin (fixed) — tetap seperti sebelumnya, tidak diubah ---------- */
  mm.add('(min-width: 1025px)', () => {
    const HOLD = 0;
    const TRANSITION = 2.2;
    const EXIT_DELAY = 0.5;
    const SCROLL_PER_UNIT = 0.7;
    const distance = totalCards * (HOLD + TRANSITION) * SCROLL_PER_UNIT * 100;

    if (pinWrap) pinWrap.style.height = '';

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + distance + '%',
        pin: true,
        pinType: 'fixed',
        scrub: 0.5,
        anticipatePin: 1,
      },
    });
    buildTimeline(tl, cards, HOLD, TRANSITION, EXIT_DELAY);

    return () => {
      tl.scrollTrigger && tl.scrollTrigger.kill();
      tl.kill();
    };
  });

  /* ---------- Tablet (641–1024px): GSAP pin, Work di-render 1:1 ----------
     Root <html> punya zoom (sistem scaling). Kalau section Work ikut ter-zoom,
     koordinat pin GSAP (fixed/transform) melenceng → Mini naik, Pro turun,
     cuma iPad Air (zoom≈1) yang pas. Maka kita NETRALKAN zoom khusus di
     section Work: set --zoom=1 (biar calc(100vh/--zoom)=100vh) lalu zoom lokal
     1/rootZoom (membatalkan zoom root). Hasil: section 1:1 dgn viewport →
     pin 'fixed' jalan persis seperti iPad Air. Direset saat keluar breakpoint. ---------- */
  mm.add('(min-width: 641px) and (max-width: 1024px)', () => {
    const HOLD = 0;
    const TRANSITION = 2.2;
    const EXIT_DELAY = 0.5;
    const SCROLL_PER_UNIT = 0.7;
    const distance = totalCards * (HOLD + TRANSITION) * SCROLL_PER_UNIT * 100;

    // netralkan zoom root di SELURUH subtree Work (.work-stack-pin + section + card
    // + pin-spacer GSAP). Kalau cuma section yg di-1:1, wrapper pembungkus tetap
    // ter-zoom → pin-spacer ikut diskalakan → Mini gap nyusut (numpuk), Pro gap
    // membesar. Biar sama rata dgn iPad Air (zoom=1), seluruh Work di-render 1:1.
    var rootZoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom')) || 1;
    if (pinWrap) {
      pinWrap.style.setProperty('--zoom', 1);
      pinWrap.style.zoom = 1 / rootZoom;
    }

    if (pinWrap) pinWrap.style.height = '';

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + distance + '%',
        pin: true,
        // zoom root < 1 (device < 820px, mis. iPad Mini) => wrapper di-upscale oleh
        // zoom lokal => jadi containing block untuk position:fixed => pin kolaps.
        // Pakai 'transform' (GSAP-recommended untuk ancestor ber-zoom). Device >= 820px
        // (iPad Air/Pro) tetap 'fixed' karena sudah terbukti perfect.
        pinType: (rootZoom < 1) ? 'transform' : 'fixed',
        scrub: 0.5,
        anticipatePin: 1,
      },
    });
    buildTimeline(tl, cards, HOLD, TRANSITION, EXIT_DELAY);

    return () => {
      if (pinWrap) {
        pinWrap.style.zoom = '';
        pinWrap.style.removeProperty('--zoom');
      }
      tl.scrollTrigger && tl.scrollTrigger.kill();
      tl.kill();
    };
  });

  /* ---------- Mobile (<=640): CSS sticky pin (tanpa GSAP fixed → gak loncat ke kiri) ----------
     Konstanta DISAMAKAN dengan desktop/tablet biar durasi & pacing selaras ---------- */
  mm.add('(max-width: 640px)', () => {
    const HOLD = 0;
    const TRANSITION = 2.2;
    const EXIT_DELAY = 0.5;
    const SCROLL_PER_UNIT = 0.7;
    const distance = totalCards * (HOLD + TRANSITION) * SCROLL_PER_UNIT * 100;

    // tinggi wrapper = 1 layar (section) + jarak scroll biar sticky bertahan selama animasi
    if (pinWrap) pinWrap.style.height = (distance + 100) + 'vh';

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: pinWrap || section,
        start: 'top top',
        end: 'bottom bottom',   // kelar tepat saat sticky lepas → gak ada scroll mati di ujung
        pin: false,
        scrub: 0.5,
      },
    });
    buildTimeline(tl, cards, HOLD, TRANSITION, EXIT_DELAY);

    return () => {
      if (pinWrap) pinWrap.style.height = '';
      tl.scrollTrigger && tl.scrollTrigger.kill();
      tl.kill();
    };
  });
}

window.addEventListener('load', () => {
  pinnedCardStack();
  ScrollTrigger.refresh();
});
