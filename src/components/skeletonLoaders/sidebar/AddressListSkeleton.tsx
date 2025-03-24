import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const AddressListSkeleton = () => {
  return (
    <div className="flex flex-col gap-[.97vw]">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="cursor-pointer border p-[1.1vw] rounded-[.83vw] mb-[1vw]">
          <div className="flex gap-[.6vw] items-center pb-[.6vw]">
            <Skeleton variant="rectangular" className="w-[3vw] h-[3vw] rounded-[.6vw]" />
            {/* <Skeleton variant="rectangular" className="w-[10vw] h-[3vw] rounded-[.6vw]" /> */}
            <Skeleton variant="rectangular" className="w-[20vw] h-[3vw] rounded-[.6vw]" />
          </div>

          <div className="flex gap-[.78vw] text-[.83vw] text-gray-600 font-medium">
            <Skeleton variant="rectangular" className="w-[4vw] h-[2vw] rounded-[.6vw]" />
            <Skeleton variant="rectangular" className="w-[4vw] h-[2vw] rounded-[.6vw]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressListSkeleton;
