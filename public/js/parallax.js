const logo = document.querySelector('.logo-parallax');
if (logo) {
  let raf = null;
  let tx = 0, ty = 0, cx = 0, cy = 0;

  const onMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;  // -5..+5px
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    tx = x; ty = y;
    if (!raf) tick();
  };

  const tick = () => {
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    logo.style.transform = `translate(${cx}px, ${cy}px)`;
    if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  };

  window.addEventListener('mousemove', onMove, { passive: true });
}
