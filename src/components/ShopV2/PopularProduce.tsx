import React, { useState, useRef, useEffect } from 'react';
import ItemCard from '../shared/ItemCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import left from '/public/assets/svg/leftchevron.svg';
import right from '/public/assets/svg/rightchevron.svg';
import Image from 'next/image';
interface categoryProp {
  categoryDetail: any;
}

const PopularProduce = ({ categoryDetail }: categoryProp) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(768);

  // Always show 3 cards on desktop, 2 on mobile
  const itemsPerPage = isMobile ? 2 : 3;
  const totalItems = categoryDetail.data?.length || 0;
  const maxIndex = Math.max(0, totalItems - itemsPerPage);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
    setHoveredIndex(null);
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    setHoveredIndex(null);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile]);

  const visibleItems = categoryDetail.data?.slice(currentIndex, currentIndex + itemsPerPage) || [];

  return (
    <div className="relative w-full px-[4vw] py-[3vw] mob:px-[6vw] mob:py-[6vw] overflow-hidden">
      <h2 className="font-[SofiaPro] text-[2.5vw] mob:text-[6vw] font-bold pl-[3vw] mob:pl-5 text-white mb-[2vw] mob:mb-[6vw]">
        {categoryDetail.title}
      </h2>

      <div className="relative flex items-start pb-[3vw]">
        {/* Left Chevron */}
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`absolute left-[-2vw] top-[45%] mob:left-[-7vw] w-[3vw] h-[3vw] mob:w-[8vw] mob:h-[8vw] bg-black rounded-full flex items-center justify-center transition-all duration-200 z-[10] shadow-lg`}
        >
          <Image
            src={left}
            width={300}
            height={300}
            alt="Shop Hero Single Banner"
            layout="responsive"/>
        
        </button>

        <div className="flex-1 mx-[3vw] mob:mx-0">
          {/* Desktop Grid - 3 cards with fixed larger size */}
          {!isMobile && (
            <div className="grid grid-cols-3 gap-[2vw] items-start">
              {visibleItems.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className={`transition-all duration-300 origin-top ${
                    hoveredIndex === index 
                      ? 'scale-110 z-[5]' 
                      : hoveredIndex !== null 
                        ? 'scale-90' 
                        : 'scale-100 z-[1]'
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div style={{ 
                    width: '20vw',
                    height: '25vw',
                  }}>
                    <ItemCard itemDetails={item} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tablet Grid - 3 cards with fixed size */}
          {isMobile && !window.matchMedia('(max-width: 640px)').matches && (
            <div className="grid grid-cols-3 gap-[2vw] items-start">
              {visibleItems.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="w-full"
                >
                  <div style={{ 
                    width: '24.3vw',
                    height: '29.2vw',
                  }}>
                    <ItemCard itemDetails={item} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile Grid - 2 cards with fixed size */}
          {isMobile && window.matchMedia('(max-width: 640px)').matches && (
            <div className="grid grid-cols-2 gap-[3vw] px-[2vw] items-start">
              {visibleItems.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="w-full"
                >
                  <div style={{ 
                    width: '100%',
                    height: '280px',
                    minHeight: '280px'
                  }}>
                    <ItemCard itemDetails={item} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Chevron */}
        <button
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className={`absolute right-[-2vw] top-[45%] mob:right-[-7vw] w-[3vw] h-[3vw] mob:w-[8vw] mob:h-[8vw] bg-black rounded-full flex items-center justify-center transition-all duration-200 z-[10] shadow-lg `}
        >
          <Image
            src={right}
            width={300}
            height={300}
            alt="Shop Hero Single Banner"
            layout="responsive"/>
        </button>
      </div>
    </div>
  );
};

export default PopularProduce;