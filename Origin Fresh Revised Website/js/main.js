// Origin Fresh — base interaction layer (scroll reveals, ticker duplication, nav state)
// Cinematic scroll-driven treatment lands in a later pass; this keeps the
// static build from feeling inert while we review layout/copy/fonts.

document.addEventListener('DOMContentLoaded', () => {
  // Duplicate ticker content once so the CSS marquee loops seamlessly.
  document.querySelectorAll('.ticker__track').forEach((track) => {
    track.innerHTML += track.innerHTML;
  });

  // Reveal-on-scroll for anything flagged data-reveal.
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Category chip active state (visual only for now).
  document.querySelectorAll('.chip-row').forEach((row) => {
    row.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      row.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
    });
  });

  // Fruit-hotspot video (Why Choose section): hovering the video pauses it
  // and drops it to grayscale (fruit hotspots stay marked via CSS glow);
  // hovering a specific hotspot reveals that fruit's USP tooltip.
  document.querySelectorAll('.fruit-video').forEach((wrap) => {
    const video = wrap.querySelector('.fruit-video__media');
    wrap.addEventListener('mouseenter', () => {
      wrap.classList.add('is-hovering');
      if (video && video.pause) video.pause();
    });
    wrap.addEventListener('mouseleave', () => {
      wrap.classList.remove('is-hovering');
      if (video && video.play) video.play().catch(() => {});
    });
  });

  // Eve launcher click/talking behavior now lives in js/eve.js, which
  // owns the chat panel and toggles .is-talking while waiting on a reply.
});
