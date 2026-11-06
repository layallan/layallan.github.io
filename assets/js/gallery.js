for (const gallery of document.querySelectorAll(".photo-gallery")) {
  const frame = gallery.querySelector(".photo-frame");
  const slides = Array.from(frame.querySelectorAll("img"));
  const controls = gallery.querySelector(".gallery-controls");
  const counter = controls.querySelector("[aria-live]");
  const playback = document.createElement("button");
  playback.type = "button";
  playback.className = "gallery-playback";
  controls.prepend(playback);
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let playing = !motionPreference.matches;
  let inView = false;
  let timer;
  let current = 0;

  function updatePlayback() {
    clearInterval(timer);
    playback.textContent = playing ? "Pause" : "Play";
    counter.setAttribute("aria-live", playing ? "off" : "polite");
    if (playing && inView && !document.hidden) {
      timer = setInterval(() => move(1), 5000);
    }
  }

  function browse(step) {
    move(step);
    updatePlayback();
  }

  function move(step) {
    slides[current].hidden = true;
    current = (current + step + slides.length) % slides.length;
    const slide = slides[current];
    if (!slide.hasAttribute("src")) slide.src = slide.dataset.src;
    slide.hidden = false;
    counter.textContent = (current + 1) + " / " + slides.length;
  }

  for (const button of controls.querySelectorAll("[data-step]")) {
    button.addEventListener("click", () => browse(Number(button.dataset.step)));
  }
  playback.addEventListener("click", () => {
    playing = !playing;
    updatePlayback();
  });
  motionPreference.addEventListener("change", event => {
    playing = !event.matches;
    updatePlayback();
  });
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
    updatePlayback();
  }, { threshold: 0.25 }).observe(frame);
  document.addEventListener("visibilitychange", updatePlayback);
  updatePlayback();
  controls.hidden = false;
  gallery.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      browse(event.key === "ArrowRight" ? 1 : -1);
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
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) browse(dx < 0 ? 1 : -1);
    start = null;
  }, { passive: true });
  frame.addEventListener("touchcancel", () => { start = null; });
}
