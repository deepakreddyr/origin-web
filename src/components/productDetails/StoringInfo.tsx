import Image from 'next/image';
import React from 'react';

const StoringInfo = (props: any) => {
  const { productDetails } = props;
  const { info } = productDetails;
  const storingInfo = info?.info?.find((item: any) => (item.type === 'storage' ? item : null));
  return (
    <div className=" border mob:bg-[#F2EEE44D] rounded-[1.1vw] mob:rounded-[4.1vw] mob:p-[4.1vw] border-beige-200 p-[1.1vw]">
      <p className="font-[Stinger] text-[1.25vw] mob:text-[5.1vw] font-semibold text-black-op-70">
        {storingInfo?.title}
      </p>
      <div className="grid gap-[1.1vw] mob:gap-[4.1vw] grid-cols-2 pt-[1.1vw] mob:pt-[4.1vw]">
        {storingInfo?.details.map((data: any, index: any) => (
          <div
            className="flex items-center gap-[.7vw] border mob:bg-[#F2EEE4] border-beige-200 rounded-[.83vw] mob:rounded-[3vw] bg-[#F2EEE44D] mob:p-[3vw] p-[.83vw] "
            key={index}
          >
            <div className="w-[1.67vw] mob:w-[5vw] mob:h-[5vw] h-[1.67vw] relative mob:mr-[1.1vw] ">
              <Image src={data.image} fill alt="" />
            </div>
            <div>
              <p className="font-[SofiaPro]  text-[.97vw] mob:text-[3.8vw] font-bold ">{data?.title}</p>
              <p className="font-[SofiaPro]a text-[.97vw] mob:pt-[1.5vw]  mob:text-[3vw] font-regular text-black-op-80 ">
                {data?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoringInfo;
