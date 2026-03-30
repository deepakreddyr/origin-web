'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// const IMAGES = [
//     '/assets/images/about/farm.webp',
//     // '/assets/images/about/handpicked.webp',
//     // '/assets/images/parallaxImages/top-2.webp',
//     // '/assets/images/parallaxImages/main-2.webp',
// ];

const IMAGES = ['/assets/images/about/home3.webp'];

const JoinCultSection = () => {
  const [currentImg, setCurrentImg] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // 1. Framer Motion Scroll Logic
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end center'] // Starts when top of section enters bottom of viewport
  });

  // Create a smooth spring for the progress to avoid jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Map scroll 0-1 to width/height percentage (0% to 22%)
  const borderSize = useTransform(smoothProgress, [0, 1], ['0%', '22%']);

  // 2. Image Carousel logic (kept original timing)
  useEffect(() => {
    if (IMAGES.length <= 1) return;
    const id = setInterval(() => {
      setCurrentImg((i) => (i + 1) % IMAGES.length);
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-20 mob:py-16">
      <div className="w-[92vw] md:w-[80vw] mx-auto flex flex-col-reverse md:grid md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1.4fr] gap-10 md:gap-8 lg:gap-14 items-stretch">
        {/* ── Left: text (Now bottom on mobile) ── */}
        <div className="flex flex-col justify-center gap-12 mob:gap-5 min-w-0 overflow-hidden mob:pt-[10px]">
          <h2 className="font-[Recoleta] font-bold leading-2 mob:leading-5 min-w-0">
            <span className="text-[#619269] block mob:text-[11vw] text-3xl md:text-5xl lg:text-[3.8vw] mb-2">Join</span>

            <span className="text-black mob:text-[10vw] block text-3xl md:text-5xl lg:text-[3.8vw]">
              The Cult Of Fresh
            </span>
          </h2>

          <div className="flex flex-col gap-3 w-full">
            <p className="text-black mob:text-[4vw] md:text-[1.6vw] font-semibold leading-[1.25] font-[SofiaPro] md:mb-6">
              Nature takes time. It refuses to be hurried. <br className="mob:hidden" /> It carefully crafts every
              single fruit and vegetable that you find here. This patience is what we worship, and that's what we share
              with the world.
            </p>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/originfresh.in?igsh=ZXYxNnFvYXR4cWd5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 border border-[#231F20] rounded-full px-6 py-3 w-full hover:bg-[#231F20] transition-colors duration-200 group"
            >
              <svg
                className="w-6 h-6 text-[#E18D1F] group-hover:text-white transition-colors shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              <span className="font-[SofiaPro] font-bold text-[#000000] mob:text-[4vw] text-[1.6vw] group-hover:text-white transition-colors">
                Join our Instagram community
              </span>
            </a>

            {/* Youtube + LinkedIn */}
            <div className="flex gap-3">
              <a
                href="https://www.youtube.com/@origin_fresh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 border border-[#231F20] rounded-full px-4 py-3 hover:bg-[#231F20] transition-colors duration-200 group"
              >
                <span className="w-7 h-7 bg-[#E18D1F] group-hover:bg-white rounded-full flex items-center justify-center transition-colors shrink-0">
                  <svg
                    className="w-4 h-4 text-white group-hover:text-[#E18D1F] transition-colors"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M10 15l5.19-3L10 9v6zm11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
                  </svg>
                </span>
                <span className="font-[SofiaPro] font-bold text-[#231F20] mob:text-[4vw] text-[1.6vw] group-hover:text-white transition-colors">
                  Youtube
                </span>
              </a>

              <a
                href="https://www.linkedin.com/company/origin-fresh-tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 border border-[#231F20] rounded-full px-4 py-3 hover:bg-[#231F20] transition-colors duration-200 group"
              >
                <span className="w-7 h-7 bg-[#E18D1F] group-hover:bg-white rounded-full flex items-center justify-center transition-colors shrink-0">
                  <svg
                    className="w-4 h-4 text-white group-hover:text-[#E18D1F] transition-colors"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </span>
                <span className="font-[SofiaPro] font-bold text-[#231F20] mob:text-[4vw] text-[1.6vw] group-hover:text-white transition-colors">
                  LinkedIn
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Right: image (Now top on mobile) ── */}
        <div className="relative min-h-[450px] md:min-h-[450px]">
          {/* Top-left corner */}
          <motion.span
            className="pointer-events-none absolute z-10 border-[#E8C84A]"
            style={{
              top: '-12px',
              left: '-12px',
              width: borderSize,
              height: borderSize,
              borderTopWidth: '3px',
              borderLeftWidth: '3px',
              borderRadius: '28px 0 0 0'
            }}
          />

          {/* Bottom-right corner */}
          <motion.span
            className="pointer-events-none absolute z-10 border-primary"
            style={{
              bottom: '-12px',
              right: '-12px',
              width: borderSize,
              height: borderSize,
              borderBottomWidth: '3px',
              borderRightWidth: '3px',
              borderRadius: '0 0 28px 0'
            }}
          />

          {/* Image Container */}
          <div className="relative w-full h-full min-h-[450px] md:min-h-[450px] rounded-[28px] overflow-hidden">
            {IMAGES.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt="Origin Fresh farm"
                fill
                className="object-cover"
                style={{
                  opacity: i === currentImg ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                  position: 'absolute'
                }}
                priority={i === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinCultSection;
