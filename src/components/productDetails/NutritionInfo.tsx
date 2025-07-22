import React from 'react';

const NutritionInfo = (props: any) => {
  const { productDetails } = props;
  const { info } = productDetails;
  const nutritionInfo = info?.info?.find((item: any) => (item.type === 'nutrition' ? item : null));
  if (nutritionInfo?.details?.length === 0) return;
  return (
    <div className=" border rounded-[1.1vw] mob:rounded-[4.1vw] mob:p-[4.1vw] border-beige-200 p-[1.1vw]">
      <p className="font-[SofiaPro] text-[1.25vw] mob:text-[5.1vw] font-semibold text-black-op-80">
        {nutritionInfo?.title}
      </p>
      <div className="flex after: flex-wrap gap-[.83vw] mob:gap-[3vw] pt-[1.1vw] mob:pt-[4.1vw]">
        {nutritionInfo?.details?.map((item: any, index: number) => (
          <div
            key={index}
            className="bg-[#F2EEE44D] rounded-[.78vw] mob:rounded-[3vw] p-[1.1vw] mob:px-[4.1vw] px-[.97vw] mob:py-[3vw] py-[.83vw] "
          >
            <p className="font-[SofiaPro] font-semibold text-black-op-80 text-sembibold text-[.97vw] mob:text-[3.6vw] ">
              {item?.title}
            </p>
            <p className="font-[SofiaPro]  text-black-op-70 text-sembibold text-[.97vw] mob:text-[3vw] ">
              {item?.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionInfo;
