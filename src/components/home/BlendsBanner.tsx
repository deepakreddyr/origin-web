import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, PanInfo } from 'framer-motion';

const items = [
  { id: 0, src: '/assets/images/BlendsCat.png' },
  { id: 1, src: '/assets/images/BlendsCat1.png' },
  { id: 2, src: '/assets/images/BlendsCat1.png' }
];

const ArrowIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-black ${className}`}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const BlendsBanner = ({ href }: { href: string }) => {
  const [rotation, setRotation] = useState(0);

  const handlePanEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50) {
      // Swipe left, rotate right (items move left)
      setRotation((prev) => (prev + 1) % 3);
    } else if (info.offset.x > 50) {
      // Swipe right, rotate left (items move right)
      setRotation((prev) => (prev - 1 + 3) % 3);
    }
  };

  const getPositionIndex = (index: number) => {
    return (index - rotation + 3) % 3;
  };

  const getStyleForPosition = (posIndex: number, isMobile: boolean) => {
    const xOffset = isMobile ? '22vw' : '319.63px'; // 208.9 + 7.61 + 103.12
    const scaleDown = isMobile ? 0.4936 : 206.245 / 417.818; // ~0.4936

    switch (posIndex) {
      case 0: // Center
        return { x: '0px', scale: 1, zIndex: 10, opacity: 1 };
      case 1: // Right
        return { x: xOffset, scale: scaleDown, zIndex: 0, opacity: 1 };
      case 2: // Left
        return { x: isMobile ? `-${xOffset}` : '-319.63px', scale: scaleDown, zIndex: 0, opacity: 1 };
      default:
        return { x: '0px', scale: 1, zIndex: 10, opacity: 1 };
    }
  };

  return (
    <div className="w-full bg-[#3A5A48] py-[5vw] md:py-[59.88px] overflow-hidden mb-[4vw] md:h-[472px] flex items-center">
      <div className="max-w-[1440px] mx-auto px-[4vw] md:px-[150px] flex flex-row items-center justify-between w-full">
        {/* Left side text */}
        <div className="w-[50%] z-10 relative flex flex-col items-start px-0">
          <span className="font-[Recoleta] font-[900] text-[#ACD0AF] text-[5.5vw] md:text-[67.37px] leading-[1.1] md:leading-[67.37px] mb-[2vw] md:mb-[24px]">
            Liquid
            <br />
            Alchemy.
          </span>
          <p className="font-[SofiaPro] font-[500] text-[#ABD0AF] text-[2.2vw] md:text-[16.84px] leading-[1.3] md:leading-[27.37px] max-w-[40vw] md:max-w-[400px] mb-[3vw] md:mb-[32px]">
            Cold-pressed elixirs, botanical infusions, and morning rituals curated for holistic vitality.
          </p>
          <Link
            href={href}
            className="inline-flex items-center justify-center gap-[1.5vw] md:gap-[20px] bg-white text-black font-[SofiaPro] font-bold px-[3vw] md:px-[36px] py-[1.5vw] md:py-[20px] md:w-[262.37px] md:h-[73.37px] rounded-full text-[2.5vw] md:text-[20px] md:leading-[26.2px] hover:bg-gray-100 transition-colors"
          >
            Explore Blends
            <div className="bg-gray-200 rounded-full p-[0.5vw] md:p-1 ml-[0.5vw] md:ml-1 flex items-center justify-center">
              <ArrowIcon className="w-[2.5vw] h-[2.5vw] md:w-[20px] md:h-[20px]" />
            </div>
          </Link>
        </div>

        {/* Right side images (Swipeable) */}
        <div className="w-[50%] relative h-[40vw] md:h-[450px] flex items-center justify-center -translate-x-[5vw] md:-translate-x-[60px]">
          <motion.div
            className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            onPanEnd={handlePanEnd}
            style={{ touchAction: 'none' }}
          >
            {items.map((item, index) => {
              const posIndex = getPositionIndex(index);
              // Simple check for mobile vs desktop width (fallback)
              const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
              const style = getStyleForPosition(posIndex, isMobile);

              return (
                <motion.div
                  key={item.id}
                  className="absolute w-[28vw] h-[28vw] md:w-[417.81px] md:h-[423.14px]"
                  animate={style}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  <div className="relative w-full h-full pointer-events-none">
                    <Image
                      src={item.src}
                      alt="Blend"
                      fill
                      className={`object-contain ${posIndex === 0 ? 'drop-shadow-2xl' : ''}`}
                      draggable={false}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
