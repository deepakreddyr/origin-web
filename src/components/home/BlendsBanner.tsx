import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, PanInfo } from 'framer-motion';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';

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
  const mobile = useMediaQuery(768);

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
    const xOffset = isMobile ? '125px' : '319.63px'; // spacing between carousel items
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
    <div className="w-full bg-[#3A5A48] pt-[56px] pb-[21.06px] px-[21.06px] md:py-[59.88px] md:px-0 overflow-hidden mb-[4vw] h-[613px] md:h-[472px] flex items-center md:items-center">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between w-full h-full md:px-[150px] gap-[0px] md:gap-0">
        {/* Left side text */}
        <div className="w-[350.88px] md:w-[50%] z-10 relative flex flex-col items-start px-0 gap-[21.08px] md:gap-0">
          <span className="font-[Recoleta] font-[900] text-[#ACD0AF] text-[54px] leading-[54.14px] md:text-[67.37px] md:leading-[67.37px] md:mb-[24px]">
            Liquid
            <br />
            Alchemy.
          </span>
          <p className="font-[SofiaPro] font-[500] text-[#ABD0AF] text-[16px] leading-[25.69px] md:text-[16.84px] md:leading-[27.37px] max-w-full md:max-w-[400px] md:mb-[32px]">
            Cold-pressed elixirs, botanical infusions, and morning rituals curated for holistic vitality.
          </p>
          <Link
            href={href}
            className="inline-flex items-center justify-center gap-[20px] bg-white text-black font-[SofiaPro] font-bold px-[36px] py-[20px] w-[262.37px] h-[73.37px] rounded-full text-[20px] leading-[26.2px] hover:bg-gray-100 transition-colors"
            style={
              mobile
                ? {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '193.92px',
                    height: '58.92px',
                    borderRadius: '9999px',
                    paddingTop: '16.06px',
                    paddingBottom: '16.06px',
                    paddingLeft: '21.39px',
                    paddingRight: '19.68px',
                    backgroundColor: '#ffffff',
                    color: '#23422A',
                    fontFamily: 'SofiaPro',
                    fontWeight: 700,
                    fontSize: '14px',
                    transition: 'background-color 0.2s'
                  }
                : {}
            }
          >
            Explore Blends
            <div
              className="bg-gray-200 rounded-full flex items-center justify-center md:p-1 md:ml-1"
              style={{ width: '24px', height: '24px', flexShrink: 0 }}
            >
              <ArrowIcon className="w-[14px] h-[14px] md:w-[20px] md:h-[20px]" />
            </div>
          </Link>
        </div>

        {/* Images — centered below text on mobile */}
        <div className="w-full md:w-[50%] relative flex-1 md:h-[450px] flex items-center justify-center md:left-0 md:-translate-x-[60px]">
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
                  className="absolute w-[202px] h-[202px] md:w-[417.81px] md:h-[423.14px]"
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
