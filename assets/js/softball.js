(() => {
  const sections = [...document.querySelectorAll('[data-parallax]')];
  if (!sections.length) return;
  const photos = [...document.querySelectorAll('.softball-page__floating-photo')].map((element) => ({
    element,
    speed: Number.parseFloat(getComputedStyle(element).getPropertyValue('--photo-speed')) || 1,
  }));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;
  const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
  const update = () => {
    frame = null;
    sections.forEach((section) => {
      if (motion.matches) {
        section.style.removeProperty('--parallax-y');
        return;
      }
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * .12;
      section.style.setProperty('--parallax-y', `${clamp(offset, 40)}px`);
    });
    photos.forEach(({ element, speed }) => {
      if (motion.matches) {
        element.style.removeProperty('--photo-y');
        return;
      }
      const parent = element.offsetParent;
      if (!parent) return;
      const top = parent.getBoundingClientRect().top + element.offsetTop;
      const offset = (window.innerHeight / 2 - top - element.offsetHeight / 2) * .18 * speed;
      element.style.setProperty('--photo-y', `${clamp(offset, 70)}px`);
    });
  };
  const schedule = () => {
    if (frame === null) frame = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  motion.addEventListener('change', schedule);
  schedule();
})();
