/* ============================================================
   Services — Exclusive Hover Accordion + Typewriter desc
   ============================================================ */
const TYPING_DURATION = 1.5; // detik — atur durasi typewriter di sini

let typeTween = null;

function typewriteDesc(item, duration) {
  const desc = item.querySelector('.accordion-desc');
  if (!desc) return;
  if (!desc.dataset.fullText) desc.dataset.fullText = desc.textContent;
  const fullText = desc.dataset.fullText;

  if (typeTween) typeTween.kill();
  desc.textContent = '';

  const proxy = { n: 0 };
  typeTween = gsap.to(proxy, {
    n: fullText.length,
    duration: duration,
    ease: 'none',
    onUpdate: () => {
      desc.textContent = fullText.substring(0, Math.round(proxy.n));
    },
  });
}

function accordionHover() {
  const items = gsap.utils.toArray('.accordion-item');
  if (!items.length) return;
  let timer = null;

  function open(item) {
    items.forEach((it) => it.classList.remove('active'));
    item.classList.add('active');
  }

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      clearTimeout(timer);
      timer = setTimeout(() => open(item), 150);
    });
  });

  const accordion = document.querySelector('.services-accordion');
  accordion.addEventListener('mouseleave', () => {
    clearTimeout(timer);
    const first = items[0];
    if (first) open(first);
  });
}

/* ============================================================
   Services — Scroll Fade-in (semua item bersamaan)
   ============================================================ */
function servicesFadeIn() {
  const section = document.querySelector('.services-section');
  const items = gsap.utils.toArray('.accordion-item');
  if (!section || !items.length) return;

  gsap.from(items, {
    autoAlpha: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 100',
    },
  });
}

window.addEventListener('load', () => {
  accordionHover();
  servicesFadeIn();
  ScrollTrigger.refresh();
});
