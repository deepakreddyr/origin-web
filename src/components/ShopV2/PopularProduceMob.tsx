import React, { useRef, useEffect, useMemo } from 'react';
import ItemCard from '../shared/ItemCard';
import { Box } from '@mui/material';
import CarouselButtons from '../CarouselButtons';
import OriginButton from '../OriginButton';

interface categoryProp {
  categoryDetail: any;
}

const PopularProduce = ({ categoryDetail }: categoryProp) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollKey = `sliderScrollPosition_${categoryDetail.title}`;

  // 1. SPLIT LOGIC
  // We use useMemo to avoid recalculating on every render, though it's light enough if you don't.
  const { topRow, bottomRow } = useMemo(() => {
    const data = Array.isArray(categoryDetail?.data) ? categoryDetail.data : [];
    const length = data.length;

    // Logic: 13 items -> ceil(6.5) = 7. Top gets 7, Bottom gets 6.
    const splitIndex = Math.ceil(length / 2);

    return {
      topRow: data.slice(0, splitIndex),
      bottomRow: data.slice(splitIndex)
    };
  }, [categoryDetail]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const saveScrollPosition = () => {
    if (sliderRef.current) {
      const scrollPosition = sliderRef.current.scrollLeft;
      localStorage.setItem(scrollKey, String(scrollPosition));
    }
  };

  const restoreScrollPosition = () => {
    const savedPosition = localStorage.getItem(scrollKey);
    if (sliderRef.current && savedPosition) {
      sliderRef.current.scrollLeft = parseInt(savedPosition, 10);
    }
  };

  useEffect(() => {
    restoreScrollPosition();
    return () => saveScrollPosition();
  }, []);

  return (
    <div className="relative w-[92vw] md:w-[80vw] mx-auto py-0 md:py-9 transition-all duration-50 ease-in-out">
      <h1 className="font-Stinger text-[2.5vw] mob:text-[7vw] pb-[2.1vw] font-bold py-[1.1vw] mob:py-[4.1vw]">
        {categoryDetail.title}
      </h1>

      {/* SCROLL CONTAINER */}
      <div
        ref={sliderRef}
        className="overflow-x-scroll noscrollbar pb-8" // Removed flex items-stretch here to allow inner content to dictate width
        onScroll={saveScrollPosition}
      >
        {/* WRAPPER: 
            w-max (max-content) is crucial. It forces the div to expand 
            horizontally to fit all children, enabling the scroll on the parent.
            flex-col stacks the two rows vertically.
        */}
        <div className="flex flex-col gap-[4vw] mob:gap-[4vw] w-max pr-[5vw]">

          {/* ROW 1 (TOP) */}
          <div className="flex gap-[2.2vw] mob:gap-[5vw]">
            {topRow.map((item: any) => (
              <div key={item.id} className="flex-shrink-0 mob:w-[40vw]">
                <ItemCard itemDetails={item} />
              </div>
            ))}
          </div>

          {/* ROW 2 (BOTTOM) */}
          <div className="flex gap-[2.2vw] mob:gap-[5vw]">
            {bottomRow.map((item: any) => (
              <div key={item.id} className="flex-shrink-0 mob:w-[40vw]">
                <ItemCard itemDetails={item} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PopularProduce;