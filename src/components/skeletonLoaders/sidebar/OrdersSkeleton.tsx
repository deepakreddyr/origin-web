import React from 'react';
import Skeleton from '@mui/material/Skeleton';
const OrdersSkeleton = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="cursor-pointer bg-[#F8F4E9] p-[1.1vw] mob:p-[4.1vw] mob:rounded-[3vw] mob:mb-[4vw] rounded-[.83vw] mb-[1vw]"
        >
          <div className="flex justify-between items-center mob:pb-[2.5vw] pb-[.6vw]">
            <Skeleton variant="rectangular" className="w-[10vw] h-[2vw] rounded-[.6vw]" />
            <Skeleton variant="rectangular" className="w-[10vw] h-[2vw] rounded-[.6vw]" />
          </div>

          <div className="flex justify-between text-[.83vw] mob:text-[3vw] text-gray-600 font-medium">
            <Skeleton variant="rectangular" className="w-[10vw] h-[2vw] rounded-[.6vw]" />
            <Skeleton variant="rectangular" className="w-[10vw] h-[2vw] rounded-[.6vw]" />
          </div>
        </div>
      ))}
    </>
  );
};

export default OrdersSkeleton;
