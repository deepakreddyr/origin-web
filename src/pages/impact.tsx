import { useEffect, useRef } from 'react';
import Head from 'next/head';

// If your images live somewhere else, just change this one constant.
const IMG_BASE = '/assets/images/impact';

export default function ImpactPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cleanupFns: Array<() => void> = [];

    // ---- Fade up ----
    const fadeEls = Array.from(root.querySelectorAll<HTMLElement>('.fade-up'));
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const siblings = Array.from(target.parentNode!.querySelectorAll<HTMLElement>('.fade-up'));
            const i = siblings.indexOf(target);
            setTimeout(() => target.classList.add('visible'), Math.max(0, i) * 100);
            fadeObserver.unobserve(target);
          }
        });
      },
      { threshold: 0.15 }
    );
    fadeEls.forEach((el) => fadeObserver.observe(el));
    cleanupFns.push(() => fadeObserver.disconnect());

    // ---- Count up ----
    const counters = Array.from(root.querySelectorAll<HTMLElement>('.count'));
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = parseInt(el.dataset.target || '0', 10);
            const duration = 1800;
            const start = performance.now();
            const animate = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.floor(eased * target).toLocaleString();
              if (progress < 1) requestAnimationFrame(animate);
              else el.textContent = target.toLocaleString();
            };
            requestAnimationFrame(animate);
            countObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => countObserver.observe(el));
    cleanupFns.push(() => countObserver.disconnect());

    // ---- City reveal ----
    const cityNames = Array.from(root.querySelectorAll<HTMLElement>('.city-name'));
    const cityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const cols = Array.from(target.parentNode!.querySelectorAll<HTMLElement>('.city-name'));
            cols.forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 180));
            cols.forEach((el) => cityObserver.unobserve(el));
          }
        });
      },
      { threshold: 0.3 }
    );
    cityNames.forEach((el) => cityObserver.observe(el));
    cleanupFns.push(() => cityObserver.disconnect());

    // ---- Chain reveal ----
    const chainOrigin = root.querySelector<HTMLElement>('#chainOrigin');
    const chainObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            chainOrigin?.classList.add('visible');
            chainObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (chainOrigin) chainObserver.observe(chainOrigin);
    cleanupFns.push(() => chainObserver.disconnect());

    // ---- Progress bar ----
    const progressBar = root.querySelector<HTMLElement>('#progressBar');
    const onScroll = () => {
      if (!progressBar) return;
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (scrolled / max) * 100 + '%';
    };
    window.addEventListener('scroll', onScroll);
    cleanupFns.push(() => window.removeEventListener('scroll', onScroll));

    return () => cleanupFns.forEach((fn) => fn());
  }, []);

  return (
    <>
      <Head>
        <title>Impact Report 2026 — Origin Fresh</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        :root {
          --origin-yellow: #ffd000;
          --origin-gold: #fbab18;
          --origin-soft: #f9db5a;
          --origin-cream: #faf7f0;
          --origin-ink: #1a1a1a;
          --origin-ink-soft: #2a2a2a;
          --origin-forest: #2d4a2b;
          --origin-forest-soft: #c8d5c2;
          --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
          --display: 'Fraunces', Georgia, serif;
          --body: 'Inter', -apple-system, sans-serif;
        }

        .impact-page * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .impact-page {
          scroll-behavior: auto;
        }
        .impact-page {
          font-family: var(--body);
          color: var(--origin-ink);
          background: var(--origin-cream);
          line-height: 1.5;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .impact-page .container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 56px;
        }
        @media (max-width: 768px) {
          .impact-page .container {
            padding: 0 24px;
          }
        }

        /* =================== NAV =================== */
        .impact-page .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          padding: 24px 56px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1000;
          transition: all 0.5s var(--ease-out);
          pointer-events: none;
        }
        .impact-page .nav > * {
          pointer-events: auto;
        }
        .impact-page .nav-logo {
          font-family: var(--display);
          font-weight: 500;
          font-size: 20px;
          letter-spacing: -0.01em;
          font-style: italic;
          color: var(--origin-ink);
          mix-blend-mode: difference;
          filter: invert(1);
        }
        .impact-page .nav-meta {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 500;
          color: var(--origin-ink);
          mix-blend-mode: difference;
          filter: invert(1);
        }
        @media (max-width: 768px) {
          .impact-page .nav {
            padding: 16px 24px;
          }
          .impact-page .nav-logo {
            font-size: 16px;
          }
          .impact-page .nav-meta {
            display: none;
          }
        }

        .impact-page .progress {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 208, 0, 0.15);
          z-index: 1001;
        }
        .impact-page .progress-bar {
          height: 100%;
          background: var(--origin-yellow);
          width: 0;
          transition: width 0.1s linear;
        }

        .impact-page .placeholder {
          background: repeating-linear-gradient(
            45deg,
            rgba(0, 0, 0, 0.04),
            rgba(0, 0, 0, 0.04) 12px,
            rgba(0, 0, 0, 0.06) 12px,
            rgba(0, 0, 0, 0.06) 24px
          );
          border: 1.5px dashed rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 8px;
          color: rgba(0, 0, 0, 0.55);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          text-align: center;
          padding: 24px;
        }
        .impact-page .placeholder-label {
          font-size: 11px;
          letter-spacing: 0.25em;
          font-weight: 700;
        }
        .impact-page .placeholder-spec {
          font-size: 10px;
          letter-spacing: 0.15em;
          font-weight: 400;
          opacity: 0.7;
          text-transform: none;
          font-style: italic;
        }
        .impact-page .placeholder-dark {
          background: repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.04),
            rgba(255, 255, 255, 0.04) 12px,
            rgba(255, 255, 255, 0.06) 12px,
            rgba(255, 255, 255, 0.06) 24px
          );
          border: 1.5px dashed rgba(255, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.7);
        }
        .impact-page .placeholder-on-yellow {
          background: repeating-linear-gradient(
            45deg,
            rgba(0, 0, 0, 0.05),
            rgba(0, 0, 0, 0.05) 12px,
            rgba(0, 0, 0, 0.05) 12px,
            rgba(0, 0, 0, 0.08) 12px,
            rgba(0, 0, 0, 0.08) 24px
          );
          border: 1.5px dashed rgba(0, 0, 0, 0.3);
        }

        .impact-page .scene-placeholder {
          position: absolute;
          inset: 0;
          background: var(--origin-ink);
          overflow: hidden;
        }
        .impact-page .scene-placeholder::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.025),
            rgba(255, 255, 255, 0.025) 16px,
            rgba(255, 255, 255, 0.045) 16px,
            rgba(255, 255, 255, 0.045) 32px
          );
        }
        .impact-page .scene-placeholder-label {
          position: absolute;
          top: 24px;
          left: 24px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 600;
          background: rgba(0, 0, 0, 0.4);
          padding: 8px 14px;
          border: 1px dashed rgba(255, 255, 255, 0.3);
          z-index: 3;
        }

        .impact-page .title-card {
          height: 100vh;
          background: var(--origin-ink);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--origin-cream);
          position: relative;
          overflow: hidden;
        }
        .impact-page .title-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(255, 208, 0, 0.08) 0%, transparent 65%);
        }
        .impact-page .title-eyebrow {
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: 15px;
          letter-spacing: 0.15em;
          color: var(--origin-yellow);
          margin-bottom: 40px;
          opacity: 0;
          animation: fadeUp 1.2s var(--ease-out) 0.4s forwards;
        }
        .impact-page .title-headline {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(56px, 9vw, 144px);
          line-height: 0.95;
          letter-spacing: -0.04em;
          margin-bottom: 32px;
          opacity: 0;
          animation: fadeUp 1.6s var(--ease-out) 0.9s forwards;
          position: relative;
          z-index: 2;
        }
        .impact-page .title-headline em {
          font-style: italic;
          font-weight: 300;
        }
        .impact-page .title-meta {
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          opacity: 0;
          animation: fadeUp 1.2s var(--ease-out) 1.6s forwards;
          position: relative;
          z-index: 2;
        }
        .impact-page .title-scroll {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          opacity: 0;
          animation: fadeUp 1.2s var(--ease-out) 2.2s forwards;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          z-index: 2;
        }
        .impact-page .title-scroll-line {
          width: 1px;
          height: 60px;
          background: rgba(250, 247, 240, 0.3);
          position: relative;
          overflow: hidden;
        }
        .impact-page .title-scroll-line::after {
          content: '';
          position: absolute;
          top: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--origin-yellow);
          animation: scrollLine 2.4s ease-in-out infinite;
        }
        @keyframes scrollLine {
          to {
            top: 100%;
          }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .impact-page .scene {
          height: 100vh;
          position: relative;
        }
        .impact-page .scene-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          background: var(--origin-ink);
        }
        .impact-page .scene-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          z-index: 1;
        }
        .impact-page .scene-bg-01 {
          background-image: url('${IMG_BASE}/coriander-hands.jpg');
          background-position: center right;
        }
        .impact-page .scene-bg-02 {
          background-image: url('${IMG_BASE}/farmer-woman-field.jpg');
          background-position: center;
        }
        .impact-page .scene-bg-finale {
          background-image: url('${IMG_BASE}/lauki-crates.jpg');
          background-position: center;
        }

        .impact-page .scene-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.35) 0%,
            rgba(0, 0, 0, 0.15) 40%,
            rgba(0, 0, 0, 0.75) 100%
          );
          z-index: 2;
        }
        .impact-page .scene-gradient-left {
          background: linear-gradient(90deg, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.35) 45%, rgba(0, 0, 0, 0.05) 100%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.4) 100%);
        }
        .impact-page .scene-gradient-right {
          background: linear-gradient(
              270deg,
              rgba(0, 0, 0, 0.72) 0%,
              rgba(0, 0, 0, 0.35) 45%,
              rgba(0, 0, 0, 0.05) 100%
            ),
            linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.4) 100%);
        }
        .impact-page .scene-gradient-center {
          background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.35) 0%,
            rgba(0, 0, 0, 0.65) 65%,
            rgba(0, 0, 0, 0.85) 100%
          );
        }
        .impact-page .scene-text {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          z-index: 3;
          color: var(--origin-cream);
        }
        .impact-page .scene-text-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 56px;
          width: 100%;
        }
        .impact-page .scene-text-right .scene-text-inner {
          text-align: right;
        }
        .impact-page .scene-eyebrow {
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: 16px;
          color: var(--origin-yellow);
          margin-bottom: 32px;
          letter-spacing: 0.05em;
        }
        .impact-page .scene-headline {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(48px, 7.5vw, 120px);
          line-height: 0.95;
          letter-spacing: -0.03em;
          max-width: 950px;
          margin-bottom: 32px;
        }
        .impact-page .scene-text-right .scene-headline {
          margin-left: auto;
        }
        .impact-page .scene-headline em {
          font-style: italic;
          font-weight: 300;
        }
        .impact-page .scene-sub {
          font-family: var(--display);
          font-weight: 300;
          font-size: clamp(18px, 1.6vw, 24px);
          line-height: 1.45;
          max-width: 560px;
          opacity: 0.92;
        }
        .impact-page .scene-text-right .scene-sub {
          margin-left: auto;
        }
        @media (max-width: 768px) {
          .impact-page .scene-text-inner {
            padding: 0 24px;
          }
        }

        .impact-page .section {
          padding: 140px 0;
          background: var(--origin-cream);
        }
        @media (max-width: 768px) {
          .impact-page .section {
            padding: 80px 0;
          }
        }

        .impact-page .section-eyebrow {
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .impact-page .section-eyebrow::before {
          content: '';
          display: block;
          width: 40px;
          height: 1px;
          background: var(--origin-ink);
        }

        .impact-page .framework {
          background: var(--origin-cream);
          padding: 160px 0;
        }
        .impact-page .framework-headline {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(48px, 6.5vw, 96px);
          line-height: 0.95;
          letter-spacing: -0.03em;
          max-width: 1100px;
          margin-bottom: 56px;
        }
        .impact-page .framework-headline em {
          font-style: italic;
          font-weight: 300;
        }
        .impact-page .framework-intro {
          font-family: var(--display);
          font-weight: 300;
          font-size: clamp(20px, 1.6vw, 26px);
          line-height: 1.5;
          max-width: 760px;
          margin-bottom: 100px;
        }
        .impact-page .pillar-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          padding-top: 56px;
          border-top: 1px solid rgba(26, 26, 26, 0.15);
        }
        .impact-page .pillar-card {
          padding: 0;
        }
        .impact-page .pillar-card-num {
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: 14px;
          color: var(--origin-gold);
          margin-bottom: 24px;
          letter-spacing: 0.05em;
        }
        .impact-page .pillar-card-title {
          font-family: var(--display);
          font-weight: 400;
          font-size: 28px;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }
        .impact-page .pillar-card-desc {
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: 17px;
          line-height: 1.4;
          color: rgba(26, 26, 26, 0.7);
        }
        @media (max-width: 768px) {
          .impact-page .pillar-cards {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .impact-page .stats-burst {
          background: var(--origin-yellow);
          padding: 140px 0;
          position: relative;
        }
        .impact-page .stats-burst .section-eyebrow::before {
          background: var(--origin-ink);
        }
        .impact-page .stats-burst-headline {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(48px, 6.5vw, 96px);
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }
        .impact-page .stats-burst-headline em {
          font-style: italic;
          font-weight: 300;
        }
        .impact-page .stats-burst-sub {
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: 20px;
          margin-bottom: 100px;
          opacity: 0.85;
        }
        .impact-page .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 48px 32px;
        }
        .impact-page .stat-item {
          border-top: 1px solid var(--origin-ink);
          padding-top: 24px;
        }
        .impact-page .stat-value {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(48px, 6vw, 88px);
          line-height: 0.95;
          letter-spacing: -0.04em;
          margin-bottom: 16px;
        }
        .impact-page .stat-value .suffix {
          font-size: 0.5em;
          font-weight: 300;
        }
        .impact-page .stat-label {
          font-size: 13px;
          font-weight: 500;
          line-height: 1.4;
          max-width: 160px;
        }
        @media (max-width: 1024px) {
          .impact-page .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 60px 40px;
          }
        }
        @media (max-width: 540px) {
          .impact-page .stats-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .impact-page .stats-burst {
            padding: 80px 0;
          }
        }

        .impact-page .pillar {
          padding: 160px 0;
          background: var(--origin-cream);
        }
        .impact-page .pillar-header {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 100px;
          margin-bottom: 120px;
          align-items: end;
        }
        .impact-page .pillar-num {
          font-family: var(--display);
          font-weight: 300;
          font-size: clamp(80px, 12vw, 180px);
          line-height: 0.8;
          color: var(--origin-gold);
          letter-spacing: -0.05em;
        }
        .impact-page .pillar-title-block .section-eyebrow {
          margin-bottom: 24px;
        }
        .impact-page .pillar-title {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(40px, 5vw, 76px);
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin-bottom: 32px;
        }
        .impact-page .pillar-title em {
          font-style: italic;
          font-weight: 300;
        }
        .impact-page .pillar-intro {
          font-family: var(--display);
          font-weight: 300;
          font-size: clamp(18px, 1.4vw, 22px);
          line-height: 1.55;
          max-width: 620px;
        }
        @media (max-width: 1024px) {
          .impact-page .pillar-header {
            grid-template-columns: 1fr;
            gap: 32px;
            margin-bottom: 80px;
          }
          .impact-page .pillar {
            padding: 80px 0;
          }
        }

        .impact-page .driver-barrier {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 120px;
          padding-bottom: 80px;
          border-bottom: 1px solid rgba(26, 26, 26, 0.15);
        }
        .impact-page .db-card {
          padding: 0;
        }
        .impact-page .db-label {
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--origin-gold);
        }
        .impact-page .db-card.barrier .db-label {
          color: rgba(26, 26, 26, 0.45);
        }
        .impact-page .db-headline {
          font-family: var(--display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(22px, 2.2vw, 30px);
          line-height: 1.25;
          margin-bottom: 16px;
        }
        .impact-page .db-body {
          font-family: var(--display);
          font-weight: 300;
          font-size: 17px;
          line-height: 1.55;
          max-width: 480px;
        }
        @media (max-width: 768px) {
          .impact-page .driver-barrier {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }

        .impact-page .subtheme {
          display: grid;
          grid-template-columns: 0.8fr 1.4fr;
          gap: 100px;
          margin-bottom: 100px;
          align-items: start;
        }
        .impact-page .subtheme-num {
          font-family: var(--display);
          font-weight: 300;
          font-size: 14px;
          letter-spacing: 0.05em;
          color: var(--origin-gold);
          margin-bottom: 16px;
        }
        .impact-page .subtheme-title {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(28px, 3vw, 44px);
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .impact-page .subtheme-body {
          font-family: var(--display);
          font-weight: 300;
          font-size: clamp(17px, 1.3vw, 20px);
          line-height: 1.55;
          margin-bottom: 40px;
          max-width: 620px;
        }
        .impact-page .subtheme-bullets {
          list-style: none;
          margin: 24px 0 40px;
          padding: 0;
        }
        .impact-page .subtheme-bullets li {
          font-family: var(--display);
          font-weight: 300;
          font-size: 18px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(26, 26, 26, 0.12);
          line-height: 1.4;
        }
        .impact-page .subtheme-bullets li:last-child {
          border-bottom: none;
        }
        .impact-page .subtheme-bullets li strong {
          font-weight: 500;
          font-style: italic;
        }

        .impact-page .insights {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 32px;
        }
        .impact-page .insight {
          padding: 24px;
          background: rgba(26, 26, 26, 0.04);
          border-radius: 4px;
        }
        .impact-page .insight-label {
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--origin-gold);
        }
        .impact-page .insight-value {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(28px, 3vw, 40px);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .impact-page .insight-desc {
          font-size: 12px;
          line-height: 1.4;
          opacity: 0.75;
        }
        @media (max-width: 1024px) {
          .impact-page .subtheme {
            grid-template-columns: 1fr;
            gap: 24px;
            margin-bottom: 64px;
          }
          .impact-page .insights {
            grid-template-columns: 1fr;
          }
        }

        .impact-page .pull-quote {
          margin-top: 100px;
          padding-top: 80px;
          border-top: 1px solid rgba(26, 26, 26, 0.2);
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(28px, 3.6vw, 48px);
          line-height: 1.2;
          letter-spacing: -0.02em;
          max-width: 1100px;
        }
        .impact-page .pull-quote-attribution {
          font-style: normal;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 600;
          margin-top: 32px;
          color: var(--origin-gold);
        }

        .impact-page .yellow-divider {
          background: var(--origin-yellow);
          padding: 80px 0;
          text-align: center;
        }
        .impact-page .yellow-divider-text {
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(24px, 3vw, 40px);
          line-height: 1.3;
          letter-spacing: -0.02em;
          max-width: 900px;
          margin: 0 auto;
        }

        .impact-page .spotlight {
          background: var(--origin-yellow);
          padding: 160px 0;
          position: relative;
          overflow: hidden;
        }
        .impact-page .spotlight-meta {
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 32px;
          display: inline-block;
          padding: 8px 14px;
          background: var(--origin-ink);
          color: var(--origin-yellow);
        }
        .impact-page .spotlight-headline {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(48px, 7vw, 112px);
          line-height: 0.95;
          letter-spacing: -0.04em;
          margin-bottom: 32px;
          max-width: 1200px;
        }
        .impact-page .spotlight-headline em {
          font-style: italic;
          font-weight: 300;
        }
        .impact-page .spotlight-sub {
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(22px, 2.2vw, 32px);
          line-height: 1.35;
          margin-bottom: 80px;
          max-width: 720px;
          opacity: 0.85;
        }
        .impact-page .spotlight-body {
          font-family: var(--display);
          font-weight: 300;
          font-size: clamp(18px, 1.4vw, 22px);
          line-height: 1.55;
          margin-bottom: 56px;
          max-width: 720px;
        }
        .impact-page .spotlight-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .impact-page .spotlight-list-title {
          font-family: var(--display);
          font-style: italic;
          font-weight: 400;
          font-size: 22px;
          margin-bottom: 24px;
        }
        .impact-page .spotlight-list {
          list-style: none;
          margin-bottom: 48px;
          border-top: 1px solid var(--origin-ink);
          counter-reset: spotlight-counter;
        }
        .impact-page .spotlight-list li {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(18px, 1.5vw, 22px);
          padding: 20px 0;
          border-bottom: 1px solid var(--origin-ink);
          line-height: 1.35;
          display: flex;
          align-items: baseline;
          gap: 20px;
        }
        .impact-page .spotlight-list li::before {
          content: counter(spotlight-counter, decimal-leading-zero);
          counter-increment: spotlight-counter;
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: 14px;
          opacity: 0.5;
          min-width: 28px;
        }
        .impact-page .spotlight-closing {
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(22px, 2.4vw, 32px);
          line-height: 1.3;
          margin-top: 64px;
          padding-top: 48px;
          border-top: 1px solid var(--origin-ink);
          max-width: 800px;
        }
        @media (max-width: 1024px) {
          .impact-page .spotlight {
            padding: 80px 0;
          }
          .impact-page .spotlight-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }

        .impact-page .spotlight-image {
          aspect-ratio: 4 / 5;
          border-radius: 4px;
        }

        .impact-page .yield-scene {
          background: var(--origin-ink);
          color: var(--origin-cream);
          padding: 200px 0;
          position: relative;
          overflow: hidden;
        }
        .impact-page .yield-eyebrow {
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: 18px;
          color: var(--origin-yellow);
          margin-bottom: 48px;
          text-align: center;
        }
        .impact-page .yield-headline {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(80px, 16vw, 280px);
          line-height: 0.9;
          letter-spacing: -0.05em;
          text-align: center;
          margin-bottom: 32px;
        }
        .impact-page .yield-headline em {
          font-style: italic;
          font-weight: 300;
          color: var(--origin-yellow);
        }
        .impact-page .yield-sub {
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(22px, 2.4vw, 36px);
          text-align: center;
          margin-bottom: 80px;
          opacity: 0.85;
        }
        .impact-page .yield-body {
          font-family: var(--display);
          font-weight: 300;
          font-size: clamp(18px, 1.5vw, 22px);
          line-height: 1.65;
          max-width: 680px;
          margin: 0 auto 64px;
          text-align: center;
          opacity: 0.85;
        }
        .impact-page .yield-closing {
          font-family: var(--display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(24px, 2.8vw, 36px);
          text-align: center;
          color: var(--origin-yellow);
          max-width: 800px;
          margin: 0 auto;
          padding-top: 48px;
          border-top: 1px solid rgba(255, 208, 0, 0.3);
        }
        .impact-page .yield-image-block {
          margin: 80px auto;
          max-width: 1100px;
          aspect-ratio: 21 / 9;
        }
        .impact-page .yield-image-block .placeholder {
          height: 100%;
        }

        .impact-page .supply-chain {
          background: var(--origin-cream);
          padding: 160px 0;
        }
        .impact-page .supply-chain-header {
          max-width: 1100px;
          margin-bottom: 100px;
        }
        .impact-page .supply-chain-headline {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(44px, 5.5vw, 84px);
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin-bottom: 32px;
        }
        .impact-page .supply-chain-headline em {
          font-style: italic;
          font-weight: 300;
          color: var(--origin-gold);
        }
        .impact-page .chain-row {
          margin-bottom: 80px;
        }
        .impact-page .chain-row-label {
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 28px;
        }
        .impact-page .chain-track {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .impact-page .chain-node {
          padding: 20px 22px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          text-align: center;
          min-width: 110px;
        }
        .impact-page .chain-arrow {
          font-size: 20px;
          font-weight: 300;
        }
        .impact-page .chain-traditional .chain-node {
          background: transparent;
          border: 1px solid rgba(26, 26, 26, 0.25);
          color: rgba(26, 26, 26, 0.45);
        }
        .impact-page .chain-traditional .chain-arrow {
          color: rgba(26, 26, 26, 0.25);
        }
        .impact-page .chain-traditional .chain-row-label {
          color: rgba(26, 26, 26, 0.45);
        }
        .impact-page .chain-origin .chain-node {
          background: var(--origin-yellow);
          color: var(--origin-ink);
          font-weight: 600;
          padding: 28px 32px;
          font-size: 15px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.6s var(--ease-out);
        }
        .impact-page .chain-origin.visible .chain-node {
          opacity: 1;
          transform: translateY(0);
        }
        .impact-page .chain-origin.visible .chain-node:nth-child(1) {
          transition-delay: 0.2s;
        }
        .impact-page .chain-origin.visible .chain-node:nth-child(3) {
          transition-delay: 0.5s;
        }
        .impact-page .chain-origin.visible .chain-node:nth-child(5) {
          transition-delay: 0.8s;
        }
        .impact-page .chain-origin .chain-arrow {
          color: var(--origin-gold);
          font-size: 24px;
          font-weight: 500;
          opacity: 0;
          transition: opacity 0.4s var(--ease-out);
        }
        .impact-page .chain-origin.visible .chain-arrow {
          opacity: 1;
        }
        .impact-page .chain-origin.visible .chain-arrow:nth-child(2) {
          transition-delay: 0.4s;
        }
        .impact-page .chain-origin.visible .chain-arrow:nth-child(4) {
          transition-delay: 0.7s;
        }
        .impact-page .chain-caption {
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(20px, 2vw, 28px);
          line-height: 1.4;
          max-width: 800px;
          padding-top: 48px;
          border-top: 1px solid var(--origin-ink);
          margin-bottom: 48px;
        }
        .impact-page .chain-closing {
          font-family: var(--display);
          font-weight: 300;
          font-size: clamp(18px, 1.4vw, 22px);
          line-height: 1.55;
          max-width: 800px;
        }
        @media (max-width: 768px) {
          .impact-page .supply-chain {
            padding: 80px 0;
          }
          .impact-page .chain-track {
            flex-direction: column;
            align-items: stretch;
          }
          .impact-page .chain-arrow {
            transform: rotate(90deg);
            margin: 4px 0;
          }
          .impact-page .chain-node {
            min-width: auto;
          }
        }

        .impact-page .cities-section {
          background: var(--origin-yellow);
          padding: 160px 0;
        }
        .impact-page .cities-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .impact-page .cities-col-label {
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 40px;
          opacity: 0.65;
        }
        .impact-page .city-name {
          font-family: var(--display);
          font-size: clamp(56px, 7vw, 112px);
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 16px;
          display: block;
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.8s var(--ease-out);
        }
        .impact-page .city-name.visible {
          opacity: 1;
          transform: translateX(0);
        }
        .impact-page .city-live .city-name {
          font-weight: 500;
        }
        .impact-page .city-expanding .city-name {
          font-weight: 300;
          font-style: italic;
          opacity: 0;
        }
        .impact-page .city-expanding .city-name.visible {
          opacity: 0.7;
        }
        .impact-page .cities-footnote {
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: 18px;
          margin-top: 40px;
          opacity: 0.7;
        }
        @media (max-width: 1024px) {
          .impact-page .cities-grid {
            grid-template-columns: 1fr;
            gap: 60px;
          }
          .impact-page .cities-section {
            padding: 80px 0;
          }
        }

        .impact-page .finale {
          height: 100vh;
          position: relative;
        }
        .impact-page .finale-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          background: var(--origin-ink);
        }
        .impact-page .finale-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(
              ellipse at center,
              rgba(0, 0, 0, 0.55) 0%,
              rgba(0, 0, 0, 0.75) 55%,
              rgba(0, 0, 0, 0.88) 100%
            ),
            linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.35) 100%);
          z-index: 2;
        }
        .impact-page .finale-text {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          z-index: 3;
          color: var(--origin-cream);
          padding: 0 24px;
        }
        .impact-page .finale-eyebrow {
          font-family: var(--display);
          font-style: italic;
          font-weight: 300;
          font-size: 18px;
          color: var(--origin-yellow);
          margin-bottom: 40px;
          letter-spacing: 0.05em;
        }
        .impact-page .finale-headline {
          font-family: var(--display);
          font-weight: 400;
          font-size: clamp(56px, 9vw, 144px);
          line-height: 0.95;
          letter-spacing: -0.03em;
          max-width: 1100px;
          margin-bottom: 48px;
        }
        .impact-page .finale-headline em {
          font-style: italic;
          font-weight: 300;
        }
        .impact-page .finale-sub {
          font-family: var(--display);
          font-weight: 300;
          font-size: clamp(18px, 1.6vw, 22px);
          line-height: 1.5;
          max-width: 560px;
          margin: 0 auto 56px;
          opacity: 0.9;
        }
        .impact-page .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          background: var(--origin-yellow);
          color: var(--origin-ink);
          padding: 22px 44px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.3s var(--ease-out);
        }
        .impact-page .cta-button:hover {
          background: var(--origin-cream);
          gap: 24px;
        }
        .impact-page .cta-button-arrow {
          font-size: 18px;
          transition: transform 0.3s var(--ease-out);
        }
        .impact-page .cta-button:hover .cta-button-arrow {
          transform: translateX(4px);
        }

        .impact-page .footer {
          background: var(--origin-ink);
          color: var(--origin-cream);
          padding: 60px 0 40px;
        }
        .impact-page .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          opacity: 0.6;
        }
        .impact-page .footer-logo {
          font-family: var(--display);
          font-style: italic;
          font-size: 18px;
          font-weight: 500;
          text-transform: none;
          letter-spacing: -0.01em;
          opacity: 1;
        }
        @media (max-width: 768px) {
          .impact-page .footer-inner {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }

        .impact-page .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition:
            opacity 0.9s var(--ease-out),
            transform 0.9s var(--ease-out);
        }
        .impact-page .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .impact-page .scene-text .fade-up {
          transition-duration: 1.2s;
        }
        @media (prefers-reduced-motion: reduce) {
          .impact-page *,
          .impact-page *::before,
          .impact-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .impact-page .scene,
          .impact-page .finale {
            height: auto;
          }
          .impact-page .scene-sticky,
          .impact-page .finale-sticky {
            position: relative;
            height: 100vh;
          }
        }
      `}</style>

      <div className="impact-page" ref={rootRef}>
        <div className="progress">
          <div className="progress-bar" id="progressBar" />
        </div>

        <nav className="nav">
          <div className="nav-logo">Origin Fresh</div>
          <div className="nav-meta">Impact Report · 2026</div>
        </nav>

        {/* 00. TITLE CARD */}
        <section className="title-card">
          <div className="title-bg" />
          <div>
            <div className="title-eyebrow">An Origin Fresh Story</div>
            <h1 className="title-headline">
              Fresh, <em>by design.</em>
            </h1>
            <div className="title-meta">Impact Report · 2026</div>
          </div>
          <div className="title-scroll">
            <span>Begin</span>
            <div className="title-scroll-line" />
          </div>
        </section>

        {/* 01. OPENING SCENE — THE SEED */}
        <section className="scene">
          <div className="scene-sticky">
            <div className="scene-bg scene-bg-01" />
            <div className="scene-gradient scene-gradient-left" />
            <div className="scene-text">
              <div className="scene-text-inner">
                <div className="scene-eyebrow fade-up">Prologue</div>
                <h2 className="scene-headline fade-up">
                  Everything starts <em>here.</em>
                </h2>
                <p className="scene-sub fade-up">
                  A single seed. A patch of soil. A patient hand. This is where every story we tell begins — long before
                  the supply chain, the data, or the city.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 02. OPENING SCENE — THE COUNTRY */}
        <section className="scene">
          <div className="scene-sticky">
            <div className="scene-bg scene-bg-02" />
            <div className="scene-gradient scene-gradient-right" />
            <div className="scene-text scene-text-right">
              <div className="scene-text-inner">
                <div className="scene-eyebrow fade-up">The opportunity</div>
                <h2 className="scene-headline fade-up">
                  India can grow <em>anything.</em>
                </h2>
                <p className="scene-sub fade-up">
                  Avocados in Karnataka. Dragon fruit in Maharashtra. Asparagus in Tamil Nadu. We work with the farmers
                  proving that exotic produce belongs at home — grown here, eaten here, and grown well.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03. THE FRAMEWORK */}
        <section className="framework">
          <div className="container">
            <div className="section-eyebrow fade-up">The Origin Framework</div>
            <h2 className="framework-headline fade-up">
              Three pillars. <em>One commitment.</em>
            </h2>
            <p className="framework-intro fade-up">
              Impact, for us, isn&apos;t a marketing department. It&apos;s an operating principle. We measure ourselves
              across three pillars — Environmental, Social, and Scientific — because doing one well without the others
              is a half-truth. The pages that follow are how we&apos;re keeping that commitment honest, quarter by
              quarter.
            </p>
            <div className="pillar-cards">
              <div className="pillar-card fade-up">
                <div className="pillar-card-num">01.</div>
                <div className="pillar-card-title">Environmental Impact</div>
                <p className="pillar-card-desc">The earth we farm on, the energy we use, the way we move.</p>
              </div>
              <div className="pillar-card fade-up">
                <div className="pillar-card-num">02.</div>
                <div className="pillar-card-title">Social Impact</div>
                <p className="pillar-card-desc">The farmers we partner with, the prosperity we build together.</p>
              </div>
              <div className="pillar-card fade-up">
                <div className="pillar-card-num">03.</div>
                <div className="pillar-card-title">Scientific Impact</div>
                <p className="pillar-card-desc">The science that&apos;s reshaping how exotic produce grows in India.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 04. HEADLINE STATS */}
        <section className="stats-burst">
          <div className="container">
            <div className="section-eyebrow fade-up">The numbers</div>
            <h2 className="stats-burst-headline fade-up">
              At a <em>glance.</em>
            </h2>
            <p className="stats-burst-sub fade-up">A snapshot of where we are today — updated quarterly.</p>
            <div className="stats-grid">
              <div className="stat-item fade-up">
                <div className="stat-value">
                  <span className="count" data-target="20000">
                    0
                  </span>
                  <span className="suffix">+</span>
                </div>
                <div className="stat-label">Farmers in our network</div>
              </div>
              <div className="stat-item fade-up">
                <div className="stat-value">
                  <span className="count" data-target="50">
                    0
                  </span>
                  <span className="suffix">%+</span>
                </div>
                <div className="stat-label">Women-led farms</div>
              </div>
              <div className="stat-item fade-up">
                <div className="stat-value">
                  ₹
                  <span className="count" data-target="10">
                    0
                  </span>
                  <span className="suffix">Cr+</span>
                </div>
                <div className="stat-label">Interest-free loans disbursed</div>
              </div>
              <div className="stat-item fade-up">
                <div className="stat-value">
                  <span className="count" data-target="90">
                    0
                  </span>
                  <span className="suffix">%+</span>
                </div>
                <div className="stat-label">EV logistics fleet</div>
              </div>
              <div className="stat-item fade-up">
                <div className="stat-value">
                  &lt;
                  <span className="count" data-target="5">
                    0
                  </span>
                  <span className="suffix">%</span>
                </div>
                <div className="stat-label">Wastage across supply chain</div>
              </div>
            </div>
          </div>
        </section>

        {/* 05. PILLAR 01 — ENVIRONMENTAL IMPACT */}
        <section className="pillar">
          <div className="container">
            <div className="pillar-header">
              <div className="pillar-num fade-up">01.</div>
              <div className="pillar-title-block">
                <div className="section-eyebrow fade-up">Pillar 01 · Environmental Impact</div>
                <h2 className="pillar-title fade-up">
                  A cleaner way <em>to move produce.</em>
                </h2>
                <p className="pillar-intro fade-up">
                  Sustainability isn&apos;t a chapter at the end of the report — it runs through every operational
                  decision we make. From the electricity we use, to the soil we leave behind, to the trucks that bring
                  produce to your door. Here&apos;s where we are, and where we&apos;re going next.
                </p>
              </div>
            </div>

            <div className="driver-barrier">
              <div className="db-card fade-up">
                <div className="db-label">Top driver</div>
                <h3 className="db-headline">Energy that moves itself.</h3>
                <p className="db-body">
                  More than 90% of our last-mile logistics already run on electric vehicles, with a clear path to 100%
                  by 2030.
                </p>
              </div>
              <div className="db-card barrier fade-up">
                <div className="db-label">Top barrier</div>
                <h3 className="db-headline">Soil takes time.</h3>
                <p className="db-body">
                  Healthy land isn&apos;t built in a quarter — it&apos;s built in seasons. Our farmer network is
                  transitioning toward regenerative practices, and the gains are gradual but real.
                </p>
              </div>
            </div>

            <div className="subtheme fade-up">
              <div>
                <div className="subtheme-num">1.1</div>
                <h3 className="subtheme-title">Energy efficiency</h3>
              </div>
              <div>
                <p className="subtheme-body">
                  Across our collection centres, packhouses, and offices, we monitor electricity consumption in real
                  time. Energy-efficient cold chain, smarter HVAC, and solar pilots at two of our centres are bringing
                  down kWh per kilo of produce moved.
                </p>
                <div className="insights">
                  <div className="insight">
                    <div className="insight-label">Energy per kg</div>
                    <div className="insight-value">TBC</div>
                    <div className="insight-desc">kWh consumed per kg of produce moved</div>
                  </div>
                  <div className="insight">
                    <div className="insight-label">Solar offset</div>
                    <div className="insight-value">TBC%</div>
                    <div className="insight-desc">of operations powered on-site</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="subtheme fade-up">
              <div>
                <div className="subtheme-num">1.2</div>
                <h3 className="subtheme-title">Soil health &amp; land sustainability</h3>
              </div>
              <div>
                <p className="subtheme-body">
                  Our produce is residue-free, chemical-free, and organically grown. But residue-free is just the floor
                  — we&apos;re working with our farmer network on regenerative practices that build long-term soil
                  health: cover cropping, mixed farming, composting, and reduced tillage.
                </p>
                <div className="insights">
                  <div className="insight">
                    <div className="insight-label">Chemicals used</div>
                    <div className="insight-value">0</div>
                    <div className="insight-desc">in any Origin Fresh produce</div>
                  </div>
                  <div className="insight">
                    <div className="insight-label">Regenerative farms</div>
                    <div className="insight-value">TBC+</div>
                    <div className="insight-desc">and growing every quarter</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="subtheme fade-up">
              <div>
                <div className="subtheme-num">1.3</div>
                <h3 className="subtheme-title">Carbon footprint &amp; EV adoption</h3>
              </div>
              <div>
                <p className="subtheme-body">
                  Logistics is one of the largest emissions lines in produce. We&apos;ve cut ours by moving the bulk of
                  our delivery fleet to electric — and committing publicly to 100% EV by 2030.
                </p>
                <div className="insights">
                  <div className="insight">
                    <div className="insight-label">EV fleet today</div>
                    <div className="insight-value">90%+</div>
                    <div className="insight-desc">of last-mile logistics</div>
                  </div>
                  <div className="insight">
                    <div className="insight-label">Target by 2030</div>
                    <div className="insight-value">100%</div>
                    <div className="insight-desc">EV across operations</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="pillar-image-banner"
              style={{
                aspectRatio: '21/9',
                marginTop: '60px',
                backgroundImage: `url('${IMG_BASE}/basil-harvest.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '4px'
              }}
            />

            <blockquote className="pull-quote fade-up">
              &quot;We don&apos;t talk about sustainability as a brand value. We talk about it as a number on a meter, a
              litre in a tank, and a hand on the soil.&quot;
              <div className="pull-quote-attribution">— Origin Fresh</div>
            </blockquote>
          </div>
        </section>

        {/* 06. PILLAR 02 — SOCIAL IMPACT */}
        <section className="pillar">
          <div className="container">
            <div className="pillar-header">
              <div className="pillar-num fade-up">02.</div>
              <div className="pillar-title-block">
                <div className="section-eyebrow fade-up">Pillar 02 · Social Impact</div>
                <h2 className="pillar-title fade-up">
                  Farmers first. <em>Always.</em>
                </h2>
                <p className="pillar-intro fade-up">
                  A supply chain is a contract between people. Ours runs on direct relationships with more than 20,000
                  farmers across India — no middlemen, no unnecessary layers. We measure our social impact in farmer
                  prosperity, in inclusion, and in growth that compounds year on year.
                </p>
              </div>
            </div>

            <div className="driver-barrier">
              <div className="db-card fade-up">
                <div className="db-label">Top driver</div>
                <h3 className="db-headline">Direct relationships compound.</h3>
                <p className="db-body">
                  Removing four stages of the traditional supply chain puts more rupees in the farmer&apos;s pocket —
                  and gives us cleaner, fresher produce.
                </p>
              </div>
              <div className="db-card barrier fade-up">
                <div className="db-label">Top barrier</div>
                <h3 className="db-headline">Capital is the bottleneck.</h3>
                <p className="db-body">
                  Smallholder farmers are often locked out of formal credit. We&apos;re working on closing that gap, one
                  loan and one bank account at a time.
                </p>
              </div>
            </div>

            <div className="subtheme fade-up">
              <div>
                <div className="subtheme-num">2.1</div>
                <h3 className="subtheme-title">Building prosperity</h3>
              </div>
              <div>
                <p className="subtheme-body">Our prosperity model has four legs that hold each other up:</p>
                <ul className="subtheme-bullets">
                  <li>
                    <strong>Contract farming</strong> that gives farmers price certainty before they plant
                  </li>
                  <li>
                    <strong>Cash advances and interest-free loans</strong> so input cost never blocks a season
                  </li>
                  <li>
                    <strong>Banking partner onboarding</strong> that brings farmers into the formal financial system for
                    the first time
                  </li>
                  <li>
                    <strong>Direct payments</strong> that bypass aggregators and reach the farmer in days, not months
                  </li>
                </ul>
                <div className="insights">
                  <div className="insight">
                    <div className="insight-label">Loans disbursed</div>
                    <div className="insight-value">₹10Cr+</div>
                    <div className="insight-desc">interest-free, to date</div>
                  </div>
                  <div className="insight">
                    <div className="insight-label">Banking onboards</div>
                    <div className="insight-value">TBC</div>
                    <div className="insight-desc">farmers brought into formal banking</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="subtheme fade-up">
              <div>
                <div className="subtheme-num">2.2</div>
                <h3 className="subtheme-title">Women at the centre</h3>
              </div>
              <div>
                <p className="subtheme-body">
                  More than half of our farmer network is led by women. This isn&apos;t a target — it&apos;s a result of
                  how we built the network: a digital farmer platform designed for first-time tech users, a dedicated
                  helpline, and a deliberate focus on women-led farms when we expand into a new region.
                </p>
                <div className="insights">
                  <div className="insight">
                    <div className="insight-label">Women-led farms</div>
                    <div className="insight-value">50%+</div>
                    <div className="insight-desc">of our network</div>
                  </div>
                  <div className="insight">
                    <div className="insight-label">App active users</div>
                    <div className="insight-value">TBC</div>
                    <div className="insight-desc">on the Origin Farmer App</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="subtheme fade-up">
              <div>
                <div className="subtheme-num">2.3</div>
                <h3 className="subtheme-title">Year-on-year growth</h3>
              </div>
              <div>
                <p className="subtheme-body">
                  We don&apos;t just measure how many farmers are in the network. We measure how many stay, and how
                  their incomes grow.
                </p>
                <div className="insights">
                  <div className="insight">
                    <div className="insight-label">YoY growth</div>
                    <div className="insight-value">TBC%</div>
                    <div className="insight-desc">in farmer network size</div>
                  </div>
                  <div className="insight">
                    <div className="insight-label">Income uplift</div>
                    <div className="insight-value">TBC%</div>
                    <div className="insight-desc">average per partner farmer</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="pillar-image-banner"
              style={{
                aspectRatio: '21/9',
                marginTop: '60px',
                backgroundImage: `url('${IMG_BASE}/farmer-seated.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '4px'
              }}
            />
          </div>
        </section>

        {/* 07. SPOTLIGHT — THE ORIGIN FRESH ACADEMY */}
        <section className="spotlight">
          <div className="container">
            <span className="spotlight-meta fade-up">Introducing</span>
            <h2 className="spotlight-headline fade-up">
              The Origin Fresh <em>Academy.</em>
            </h2>
            <p className="spotlight-sub fade-up">A new way to grow what we know.</p>
            <div className="spotlight-grid">
              <div>
                <p className="spotlight-body fade-up">
                  The Origin Fresh Academy is our farmer training initiative — a scalable knowledge-sharing ecosystem
                  built to put advanced agricultural practice in the hands of every farmer we work with.
                </p>

                <h4 className="spotlight-list-title fade-up">What it teaches</h4>
                <ul className="spotlight-list fade-up">
                  <li>New agricultural technologies</li>
                  <li>Ethical farming practices</li>
                  <li>Sustainable cultivation methods</li>
                  <li>Smart farming systems</li>
                </ul>

                <h4 className="spotlight-list-title fade-up">How it works</h4>
                <ul className="spotlight-list fade-up">
                  <li>Regular seminars and on-ground workshops, hosted in farmer regions</li>
                  <li>Expert-led sessions in partnership with Sahyadri Farms and other industry leaders</li>
                  <li>A peer-to-peer knowledge ecosystem so what one farmer learns, the network learns</li>
                </ul>

                <p className="spotlight-closing fade-up">
                  Because we believe the future of Indian farming will be written by Indian farmers.
                </p>
              </div>
              <div>
                {/* <div className="placeholder placeholder-on-yellow spotlight-image">
                  <div className="placeholder-label">Image · Training session / workshop</div>
                  <div className="placeholder-spec">recommended: 1200×1500px (4:5)</div>
                </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* 08. THE YIELD STORY */}
        <section className="yield-scene">
          <div className="container">
            <div className="yield-eyebrow fade-up">A story about lifting, not replacing</div>
            <h2 className="yield-headline fade-up">
              From 40% <em>to 90%.</em>
            </h2>
            <p className="yield-sub fade-up">That&apos;s not a stat. That&apos;s a season changed.</p>

            <div className="yield-image-block fade-up">
              {/* <div className="placeholder placeholder-dark">
                <div className="placeholder-label">Image or short video · Wide farm shot, golden hour</div>
                <div className="placeholder-spec">recommended: 2100×900px (21:9) · or 5-10s loop</div>
              </div> */}
            </div>

            <p className="yield-body fade-up">
              When we introduced smart farming systems to one of our partner regions, yields on certain crops rose from
              roughly 40% to nearly 90%. Same farmers. Same land. Better tools.
            </p>
            <p className="yield-body fade-up">
              Technology, for us, has never been about reducing the role of the people who grow our food. It&apos;s
              about giving them what they need to grow more of it, better.
            </p>
            <p className="yield-closing fade-up">The same hands. A bigger harvest.</p>
          </div>
        </section>

        {/* 09. PILLAR 03 — SCIENTIFIC IMPACT */}
        <section className="pillar">
          <div className="container">
            <div className="pillar-header">
              <div className="pillar-num fade-up">03.</div>
              <div className="pillar-title-block">
                <div className="section-eyebrow fade-up">Pillar 03 · Scientific Impact</div>
                <h2 className="pillar-title fade-up">
                  The future <em>grows in water.</em>
                </h2>
                <p className="pillar-intro fade-up">
                  Exotic produce is one of the most demanding categories in agriculture. It needs precision: of climate,
                  of timing, of harvest. Science is how we deliver that precision at scale — through hydroponics,
                  pollination ecosystems, disease prevention, and a smarter approach to ripeness.
                </p>
              </div>
            </div>

            <div className="driver-barrier">
              <div className="db-card fade-up">
                <div className="db-label">Top driver</div>
                <h3 className="db-headline">Hydroponics is the future, and it&apos;s already here.</h3>
                <p className="db-body">
                  Cleaner, more efficient, more controllable — and increasingly within reach of Indian growers.
                </p>
              </div>
              <div className="db-card barrier fade-up">
                <div className="db-label">Top barrier</div>
                <h3 className="db-headline">Knowledge gap.</h3>
                <p className="db-body">The science exists. Spreading it across thousands of farms is the work.</p>
              </div>
            </div>

            <div className="subtheme fade-up">
              <div>
                <div className="subtheme-num">3.1</div>
                <h3 className="subtheme-title">Pollination &amp; ecosystem balance</h3>
              </div>
              <div>
                <p className="subtheme-body">
                  We work with our farmers to maintain healthy on-farm ecosystems — including dedicated pollinator
                  support, biodiversity strips, and seasonal cover crops. A farm that&apos;s a better neighbour to its
                  bees produces better fruit.
                </p>
                <div className="insights">
                  <div className="insight">
                    <div className="insight-label">Pollinator pilots</div>
                    <div className="insight-value">TBC</div>
                    <div className="insight-desc">active across the network</div>
                  </div>
                  <div className="insight">
                    <div className="insight-label">Biodiversity strips</div>
                    <div className="insight-value">TBC</div>
                    <div className="insight-desc">partner farms participating</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="subtheme fade-up">
              <div>
                <div className="subtheme-num">3.2</div>
                <h3 className="subtheme-title">Hydroponic farming</h3>
              </div>
              <div>
                <p className="subtheme-body">
                  Hydroponics isn&apos;t a side experiment for us — it&apos;s a strategic bet. We&apos;re partnering
                  with hydroponic farmers across India, supporting setup, training, and offtake, so growers can
                  transition with confidence.
                </p>
                <div className="insights">
                  <div className="insight">
                    <div className="insight-label">Hydroponic farms</div>
                    <div className="insight-value">TBC+</div>
                    <div className="insight-desc">in our partner network</div>
                  </div>
                  <div className="insight">
                    <div className="insight-label">Exotic varieties</div>
                    <div className="insight-value">150+</div>
                    <div className="insight-desc">grown across the network</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="subtheme fade-up">
              <div>
                <div className="subtheme-num">3.3</div>
                <h3 className="subtheme-title">Disease prevention &amp; crop protection</h3>
              </div>
              <div>
                <p className="subtheme-body">
                  Residue-free farming isn&apos;t just about what we don&apos;t use. It&apos;s about what we use
                  instead. We&apos;re investing in integrated pest management, biological controls, and crop protection
                  systems that keep produce safe at every stage.
                </p>
                <div className="insights">
                  <div className="insight">
                    <div className="insight-label">Residue-free</div>
                    <div className="insight-value">100%</div>
                    <div className="insight-desc">of all Origin Fresh produce</div>
                  </div>
                  <div className="insight">
                    <div className="insight-label">R&amp;D partners</div>
                    <div className="insight-value">TBC</div>
                    <div className="insight-desc">including APEDA</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="pillar-image-banner"
              style={{
                aspectRatio: '21/9',
                marginTop: '60px',
                backgroundImage: `url('${IMG_BASE}/lauki-hanging.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '4px'
              }}
            />
          </div>
        </section>

        {/* 10. SPOTLIGHT — THE RIPENESS QUOTIENT */}
        <section className="spotlight">
          <div className="container">
            <span className="spotlight-meta fade-up">Introducing</span>
            <h2 className="spotlight-headline fade-up">
              The Ripeness <em>Quotient.</em>
            </h2>
            <p className="spotlight-sub fade-up">A smarter way to pick, order, and eat.</p>
            <div className="spotlight-grid">
              <div>
                <p className="spotlight-body fade-up">
                  The Ripeness Quotient is how we&apos;re rethinking ripeness across the entire supply chain — from the
                  farm to the front door.
                </p>

                <h4 className="spotlight-list-title fade-up">It&apos;s three things working together</h4>
                <ul className="spotlight-list fade-up">
                  <li>
                    <strong>Picking at the right stage</strong> — produce harvested at the precise point of ripeness,
                    not too early, not too late
                  </li>
                  <li>
                    <strong>Ordering based on actual consumption</strong> — using demand data to send the right volume
                    to the right city, on the right day
                  </li>
                  <li>
                    <strong>Reducing wastage across the chain</strong> — because the highest cost of food waste is paid
                    at the source, by the farmer
                  </li>
                </ul>

                <p className="spotlight-closing fade-up">Better fruit. Less waste. Fairer farmers. One quotient.</p>
              </div>
              <div>
                {/* <div className="placeholder placeholder-on-yellow spotlight-image">
                  <div className="placeholder-label">Image · Hand selecting ripe produce</div>
                  <div className="placeholder-spec">recommended: 1200×1500px (4:5)</div>
                </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* 11. SUPPLY CHAIN */}
        <section className="supply-chain">
          <div className="container">
            <div className="supply-chain-header">
              <div className="section-eyebrow fade-up">The Origin Difference</div>
              <h2 className="supply-chain-headline fade-up">
                We removed four stages. <em>Here&apos;s what&apos;s left.</em>
              </h2>
            </div>

            <div className="chain-row chain-traditional fade-up">
              <div className="chain-row-label">Traditional supply chain</div>
              <div className="chain-track">
                <div className="chain-node">Farmer</div>
                <div className="chain-arrow">→</div>
                <div className="chain-node">Aggregator</div>
                <div className="chain-arrow">→</div>
                <div className="chain-node">Wholesaler</div>
                <div className="chain-arrow">→</div>
                <div className="chain-node">Distributor</div>
                <div className="chain-arrow">→</div>
                <div className="chain-node">Retailer</div>
                <div className="chain-arrow">→</div>
                <div className="chain-node">Consumer</div>
              </div>
            </div>

            <div className="chain-row chain-origin" id="chainOrigin">
              <div className="chain-row-label">The Origin Fresh way</div>
              <div className="chain-track">
                <div className="chain-node">Farmer</div>
                <div className="chain-arrow">→</div>
                <div className="chain-node">Collection Centre</div>
                <div className="chain-arrow">→</div>
                <div className="chain-node">Consumer</div>
              </div>
            </div>

            <p className="chain-caption fade-up">
              Wastage consistently under 5%. Fairer prices for farmers. Fresher produce for consumers.
            </p>
            <p className="chain-closing fade-up">
              Every stage we removed from the traditional supply chain put more rupees in the farmer&apos;s pocket — and
              brought fresher produce to your kitchen. The supply chain isn&apos;t the back-end of our business. It is
              the business.
            </p>
          </div>
        </section>

        {/* 12. CITIES */}
        <section className="cities-section">
          <div className="container">
            <div className="section-eyebrow">Where we work</div>
            <div className="cities-grid">
              <div className="city-live">
                <div className="cities-col-label">Live in</div>
                <span className="city-name">Bangalore</span>
                <span className="city-name">Chennai</span>
              </div>
              <div className="city-live">
                <div className="cities-col-label">&nbsp;</div>
                <span className="city-name">Mysore</span>
                <span className="city-name">Pune</span>
              </div>
            </div>
          </div>
        </section>

        {/* 13. FINALE */}
        <section className="finale">
          <div className="finale-sticky">
            <div className="scene-bg scene-bg-finale" />
            <div className="finale-gradient" />
            <div className="finale-text">
              <div>
                <div className="finale-eyebrow fade-up">2026 and beyond</div>
                <h2 className="finale-headline fade-up">
                  Let&apos;s grow something <em>better. Together.</em>
                </h2>
                <p className="finale-sub fade-up">
                  For investor enquiries and partnerships, get in touch with our team.
                </p>
                <a href="mailto:support@originfresh.in" className="cta-button fade-up">
                  Contact us
                  <span className="cta-button-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="container footer-inner">
            <div className="footer-logo">Origin Fresh</div>
            <div>© 2026 Origin Fresh · All rights reserved</div>
          </div>
        </footer>
      </div>
    </>
  );
}
