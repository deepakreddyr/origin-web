import React, { useState, useRef, useEffect } from 'react';
import ItemCard from '../shared/ItemCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';

interface categoryProp {
  categoryDetail: any;
}

const PopularProduce = ({ categoryDetail }: categoryProp) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileScrollIndex, setMobileScrollIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(768);

  const itemsPerPage = isMobile ? 2 : window.innerWidth >= 1024 ? 4 : 3;
  const totalItems = categoryDetail.data?.length || 0;
  const maxIndex = Math.max(0, totalItems - itemsPerPage);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const handleMobileScroll = () => {
    if (scrollContainerRef.current && isMobile) {
      const container = scrollContainerRef.current;
      const cardWidth = container.firstChild
        ? (container.firstChild as HTMLElement).offsetWidth + 16 // card width + gap
        : 0;

      if (cardWidth > 0) {
        const newIndex = Math.round(container.scrollLeft / cardWidth);
        setMobileScrollIndex(newIndex);
      }
    }
  };

  const handleDotClick = (index: number) => {
    if (isMobile && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.firstChild
        ? (container.firstChild as HTMLElement).offsetWidth + 16
        : 0;

      const scrollPosition = index * cardWidth;
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
      setMobileScrollIndex(index);
    } else {
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    setCurrentIndex(0);
    setMobileScrollIndex(0);
  }, [isMobile]);

  const visibleItems = !isMobile
    ? categoryDetail.data?.slice(currentIndex, currentIndex + itemsPerPage) || []
    : categoryDetail.data || [];

  const maxMobileIndex = Math.max(0, (totalItems || 0) - 1);
  const currentMobileIndex = isMobile ? mobileScrollIndex : currentIndex;
  const maxCurrentIndex = isMobile ? maxMobileIndex : maxIndex;

  return (
    <div className="relative w-full bg-[#FFF9E5] px-[4vw] py-[3vw] mob:px-[6vw] mob:py-[6vw] mob:overflow-visible">
      <h2 className="font-[SofiaPro] text-[2.5vw] mob:text-[6vw] font-bold pl-[3vw] mob:pl-10 text-black mb-[2vw] mob:mb-[6vw]">
        {categoryDetail.title}
      </h2>

      <div className="relative flex items-center mob:overflow-visible">
        {!isMobile && (
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`absolute left-[-2vw] w-[3vw] h-[3vw] rounded-full flex items-center justify-center transition-all duration-200 ${
              currentIndex === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={40} className="text-black" />
          </button>
        )}

        <div className="flex-1 mx-[3vw] mob:mx-0 mob:overflow-visible">
          {/* Desktop Grid */}
          {!isMobile && (
            <div
              className={`grid ${
                itemsPerPage === 4 ? 'grid-cols-4' : 'grid-cols-3'
              } gap-[1.5vw]`}
            >
              {visibleItems.map((item: any) => (
                <div
                  key={item.id}
                  className="md:w-[230px] md:h-[280px]  w-[25vw] h-[27vw]"
                >
                  <ItemCard itemDetails={item} />
                </div>
              ))}
            </div>
          )}

          {/* Mobile Scroll */}
          {isMobile && (
            <div
              ref={scrollContainerRef}
              className="flex gap-[4vw] pb-2 overflow-x-scroll scroll-smooth"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                width: '100%',
                paddingLeft: '6vw',
                paddingRight: '6vw',
              }}
              onScroll={handleMobileScroll}
            >
              {visibleItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex-shrink-0"
                  style={{
                    scrollSnapAlign: 'center',
                    width: '42vw',
                    minWidth: '42vw',
                  }}
                >
                  <ItemCard itemDetails={item} />
                </div>
              ))}
            </div>
          )}
        </div>

        {!isMobile && (
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-[-2vw] w-[3vw] h-[3vw] rounded-full flex items-center justify-center transition-all duration-200 ${
              currentIndex >= maxIndex
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100'
            }`}
          >
            <ChevronRight size={40} className="text-black" />
          </button>
        )}
      </div>

      {totalItems > itemsPerPage && (
        <div className="flex justify-center mt-[2vw] mob:mt-[6vw] gap-[0.5vw] mob:gap-[2vw]">
          {Array.from({ length: maxCurrentIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-[0.8vw] h-[0.8vw] mob:w-[2vw] mob:h-[2vw] rounded-full transition-all duration-200 ${
                index === currentMobileIndex
                  ? 'bg-black'
                  : 'bg-[#FFDD0066] hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularProduce;
