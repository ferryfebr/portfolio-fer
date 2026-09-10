gsap.registerPlugin(ScrollTrigger);

/* DEBUG: cek lebar viewport aktual di HP asli */
console.log('Viewport width:', window.innerWidth);
document.title = `Width: ${window.innerWidth}px`;

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
