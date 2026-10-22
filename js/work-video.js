/* ============================================================
   Work — Video thumbnail + modal
   ============================================================ */
(function () {
  const modal = document.getElementById('videoModal');
  const player = document.getElementById('videoModalPlayer');
  const triggers = document.querySelectorAll('.work-card-video');
  if (!modal || !player || !triggers.length) return;

  const closeBtn = modal.querySelector('.video-modal-close');
  let lastTrigger = null;

  function openModal(trigger) {
    const src = trigger.getAttribute('data-video');
    if (!src) return;

    lastTrigger = trigger;
    player.src = src;
    player.currentTime = 0;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('video-modal-open');

    const playPromise = player.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('video-modal-open');

    player.pause();
    player.removeAttribute('src');
    player.load();

    if (lastTrigger) lastTrigger.focus();
    lastTrigger = null;
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      openModal(trigger);
    });
  });

  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-video-close]')) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  /* Ambil frame pertama video sebagai thumbnail sementara */
  const thumbs = document.querySelectorAll('.work-card-thumb[data-thumb]');
  if (!thumbs.length) return;

  const videoSrc = triggers[0].getAttribute('data-video');
  const probe = document.createElement('video');
  probe.src = videoSrc;
  probe.muted = true;
  probe.playsInline = true;
  probe.preload = 'auto';

  probe.addEventListener('loadeddata', function () {
    probe.currentTime = Math.min(1, (probe.duration || 2) / 3);
  });

  probe.addEventListener('seeked', function () {
    if (!probe.videoWidth || !probe.videoHeight) return;
    const canvas = document.createElement('canvas');
    canvas.width = probe.videoWidth;
    canvas.height = probe.videoHeight;
    canvas.getContext('2d').drawImage(probe, 0, 0);

    try {
      const frame = canvas.toDataURL('image/jpeg', 0.82);
      thumbs.forEach(function (thumb) {
        thumb.src = frame;
      });
    } catch (err) {
      /* Bila canvas ter-taint (mis. file://), biarkan placeholder */
    }

    probe.removeAttribute('src');
    probe.load();
  });

  probe.load();
})();
