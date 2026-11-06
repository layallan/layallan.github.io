for (const gallery of document.querySelectorAll(".photo-gallery")) {
  const frame = gallery.querySelector(".photo-frame");
  const slides = Array.from(frame.querySelectorAll("img"));
  const controls = gallery.querySelector(".gallery-controls");
  const counter = controls.querySelector("[aria-live]");
  let current = 0;

  function move(step) {
    slides[current].hidden = true;
    current = (current + step + slides.length) % slides.length;
    const slide = slides[current];
    if (!slide.hasAttribute("src")) slide.src = slide.dataset.src;
    slide.hidden = false;
    counter.textContent = (current + 1) + " / " + slides.length;
  }

  for (const button of controls.querySelectorAll("button")) {
    button.addEventListener("click", () => move(Number(button.dataset.step)));
  }
  controls.hidden = false;
  gallery.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowRight" ? 1 : -1);
    }
  });

  let start = null;
  frame.addEventListener("touchstart", event => {
    start = event.touches.length === 1 ? event.touches[0] : null;
  }, { passive: true });
  frame.addEventListener("touchend", event => {
    if (!start) return;
    const dx = event.changedTouches[0].clientX - start.clientX;
    const dy = event.changedTouches[0].clientY - start.clientY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
    start = null;
  }, { passive: true });
  frame.addEventListener("touchcancel", () => { start = null; });
}
