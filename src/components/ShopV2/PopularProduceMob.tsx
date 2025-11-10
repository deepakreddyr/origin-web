import React, { useRef, useEffect } from 'react';
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
    <div className="relative w-[90.6vw] py-0 md:py-9 mob:pl-[5vw] md:pl-[5vw] tabp:pl-[5vw] tabl:pl-[5vw] lg:rounded-l-[48px] transition-all duration-50 ease-in-out">
      <p className="font-[SofiaPro] text-[1.944vw] mob:text-[5.1vw] pb-[2.1vw] font-bold py-[1.1vw] mob:py-[4.1vw]">
        {categoryDetail.title}
      </p>

      <div
        ref={sliderRef}
        className="flex items-start gap-[2.2vw] mob:gap-[5vw] overflow-x-scroll noscrollbar pr-[3vw]"
        onScroll={saveScrollPosition}
      >
        {Array.isArray(categoryDetail?.data) &&
          categoryDetail.data.map((item: any) => (
            <div
              key={item.id}
              className="
                flex-shrink-0 
                w-[16vw] aspect-[4/5]

                /* ✅ Existing sizes */
                tab:w-[190px] tab:h-[210px]
                md:w-[200px] md:h-[220px]
                mob:w-[220px] mob:h-[330px]

                /* ✅ New sizes */
                tabp:w-[190px] tabp:h-[210px]       /* 768px portrait tablets */
                tabl:w-[210px] tabl:h-[260px]       /* 1024px landscape tablets */
                midlg:w-[220px] midlg:h-[270px]     /* 1180px small desktop breakpoint */
              "
            >
              <ItemCard itemDetails={item} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default PopularProduce;
