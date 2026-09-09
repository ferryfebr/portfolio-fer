(function () {
  const cursor = document.getElementById('customCursor');
  const img = cursor.querySelector('img');
  if (!cursor || !img) return;

  /* Tablet / layar sentuh: tidak ada cursor, langsung sembunyikan */
  if (window.matchMedia('(max-width: 1024px)').matches || window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    return;
  }

  const BASE_ANGLE = -135.5;
  const ROTATION_OFFSET = -BASE_ANGLE;

  cursor.style.visibility = 'hidden';

  let mouseX = 0, mouseY = 0;
  let lastX = 0, lastY = 0;
  let currentAngle = 0;

  function applyRotation(deg) {
    img.style.transform = 'rotate(' + deg + 'deg)';
  }

  document.addEventListener('mousemove', function (e) {
    if (cursor.style.visibility === 'hidden') {
      cursor.style.visibility = 'visible';
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastX = mouseX;
      lastY = mouseY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
      return;
    }

    mouseX = e.clientX;
    mouseY = e.clientY;

    const dx = mouseX - lastX;
    const dy = mouseY - lastY;

    if (Math.abs(dx) + Math.abs(dy) > 0.5) {
      const target = Math.atan2(dy, dx) * (180 / Math.PI) + ROTATION_OFFSET;
      let diff = target - currentAngle;
      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;
      currentAngle += diff;
      applyRotation(currentAngle);
      lastX = mouseX;
      lastY = mouseY;
    }

    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  document.addEventListener('mouseleave', function () {
    cursor.style.visibility = 'hidden';
  });

  document.addEventListener('mouseenter', function (e) {
    cursor.style.visibility = 'visible';
    lastX = e.clientX;
    lastY = e.clientY;
  });
})();