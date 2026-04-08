import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useMediaQuery } from '@mui/material';

const MangoItemSkeleton = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <div className="bg-white border border-[#EDE6D4] flex flex-col h-full relative z-[1] w-full p-3 md:p-3 rounded-[12px] md:rounded-[24px]">
      {/* Image Skeleton */}
      <div
        className="relative bg-[#F3F0E6] w-full mb-3 md:mb-4 overflow-hidden"
        style={{
          height: isMobile ? '150px' : '230px',
          borderRadius: isMobile ? '12px' : '21.16px'
        }}
      >
        <Skeleton variant="rectangular" width="100%" height="100%" sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)' }} />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col mb-1 px-0 md:px-1 gap-1">
        {/* Title */}
        <Skeleton variant="text" width="80%" height={24} sx={{ borderRadius: '4px' }} />
        {/* Unit */}
        <Skeleton variant="text" width="40%" height={16} sx={{ borderRadius: '2px' }} />
      </div>

      {/* Price and Action Area Skeleton */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex flex-col gap-1">
          <Skeleton variant="text" width={60} height={24} sx={{ borderRadius: '4px' }} />
        </div>
        <div className="flex items-center">
          <Skeleton variant="circular" width={isMobile ? 70 : 100} height={40} sx={{ borderRadius: '20px' }} />
        </div>
      </div>
    </div>
  );
};

export default MangoItemSkeleton;
