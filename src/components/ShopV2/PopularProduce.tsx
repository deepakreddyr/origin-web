import React, { useRef, useEffect } from 'react';
import ItemCard from '../shared/ItemCard';
import { Box } from '@mui/material';
import CarouselButtons from '../CarouselButtons';
interface categoryProp {
  categoryDetail: any;
}

const PopularProduce = (props: categoryProp) => {
  const { categoryDetail } = props;
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollKey = `sliderScrollPosition_${categoryDetail.title}`;

  const handleScroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
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
    <>
    <div className="relative w-[90.6vw] bg-transparent mob:bg-transparent pt-[72px] mob:pt-[2vw] pb-0 mob:pl-0 pl-[2.7vw] rounded-[12px]  mob:shadow-none mob:rounded-none transition-all duration-50 ease-in-out">
        <p className="font-[SofiaPro] text-[1.944vw] mob:text-[5.1vw] pb-[2.1vw] font-bold py-[1.1vw] mob:py-[4.1vw]">
          {categoryDetail.title}
        </p>

        <div
          ref={sliderRef}
          className="flex mob:items-start gap-[2.2vw] mob:gap-[5vw] mob:pr-[6vw] overflow-x-scroll noscrollbar pr-[3vw] pb-[3vw]"
          onScroll={saveScrollPosition}
        >
          {categoryDetail.data?.map((item: any) => (
            <div key={item.id} className="mob:w-[50vw] mob:min-w-[50vw] mob:max-w-[45vw] mob:min-h-[260px] w-[17vw] min-w-[17vw] max-w-[17vw]">
              <ItemCard itemDetails={item} />
            </div>
          ))}
        </div>

        <Box className="flex items-center justify-between py-[2vw] mob:pt-[8vw] pr-[10.5vw] mob:px-0 mob:hidden">
        <div></div>
        <CarouselButtons
          leftButtonClass="poBlogsRight"
          rightButtonClass="poBlogsLeft"
          leftClick={() => handleScroll('left')}
          rightClick={() => handleScroll('right')}
        />
      </Box>
      </div>

    </>
  );
};

export default PopularProduce;
