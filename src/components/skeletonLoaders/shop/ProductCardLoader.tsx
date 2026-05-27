import React from 'react';
import Skeleton from '@mui/material/Skeleton';

export const SingleProductCardLoader = () => (
  <div className={`cursor-pointer w-[16.67vw] mob:w-full  text-start `}>
    <div
      className={`relative flex items-center mb-[1.1vw] mob:mb-[4.1vw] justify-center w-[16.67vw] mob:w-full mob:h-[35vw] h-[14vw] rounded-[1.67vw] `}
    >
      <div className="relative w-full h-[14vw] mob:h-[35vw] mob:w-full ">
        <Skeleton variant="rectangular" className="w-full h-full rounded-[.6vw] mob:rounded-[4.1vw]" />
      </div>
    </div>
    <div className="h-[2.5vw] mob:h-[10vw]">
      <Skeleton variant="rectangular" className="w-full h-full rounded-[.6vw] mob:rounded-[2.1vw]" />
    </div>
    <div className="flex items-end justify-between ">
      <div className="flex gap-[1.67vw] flex-col">
        <div className="w-[50%] h-[1.1vw] mob:h-[2vw]">
          <Skeleton variant="rectangular" className="w-full h-full rounded-[.6vw]" />
        </div>
      </div>
    </div>
    <div className="flex gap-[1.1vw] items-center">
      <div className="w-[50%] flex flex-col gap-[.6vw]">
        <div className="w-full h-[1.67vw] mob:h-[4vw]">
          <Skeleton variant="rectangular" className="w-full h-full " />
        </div>
        <div className="w-full h-[1.67vw] mob:h-[4vw]">
          <Skeleton variant="rectangular" className="w-full h-full " />
        </div>
      </div>
      <div className="w-[50%] h-[3vw] mob:h-[8vw] rounded-full ">
        <Skeleton variant="rectangular" className="w-full h-full rounded-full" />
      </div>
    </div>
  </div>
);

const ProductCardLoader = ({ count = 16 }: { count?: number }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 md:grid-cols-4 sm:grid-cols-3 mob:grid-cols-2 gap-[3.5vw] md:gap-[5vw] mob:gap-[5vw] w-full justify-items-center mt-[1.1vw] ">
        {Array.from({ length: count }).map((_, index) => (
          <SingleProductCardLoader key={index} />
        ))}
      </div>
    </div>
  );
};

export default ProductCardLoader;
