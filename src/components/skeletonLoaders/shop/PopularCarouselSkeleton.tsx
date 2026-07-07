import React from 'react';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';

const PopularCarouselSkeleton = ({ noWrapperStyles }: { noWrapperStyles?: boolean }) => {
  const mobile = useMediaQuery(600);

  const wrapperClass = noWrapperStyles
    ? 'pl-[3vw] pr-10 mob:px-[4vw] overflow-hidden'
    : 'bg-[#F2EEE433] relative border-r-0 mob:border-0 border-primary-200 w-[90.6vw] bg-white py-0 md:py-9 border pt-[72px] mob:pt-0 mob:pl-0 md:pb-0 pl-[2.7vw] lg:rounded-l-[48px] transition-all duration-50 ease-in-out';

  if (mobile) {
    const skeletonCards = Array.from({ length: 4 });
    return (
      <div className={wrapperClass}>
        {/* Title shimmer */}
        <div className="h-[7vw] w-[45vw] bg-gray-200 animate-pulse rounded-full mb-[4vw]" />

        {/* 2-row scroll layout mirror */}
        <div className="flex flex-col gap-[4vw]">
          {[0, 1].map((row) => (
            <div key={row} className="flex gap-[5vw]">
              {skeletonCards.map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[40vw]">
                  {/* Image */}
                  <div className="w-[40vw] h-[38vw] bg-gray-200 animate-pulse rounded-[4.1vw] mb-[2vw]" />
                  {/* Name */}
                  <div className="h-[4vw] w-[30vw] bg-gray-200 animate-pulse rounded-full mb-[1.5vw]" />
                  <div className="h-[3.5vw] w-[20vw] bg-gray-200 animate-pulse rounded-full mb-[2vw]" />
                  {/* Price + Button row */}
                  <div className="flex items-center justify-between">
                    <div className="h-[4vw] w-[14vw] bg-gray-200 animate-pulse rounded-full" />
                    <div className="h-[8.5vw] w-[20vw] bg-gray-200 animate-pulse rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop skeleton
  return (
    <div className={wrapperClass}>
      <div>
        <div className="w-[40vw] h-[3vw] bg-gray-200 animate-pulse rounded-[0.6vw]" />
      </div>

      <div className="flex gap-[1.1vw] my-[4.2vw]">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`popular-skeleton-${index}`} className="cursor-pointer w-[16.67vw] text-start">
            <div className="relative flex items-center mb-[1.1vw] justify-center w-[16.67vw] h-[14vw] rounded-[1.67vw]">
              <div className="w-full h-[14vw] bg-gray-200 animate-pulse rounded-[0.6vw]" />
            </div>

            <div className="h-[2.5vw] bg-gray-200 animate-pulse rounded-[0.6vw] mb-[1vw]" />

            <div className="flex items-end justify-between">
              <div className="w-[50%] h-[1.1vw] bg-gray-200 animate-pulse rounded-[0.6vw]" />
            </div>

            <div className="flex gap-[1.1vw] items-center mt-[1vw]">
              <div className="w-[50%] flex flex-col gap-[0.6vw]">
                <div className="w-full h-[1.67vw] bg-gray-200 animate-pulse" />
                <div className="w-full h-[1.67vw] bg-gray-200 animate-pulse" />
              </div>
              <div className="w-[50%] h-[3vw] bg-gray-200 animate-pulse rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCarouselSkeleton;
