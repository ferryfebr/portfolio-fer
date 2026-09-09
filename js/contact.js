/* ============================================================
   Contact — Drawer Toggle
   ============================================================ */
function toggleDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  const isOpen = drawer.classList.toggle('open');
  drawer.setAttribute('aria-hidden', !isOpen);
}

window.addEventListener('load', () => {
  const btn = document.getElementById('getInTouch');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleDrawer();
    });
  }

  const close = document.getElementById('drawerClose');
  if (close) {
    close.addEventListener('click', (e) => {
      e.preventDefault();
      toggleDrawer();
    });
  }

  const form = document.getElementById('drawerForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      toggleDrawer();
    });
  }
});