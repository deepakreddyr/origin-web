import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const ProductDetailsPageLoader = () => {
  return (
    <div className="pt-[12vw] mob:pt-[32vw] px-[10vw] pb-[8vw] ">
      <div className="flex mob:flex-col gap-[1.67vw] mob:gap-[5.1vw]">
        <div>
          <div className="w-[31vw] mob:w-full h-[24.2vw] mob:h-[70vw] flex flex-col gap-[1.67vw] mob:gap-[5.1vw] ">
            <Skeleton variant="rectangular" className="w-full h-full rounded-[.6vw] mob:rounded-t-[3vw]" />
          </div>
          <div className="w-[31vw] mob:w-full h-[8.2vw] mob:h-[12vw] flex flex-col gap-[1.67vw] mt-[1.67vw] mob:mt-0">
            <Skeleton variant="rectangular" className="w-full h-full rounded-[.6vw] mob:rounded-b-[3vw]" />
          </div>
        </div>
        <div className="w-[47.2vw] mob:w-full flex flex-col gap-[1.67vw] mob:gap-[5.1vw]">
          <Skeleton variant="rectangular" className="w-full h-[4vw] mob:h-[12vw] rounded-[.6vw] rounded-[2v]" />
          <Skeleton variant="rectangular" className="w-full h-[3vw] mob:h-[12vw] rounded-[.6vw]" />
          <Skeleton variant="rectangular" className="w-full h-[30vw] mob:h-[12vw] rounded-[.6vw]" />

          {/* <p className="font-[Stinger] font-semibold text-[1.67vw]">{productDetails.item.name}</p> */}
          {/* <ItemQuantityAndCta productDetails={productDetails} /> */}
          {/* <NutritionInfo productDetails={productDetails} /> */}
          {/* <AboutTheProduct productDetails={productDetails} /> */}
        </div>
      </div>
      {/* <ForgetItemWrapper productDetails={productDetails} /> */}
    </div>
  );
};

export default ProductDetailsPageLoader;
