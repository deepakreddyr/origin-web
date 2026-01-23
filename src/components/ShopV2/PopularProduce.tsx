// import React, { useState, useRef, useEffect } from 'react';
// import ItemCard from '../shared/ItemCard';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';

// interface categoryProp {
//   categoryDetail: any;
// }

// const PopularProduce = ({ categoryDetail }: categoryProp) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const isMobile = useMediaQuery(768);

//   const itemsPerPage = isMobile ? 2 : window.innerWidth >= 1024 ? 4 : 3;
//   const totalItems = categoryDetail.data?.length || 0;
//   const maxIndex = Math.max(0, totalItems - itemsPerPage);

//   const handlePrevious = () => {
//     setCurrentIndex(prev => Math.max(0, prev - 1));
//   };

//   const handleNext = () => {
//     setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
//   };

//   const handleDotClick = (index: number) => {
//     setCurrentIndex(index);
//   };

//   useEffect(() => {
//     setCurrentIndex(0);
//   }, [isMobile]);

//   const visibleItems = categoryDetail.data?.slice(currentIndex, currentIndex + itemsPerPage) || [];

//   return (
//     <div className="relative w-full bg-[#FFF9E5] px-[4vw] py-[3vw] mob:px-[6vw] mob:py-[6vw]">
//       <h2 className="font-[SofiaPro] text-[2.5vw] mob:text-[6vw] font-bold pl-[3vw] mob:pl-5 text-black mb-[2vw] mob:mb-[6vw]">
//         {categoryDetail.title}
//       </h2>

//       <div className="relative flex items-center">
//         {/* Left Chevron - Both Desktop and Mobile */}
//         <button
//           onClick={handlePrevious}
//           disabled={currentIndex === 0}
//           className={`absolute left-[-2vw] mob:left-[-7vw] w-[3vw] h-[3vw] mob:w-[8vw] mob:h-[8vw] rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
//             currentIndex === 0
//               ? 'opacity-50 cursor-not-allowed'
//               : 'hover:bg-gray-100'
//           }`}
//         >
//           <ChevronLeft 
//             size={isMobile ? 24 : 40} 
//             className="text-black" 
//           />
//         </button>

//         <div className="flex-1 mx-[3vw] mob:mx-0">
//           {/* Desktop Grid */}
//           {!isMobile && (
//             <div
//               className={`grid ${
//                 itemsPerPage === 4 ? 'grid-cols-4' : 'grid-cols-3'
//               } gap-[1.5vw]`}
//             >
//               {visibleItems.map((item: any) => (
//                 <div
//                   key={item.id}
//                   className="md:w-[230px] md:h-[280px] w-[25vw] h-[27vw]"
//                 >
//                   <ItemCard itemDetails={item} />
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Mobile Grid - 2 cards side by side */}
//           {isMobile && (
//             <div className="grid grid-cols-2 gap-[3vw] px-[2vw]">
//               {visibleItems.map((item: any) => (
//                 <div
//                   key={item.id}
//                   className="w-[40vw] h-[215px]"
//                 >
//                   <ItemCard itemDetails={item} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Right Chevron - Both Desktop and Mobile */}
//         <button
//           onClick={handleNext}
//           disabled={currentIndex >= maxIndex}
//           className={`absolute right-[-2vw] mob:right-[-7vw] w-[3vw] h-[3vw] mob:w-[8vw] mob:h-[8vw] rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
//             currentIndex >= maxIndex
//               ? 'opacity-50 cursor-not-allowed'
//               : 'hover:bg-gray-100'
//           }`}
//         >
//           <ChevronRight 
//             size={isMobile ? 24 : 40} 
//             className="text-black" 
//           />
//         </button>
//       </div>

//       {/* Dot Navigation */}
//       {totalItems > itemsPerPage && (
//         <div className="flex justify-center mt-[2vw] mob:mt-[6vw] gap-[0.5vw] mob:gap-[2vw]">
//           {Array.from({ length: maxIndex + 1 }).map((_, index) => (
//             <button
//               key={index}
//               onClick={() => handleDotClick(index)}
//               className={`w-[0.8vw] h-[0.8vw] mob:w-[2vw] mob:h-[2vw] rounded-full transition-all duration-200 ${
//                 index === currentIndex
//                   ? 'bg-black'
//                   : 'bg-[#FFDD0066] hover:bg-gray-400'
//               }`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PopularProduce;


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

  return (
    <div className="bg-white mb-[5vw] relative w-[82vw] mob:w-full mx-auto py-12 mob:py-10 border border-[#EDE6D4] rounded-[48px] mob:rounded-[32px] transition-all duration-300 ease-in-out px-10 mob:px-4">
      <div className="flex justify-between items-center mb-8 mob:mb-8">
        <h1 className="font-Stinger text-[2.5vw] mob:text-[6vw] font-bold text-black">
          {categoryDetail.title}
        </h1>

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
        className="flex mob:items-stretch gap-[2.2vw] mob:gap-[5vw] overflow-x-scroll noscrollbar pb-8"
        onScroll={saveScrollPosition}
      >
        {categoryDetail.data?.map((item: any) => (
          <div key={item.id} className="flex-shrink-0 w-[16.67vw] mob:w-[42vw]">
            <ItemCard itemDetails={item} />
          </div>
        ))}
      </div>

      <Box className="flex items-center justify-end mt-8 mob:mt-6">
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