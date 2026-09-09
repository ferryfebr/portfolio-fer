/* ============================================================
   Skills & Tools — Flip Card (klik)
   ============================================================ */
function flipCard() {
  const grid = document.querySelector('.skills-grid');
  if (!grid) return;
  // delegation: satu listener di grid, jadi kartu clone (yang dibuat ulang
  // tiap resize di mobile) otomatis ke-bind tanpa harus re-pasang handler.
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.flip-card');
    if (!card) return;
    const inner = card.querySelector('.flip-card-inner');
    const flipped = card.classList.toggle('flipped');
    // pakai GSAP langsung biar menimpa sisa transform (terutama kartu HTML asli
    // yang nyangkut transform dari skillCardIntro) — jadi flip jalan di loop pertama
    if (window.gsap) {
      gsap.killTweensOf(inner);
      gsap.to(inner, {
        rotationY: flipped ? 180 : 0,
        duration: 0.7,
        ease: 'power3.inOut',
        force3D: true,
        overwrite: 'auto',
      });
    }
  });
}

/* ============================================================
   Skills — Scroll-Scrubbed Typewriter (intro paragraph)
   ============================================================ */
function skillsTypewriter() {
  const el = document.querySelector('.skills-intro');
  if (!el) return;
  const chars = [];
  const nodes = Array.from(el.childNodes);
  el.textContent = '';

  function splitInto(node, parent) {
    if (node.nodeType === Node.TEXT_NODE) {
      for (const char of node.textContent) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char;
        parent.appendChild(span);
        chars.push(span);
      }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.tagName === 'BR') {
      parent.appendChild(document.createElement('br'));
      return;
    }
    const clone = document.createElement(node.tagName);
    clone.className = node.className;
    node.childNodes.forEach((child) => splitInto(child, clone));
    parent.appendChild(clone);
  }

  nodes.forEach((node) => splitInto(node, el));

  gsap.from(chars, {
    opacity: 0,
    stagger: 0.005,
    duration: 0.5,
    scrollTrigger: {
      trigger: '.skills-intro',
      start: 'top 90%',
      end: 'bottom 35%',
      scrub: true,
    },
  });
}

/* ============================================================
   Skills — Flip Card (scroll intro: belakang → depan)
   ============================================================ */
function skillCardIntro() {
  const inners = gsap.utils.toArray('.flip-card-inner');
  if (!inners.length) return;
  ScrollTrigger.create({
    trigger: '.skills-grid',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.fromTo(inners,
        { rotateY: 225 },
      {
        rotateY: 0,
        duration: 1.5,
        ease: 'power2.inOut',
        immediateRender: false,   /* jangan pre-rotate kartu sebelum intro benar-benar jalan */
        onComplete: () => {
          gsap.set(inners, { clearProps: 'transform,rotationY' });
        },
      },
      );
    },
  });
}

function setupSkillsMarquee() {
  const grid = document.querySelector('.skills-grid');
  if (!grid) return;
  const isTablet = window.matchMedia('(max-width: 1024px)').matches;
  grid.querySelectorAll('.marquee-clone').forEach((el) => el.remove());
  if (isTablet) {
    Array.from(grid.children).forEach((child) => {
      const clone = child.cloneNode(true);
      clone.classList.add('marquee-clone');
      clone.setAttribute('aria-hidden', 'true');
      grid.appendChild(clone);
    });
  }
}

window.addEventListener('resize', setupSkillsMarquee);

/* Pasang animasi skills SETELAH loading screen dibuka (tombol "Go to Web"),
   biar ScrollTrigger ukur posisi bener & flip kelihatan (terutama di mobile
   yang section-nya ditarik ke atas sehingga grid masuk viewport awal). */
function initSkills() {
  /* bersihkan sisa transform dari skillCardIntro biar kartu HTML asli
     nggak nyangkut rotateY (penyebab cuma clone yang bisa flip) */
  if (window.gsap) gsap.set('.flip-card-inner', { clearProps: 'transform,rotationY' });
  setupSkillsMarquee();
  flipCard();
  skillsTypewriter();
  skillCardIntro();
  ScrollTrigger.refresh();
}

window.addEventListener('load', () => {
  const goBtn = document.getElementById('goToWebBtn');
  if (goBtn) {
    goBtn.addEventListener('click', initSkills, { once: true });
  }
  /* fallback: kalau loading screen gak dipakai, langsung init */
  if (!document.body.classList.contains('loading-lock')) {
    initSkills();
  }
});
