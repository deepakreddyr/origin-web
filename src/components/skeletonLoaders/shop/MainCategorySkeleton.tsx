import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';

const MainCategorySkeleton = () => {
  const mobile = useMediaQuery(600);

  return (
    <div>
      <div>
        <Skeleton
          variant="rectangular"
          className="w-[40vw] h-[3vw] mob:h-[8vw] mob:rounded-[2vw] rounded-[.6vw]"
        />
      </div>

      <div className="flex gap-[.97vw] mob:gap-[3.6vw] mob:mt-[5vw] mt-[2vw]">
        {Array.from({ length: mobile ? 2 : 5 }).map((_, index) => (
          <div
            key={`main-skeleton-${index}`}
            className="w-[15vw] mob:w-[44vw] mob:h-[16vw] h-[13.48vw] rounded-[1.67vw] overflow-hidden"
          >
            <Skeleton variant="rectangular" className="w-full h-full rounded-[.6vw]" />
          </div>
        ))}
      </div>

      <div className="gap-[.97vw] mob:gap-[3.6vw] hidden mob:flex mob:mt-[5vw] mt-[2vw]">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`secondary-skeleton-${index}`}
            className="w-[15vw] mob:w-[28vw] mob:h-[16vw] h-[13.48vw] rounded-[1.67vw] overflow-hidden"
          >
            <Skeleton variant="rectangular" className="w-full h-full rounded-[.6vw]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainCategorySkeleton;
