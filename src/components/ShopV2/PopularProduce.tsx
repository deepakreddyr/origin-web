import React, { useRef, useEffect } from 'react';
import ItemCard from '../shared/ItemCard';
import { Box } from '@mui/material';
import CarouselButtons from '../CarouselButtons';
import OriginButton from '../OriginButton';

interface categoryProp {
  categoryDetail: any;
}

const PopularProduce = (props: categoryProp) => {
  const { categoryDetail } = props;
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollKey = `sliderScrollPosition_${categoryDetail.title}`; // Unique key based on the category

  const handleScroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 300; // Adjust based on item width
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
    <div className="bg-[#F2EEE433] relative border-primary-200 mob:border-0 w-[90.6vw] bg-white py-0 md:py-9 border pt-[72px] mob:pt-[2vw] md:pb-0 mob:pl-0 pl-[2.7vw] lg:rounded-l-[48px] transition-all duration-50 ease-in-out">
      <p className="font-[Stinger] text-[1.944vw] mob:text-[5.1vw] pb-[2.1vw] font-bold py-[1.1vw] mob:py-[4.1vw]">
        {categoryDetail.title}
      </p>

      <div
        ref={sliderRef}
        className="flex mob:items-start gap-[2.2vw] mob:gap-[5vw] mob:pr-[6vw] overflow-x-scroll noscrollbar pr-[3vw]"
        onScroll={saveScrollPosition}
      >
        {categoryDetail.data?.map((item: any) => (
          <div key={item.id} className="mob:w-[60vw] w-[13vw] min-w-[13vw]">
            <ItemCard itemDetails={item} />
          </div>
        ))}
      </div>

      <Box className="flex items-center justify-between py-[2vw] mob:pt-[8vw] pr-[10.5vw] mob:px-0 ">
        {/* <OriginButton
          variant="outlined"
          buttonText="Shop all products"
          classes={{ iconButton: 'py-2 px-4 md:py-4 md:px-7' }}
        /> */}
        <div className=""></div>
        <CarouselButtons
          leftButtonClass="poBlogsRight"
          rightButtonClass="poBlogsLeft"
          leftClick={() => handleScroll('left')}
          rightClick={() => handleScroll('right')}
        />
      </Box>
    </div>
  );
};

export default PopularProduce;
