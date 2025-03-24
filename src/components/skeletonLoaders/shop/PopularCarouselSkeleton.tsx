import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';

const PopularCarouselSkeleton = () => {
  const mobile = useMediaQuery(600);
  return (
    <div className="bg-[#F2EEE433] relativeborder-r-0  mob:border-0 border-primary-200 w-[90.6vw] bg-white py-0 md:py-9 border pt-[72px] mob:pt-0 mob:pl-0 md:pb-0 pl-[2.7vw] lg:rounded-l-[48px] ltransition-all duration-50 ease-in-out">
      <div>
        <Skeleton variant="rectangular" className="w-[40vw] h-[3vw] rounded-[.6vw]" />
      </div>
      <div className="flex gap-[1.1vw] mob:gap-[4.1vw] my-[4.2vw]">
        {Array.from({ length: mobile ? 3 : 5 }).map((_, index) => (
          <div className={`cursor-pointer w-[16.67vw]  mob:w-[35vw] text-start `}>
            <div
              className={`relative flex items-center mb-[1.1vw] mob:mb-[4.1vw] justify-center w-[16.67vw] mob:w-[35vw] mob:h-[35vw] h-[14vw] rounded-[1.67vw]  `}
            >
              <div className="relative w-full h-[14vw] mob:h-[35vw] ">
                <Skeleton variant="rectangular" className="w-full h-full rounded-[.6vw] mob:rounded-[5vw]" />
              </div>
            </div>
            <div className="h-[2.5vw] mob:h-[5vw]">
              <Skeleton variant="rectangular" className="w-full h-full rounded-[.6vw]" />
            </div>
            <div className="flex items-end justify-between ">
              <div className="flex gap-[1.67vw] mob:gap-[5vw] flex-col">
                <div className="w-[50%] h-[1.1vw] ">
                  <Skeleton variant="rectangular" className="w-full h-full rounded-[.6vw]" />
                </div>
              </div>
            </div>
            <div className="flex gap-[1.1vw] mob:gap-[4.1vw] items-center">
              <div className="w-[50%] flex flex-col mob:gap-[2vw] gap-[.6vw]">
                <div className="w-full h-[1.67vw] mob:h-[4vw] ">
                  <Skeleton variant="rectangular" className="w-full h-full " />
                </div>
                <div className="w-full h-[1.67vw] mob:h-[4vw] ">
                  <Skeleton variant="rectangular" className="w-full h-full " />
                </div>
              </div>
              <div className="w-[50%] h-[3vw] mob:h-[8vw] rounded-full ">
                <Skeleton variant="rectangular" className="w-full h-full rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCarouselSkeleton;
