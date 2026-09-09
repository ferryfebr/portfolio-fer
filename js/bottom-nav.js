/* ============================================================
   Bottom Navigation — Mobile (active state + smooth scroll)
   ============================================================ */
(function () {
  const links = document.querySelectorAll('.bottom-nav a');
  if (!links.length) return;

  const map = {};
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) map[href.slice(1)] = link;

    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || !id.startsWith('#')) return;
      e.preventDefault();
      if (id === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  function setActive(id) {
    links.forEach((l) => l.classList.remove('active'));
    const link = map[id];
    if (link) link.classList.add('active');
  }

  /* scroll-spy: tandai menu sesuai section yang sedang terlihat */
  const targets = [
    { id: 'home', el: document.querySelector('.hero') },
    { id: 'skills', el: document.getElementById('skills') },
    { id: 'work', el: document.getElementById('work') },
    { id: 'contact', el: document.getElementById('contact') },
  ].filter((t) => t.el);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.dataset.navid);
    });
  }, { threshold: 0.5 });

  targets.forEach((t) => {
    t.el.dataset.navid = t.id;
    observer.observe(t.el);
  });
})();
