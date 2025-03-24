import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const DropdownAndPillsSkeleton = () => {
  return (
    <div>
      <div className="flex gap-[.6vw] mob:gap-[2vw] w-full">
        <div className="w-[15vw] mob:w-[40vw] h-[2.5vw] mob:h-[8vw] rounded-[.6vw]">
          <Skeleton variant="rectangular" className="w-full h-full rounded-[.6vw]" />
        </div>
        <div className="w-[3vw] h-[2.5vw] mob:h-[8vw] mob:w-[8vw] rounded-[.6vw]">
          <Skeleton variant="rectangular" className="w-full h-full rounded-[.6vw]" />
        </div>
      </div>
      <div className="flex gap-[1.6vw] mt-[1.1vw] mob:mt-[4.1vw]  ">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <Skeleton variant="rectangular" className=" rounded-[3vw] w-[6vw] mob:w-[20vw] mob:h-[8vw] h-[2.8vw]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropdownAndPillsSkeleton;
