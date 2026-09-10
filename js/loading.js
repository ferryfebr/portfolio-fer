/* ============================================================
   Loading Screen + Music Player
   ============================================================ */
const loadingScreen = document.getElementById('loadingScreen');
const loadingPercent = document.getElementById('loadingPercent');
const loadingBarFill = document.getElementById('loadingBarFill');
const goToWebBtn = document.getElementById('goToWebBtn');
const playPauseBtn = document.getElementById('playPauseBtn');

let audio = null;
function getAudio() {
  if (!audio) {
    audio = new Audio('asset/audio/kabar-bahagia.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.addEventListener('timeupdate', () => {
      if (!audio.paused && audio.currentTime > 0 && audio.currentTime < SKIP_START_SECONDS) {
        audio.currentTime = SKIP_START_SECONDS;
      }
    });
    const syncIcon = () => {
      if (audio.paused) playPauseBtn.classList.remove('is-playing');
      else playPauseBtn.classList.add('is-playing');
    };
    audio.addEventListener('play', syncIcon);
    audio.addEventListener('pause', syncIcon);
    audio.addEventListener('ended', syncIcon);
    audio.addEventListener('error', syncIcon);
  }
  return audio;
}

const LOADING_DURATION = 5000;
const SKIP_START_SECONDS = 12;

function animateLoading() {
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / LOADING_DURATION, 1);
    const percent = Math.round(progress * 100);

    if (loadingPercent) loadingPercent.textContent = percent + '%';
    if (loadingBarFill) loadingBarFill.style.width = percent + '%';

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      if (loadingPercent) loadingPercent.classList.add('faded');
      if (goToWebBtn) goToWebBtn.classList.add('visible');
    }
  }

  requestAnimationFrame(step);
}

function showPlayer() {
  const player = document.querySelector('.music-player');
  if (player) player.classList.add('show');
}

goToWebBtn.addEventListener('click', () => {
  loadingScreen.classList.add('hidden');
  document.body.classList.remove('loading-lock');

  const a = getAudio();
  a.play();
  playPauseBtn.classList.add('is-playing');
  showPlayer();

  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});

playPauseBtn.addEventListener('click', () => {
  const a = getAudio();
  if (a.paused) {
    a.play();
    playPauseBtn.classList.add('is-playing');
  } else {
    a.pause();
    playPauseBtn.classList.remove('is-playing');
  }
});

window.addEventListener('load', animateLoading);