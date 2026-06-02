import React, { useRef, useEffect } from 'react';
import ItemCard from '../shared/ItemCard';
import { Box } from '@mui/material';
import CarouselButtons from '../CarouselButtons';
import OriginButton from '../OriginButton';

interface categoryProp {
  categoryDetail: any;
  alignment?: 'left' | 'center' | 'right';
}

const PopularProduce = (props: categoryProp) => {
  const { categoryDetail, alignment = 'center' } = props;
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollKey = `sliderScrollPosition_${categoryDetail.title}`;
  const [activeTab, setActiveTab] = React.useState('today');

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

  if (!categoryDetail || !categoryDetail.data || categoryDetail.data.length === 0) return null;

  if (!categoryDetail || !categoryDetail.data || categoryDetail.data.length === 0) return null;

  const alignmentStyles = {
    center: 'md:w-auto md:ml-[max(6vw,calc(56vw_-_720px))] md:mr-[max(6vw,calc(56vw_-_720px))] md:rounded-[48px]',
    left: 'md:w-auto md:ml-0 md:mr-[max(6vw,calc(56vw_-_720px))] md:rounded-none md:rounded-r-[48px] md:border-l-0',
    right: 'md:w-auto md:ml-[max(6vw,calc(56vw_-_720px))] md:mr-0 md:rounded-none md:rounded-l-[48px] md:border-r-0'
  };

  const containerClass = `bg-white mb-[5vw] relative py-12 mob:py-10 transition-all duration-300 ease-in-out w-[92vw] mx-auto rounded-[32px] border-[#EDE6D4] border ${alignmentStyles[alignment]}`;

  return (
    <div className={containerClass}>
      <div className="flex justify-between items-center mb-8 mob:mb-8 pl-[3vw] pr-10 mob:px-2">
        <h1 className="font-[Recoleta] text-[2.5vw] mob:text-[6vw] font-semibold text-black">{categoryDetail.title}</h1>

        {/* Toggle - Today / Tomorrow */}
        {/* <div className="hidden md:flex bg-[#F8F8F8] p-1 rounded-full border border-gray-100">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === 'today' ? 'bg-white shadow-sm text-black' : 'text-gray-400'
              }`}
          >
            {activeTab === 'today' && <span className="text-black">✓</span>}
            Get it today
          </button>
          <button
            onClick={() => setActiveTab('tomorrow')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === 'tomorrow' ? 'bg-white shadow-sm text-black' : 'text-gray-400'
              }`}
          >
            {activeTab === 'tomorrow' && <span className="text-black">✓</span>}
            Get it tomorrow
          </button>
        </div> */}
      </div>

      <div
        ref={sliderRef}
        className="flex mob:items-stretch gap-[2.2vw] mob:gap-[5vw] overflow-x-scroll noscrollbar pb-8 pl-[3vw] pr-10 mob:px-2"
        onScroll={saveScrollPosition}
      >
        {categoryDetail.data?.map((item: any) => (
          <div key={item.id} className="flex-shrink-0 w-[16.67vw] mob:w-[40vw]">
            <ItemCard itemDetails={item} />
          </div>
        ))}
      </div>

      <Box className="flex items-center justify-end mt-8 mob:mt-6 pr-10 mob:pr-2">
        {/* <OriginButton
          variant="outlined"
          buttonText="Shop all products"
          handleClick={() => window.location.href = '/shop'}
          className="!px-8 !py-3 !border-black !text-sm !font-bold"
        /> */}

        <CarouselButtons
          leftButtonClass="poProductsRight"
          rightButtonClass="poProductsLeft"
          leftClick={() => handleScroll('left')}
          rightClick={() => handleScroll('right')}
        />
      </Box>
    </div>
  );
};

export default PopularProduce;
