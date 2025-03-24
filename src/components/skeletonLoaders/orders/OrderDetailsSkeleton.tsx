import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const OrderDetailsSkeleton = () => {
  return (
    <div>
      <div>
        <Skeleton variant="rectangular" className="w-1/2 h-[3vw] mob:w-full mob:h-[10vw]" />
        <Skeleton
          variant="rectangular"
          className="w-[20vw] h-[1.5vw] mob:w-[90%] mob:h-[3vw] mt-[.78vw] mob:mt-[3vw]"
        />
      </div>
      <div className="flex mob:flex-col gap-[1.67vw] pt-[1.67vw] mob:pt-[5vw]">
        <div>
          <div className="w-[30vw] mob:w-screen mob:h-[90vw] flex flex-col gap-[1.1vw]">
            <Skeleton
              variant="rectangular"
              className="w-full h-[25vw] mob:w-screen mob:h-[90vw] mob:rounded-b-[4.1vw] rounded-[1vw]"
            />
          </div>
          <div className="bg-[#F2EEE44D] border border-[#F2EEE4] rounded-[1.1vw] mob:rounded-[4.1vw] mob:p-[4.1vw] p-[1.1vw] flex flex-col gap-[1.1vw] mt-[1.67vw] mob:gap-[4.1vw] mob:mt-[5.1vw] mob:mx-[4.1vw] ">
            <Skeleton variant="rectangular" className="w-full h-[3vw] mob:h-[10vw] mob:rounded-[2vw] rounded-[.5vw]" />
            <Skeleton variant="rectangular" className="w-full h-[3vw] mob:h-[10vw] mob:rounded-[2vw] rounded-[.5vw]" />
            <Skeleton variant="rectangular" className="w-full h-[3vw] mob:h-[10vw] mob:rounded-[2vw] rounded-[.5vw]" />
          </div>
          <div className="border w-full h-max bg-[#F2EEE44D] border-[#F2EEE4] rounded-[1.1vw] mob:rounded-[4.1vw] mob:p-[4.1vw] p-[1.1vw] mob:mt-[5.1vw] mt-[1.67vw] mob:mx-[4.1vw] mob:w-[92%] ">
            <Skeleton variant="rectangular" className="w-full h-[2vw] mob:h-[5vw] " />
            <div>
              <div className="flex items-center mt-[1.1vw] mob:mt-[4.1vw] mob:gap-[3vw] gap-[.78vw] ">
                <Skeleton variant="rectangular" className="w-[3vw] mob:w-[10vw] mob:h-[10vw] h-[3vw] " />
                <div>
                  <Skeleton variant="rectangular" className="w-[12vw] mob:w-[25vw] mob:h-[4vw] h-[1vw] " />
                  <Skeleton variant="rectangular" className="w-[12vw] mob:w-[25vw] mob:h-[4vw]  h-[1vw] mt-[1.1vw] " />
                </div>
              </div>
              <Skeleton variant="rectangular" className="w-full h-[2vw] mt-[1.67vw] mob:mt-[5.1vw] mob:h-[5vw]" />

              <div className="flex items-center mt-[1.1vw] mob:mt-[4.1vw] mob:gap-[3vw] gap-[.78vw] ">
                <Skeleton variant="rectangular" className="w-[3vw] mob:w-[10vw] mob:h-[10vw] h-[3vw] " />
                <div>
                  <Skeleton variant="rectangular" className="w-[12vw] mob:w-[25vw] mob:h-[4vw] h-[1vw] " />
                  <Skeleton variant="rectangular" className="w-[12vw] mob:w-[25vw] mob:h-[4vw]  h-[1vw] mt-[1.1vw] " />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border w-[50vw] mob:w-[92vw] mob:mx-[4.1vw] mob:mt-[4.1vw] h-max border-[#F2EEE4] flex flex-col gap-[1.67vw] mob:gap-[5.1vw] mob:rounded-[4.1vw] mob:p-[4.1vw] rounded-[1.1vw] p-[1.1vw]">
          <div className="border-b ">
            <Skeleton variant="rectangular" className="w-full h-[3vw] mob:h-[5vw] " />
            <Skeleton
              variant="rectangular"
              className="w-[15vw] mob:h-[4vw] h-[1vw] mob:my-[4.1vw] mt-[1.1vw]  mb-[1.1vw] "
            />
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[1.1vw] mob:gap-[4.1vw] ">
                  <div className="w-[3.5vw] mob:w-[10vw] mob:h-[10vw] h-[3.5vw] relative ">
                    <Skeleton variant="rectangular" className="w-full h-full rounded-[.83vw] " />
                  </div>
                  <div className="w-[15vw] mob:w-[40vw] relative rounded-[.83vw]">
                    <Skeleton variant="rectangular" className="w-full h-[1.1vw] mob:h-[3vw] " />
                    <Skeleton
                      variant="rectangular"
                      className="w-full h-[1.1vw] mob:h-[3vw] mob:mt-[4.1vw] mt-[1.1vw] "
                    />
                  </div>
                </div>
                <div className="w-[2vw] mob:w-[6vw] relative rounded-[.83vw]">
                  <Skeleton variant="rectangular" className="w-full h-[1.1vw] mob:h-[3vw] " />
                  <Skeleton variant="rectangular" className="w-full h-[1.1vw] mob:h-[3vw] mob:mt-[4.1vw] mt-[1.1vw] " />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsSkeleton;
