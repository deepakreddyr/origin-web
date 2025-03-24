import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const CouponListSkeleton = () => {
  return (
    <div>
      <div>
        <Skeleton variant="rectangular" className="w-full h-[3vw] mob:h-[8vw] rounded-full" />
      </div>
      <div className="flex flex-col gap-[1.67vw] mob:gap-[5vw] mob:mt-[4.1vw] mt-[1.1vw]">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            className={`rounded-[1.1vw] mob:rounded-[4.1vw] mob:p-[4.1vw] bg-[#F2EEE44D] border border-[#231F201F] `}
          >
            <div className="flex items-center justify-between mob:p-[3vw] p-[.78vw]">
              <div className="flex flex-col gap-[1.1vw] mob:gap-[4.1vw] ">
                <Skeleton variant="rectangular" className="w-[10vw] mob:w-[30vw] h-[1vw] mob:h-[3vw] " />
                <Skeleton variant="rectangular" className="w-[10vw] mob:w-[30vw] h-[1vw] mob:h-[3vw]" />
              </div>
              <Skeleton variant="rectangular" className="w-[12vw] mob:w-[30vw] h-[3vw] mob:h-[8vw] " />
            </div>
            <Skeleton variant="rectangular" className="w-[]95% h-[3vw] m-[1.1vw] " />
          </div>
        ))}
      </div>
      <div></div>
    </div>
  );
};

export default CouponListSkeleton;
