/* ============================================================
   Hero — Helpers
   ============================================================ */
function splitToLetters(el) {
  const text = el.textContent;
  el.textContent = '';
  for (const char of text) {
    const span = document.createElement('span');
    span.className = 'h-letter' + (el.classList.contains('is-green') ? ' is-green' : ' is-white');
    span.textContent = char === ' ' ? '\u00A0' : char;
    el.appendChild(span);
  }
}

/* ============================================================
   Hero — Word Rotator
   ============================================================ */
function wordCycler() {
  const words = ['Ferry', 'WebDev', 'UI/UX'];
  const el = document.querySelector('.text-swap');
  if (!el) return;
  splitToLetters(el);
  let i = 0;
  setInterval(() => {
    i = (i + 1) % words.length;
    const next = words[i];
    gsap.to(el, {
      y: '0.4em',
      autoAlpha: 0,
      duration: 0.2,
      ease: 'power1.in',
      onComplete: () => {
        el.textContent = next;
        splitToLetters(el);
        gsap.fromTo(
          el,
          { y: '-0.4em', autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out' }
        );
      },
    });
  }, 5000);
}

/* ============================================================
   Hero — Scroll-Scrubbed Typewriter
   ============================================================ */
function scrollTypewriter() {
  const el = document.querySelector('.subheadline');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  const chars = [];
  for (const char of text) {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    el.appendChild(span);
    chars.push(span);
  }
  gsap.from(chars, {
    opacity: 0,
    stagger: 0.005,
    duration: 0.12,
    scrollTrigger: {
      trigger: '.subheadline',
      start: 'top 90%',
      end: 'bottom 35%',
      scrub: true,
    },
  });
}

/* ============================================================
   Hero — Static letter split (headline)
   ============================================================ */
function splitHeadlineStatic() {
  const el = document.querySelector('.headline-static');
  if (!el) return;
  splitToLetters(el);
}

/* ============================================================
   Hero — Fade-in intro (navbar → chat → headline → dll)
   ============================================================ */
function heroIntro() {
  gsap.from('.hero-chat', { autoAlpha: 0, duration: 0.5, delay: 0.15, ease: 'power2.out' });
  gsap.from('.hero-headline', { y: 30, autoAlpha: 0, duration: 0.7, delay: 0.3, ease: 'power2.out' });
  gsap.from('.subheadline', { y: 20, autoAlpha: 0, duration: 0.6, delay: 0.5, ease: 'power2.out' });
  gsap.from('.hero-cta', { y: 20, autoAlpha: 0, duration: 0.6, delay: 0.7, ease: 'power2.out' });
  gsap.from('.hero-person', { autoAlpha: 0, duration: 0.7, delay: 0.9, ease: 'power2.out' });
}

/* ============================================================
   Init
   ============================================================ */
window.addEventListener('load', () => {
  splitHeadlineStatic();
  wordCycler();
  scrollTypewriter();
  heroIntro();
  ScrollTrigger.refresh();
});
