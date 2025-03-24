import React from 'react';
import { useSelector } from 'react-redux';

const SubCategoryPills = (props: any) => {
  const { name, value, handler } = props;
  const shopCategories = useSelector((state: any) => state.shopCategories);
  if (!shopCategories.isSubCategoriesFetched && shopCategories?.subCategories?.length)
    return (
      <div className="flex gap-[1.67vw] mob:gap-[3vw] overflow-x-scroll noscrollbar  ">
        {shopCategories.subCategories.map((item: any) => (
          <button
            onClick={() => handler(item, name)}
            className={`border-[2px] px-[1vw]  mob:px-[3vw] mob:py-[2.5vw] py-[.83vw]   rounded-full ${value === item.name ? 'text-white bg-secondary  border-secondary' : 'border-[#F2EEE4]'} `}
            key={item.id}
          >
            <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] whitespace-nowrap font-medium ">{item.name}</p>
          </button>
        ))}
      </div>
    );
};

export default SubCategoryPills;
