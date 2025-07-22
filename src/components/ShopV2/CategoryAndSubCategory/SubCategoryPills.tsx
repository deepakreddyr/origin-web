import React from 'react';
import { useSelector } from 'react-redux';

const SubCategoryPills = (props: any) => {
  const { name, value, handler } = props;
  const shopCategories = useSelector((state: any) => state.shopCategories);

  if (!shopCategories?.subCategories?.length) return null;

  return (
    <div className="w-full mt-2 md:mt-[1vw]">
      <div className="flex flex-wrap gap-2 md:gap-[0.8vw]">
        {shopCategories.subCategories.map((item: any) => {
          const isSelected = value === item.name;
          return (
            <button
              onClick={() => handler(item, name)}
              key={item.id}
              className={`px-3 py-2 text-sm md:px-[1vw] md:py-[.7vw] md:text-[.9vw] rounded-lg md:rounded-[0.6vw] font-medium text-center shadow-md border transition-all duration-200
                ${isSelected
                  ? 'bg-[#2F8145] text-white border-[#2F8145]'
                  : 'bg-white text-black border-gray-300 hover:bg-gray-100 active:bg-gray-200'}
              `}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubCategoryPills;