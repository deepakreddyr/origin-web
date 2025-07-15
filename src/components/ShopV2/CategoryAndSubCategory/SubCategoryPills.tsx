import React from 'react';
import { useSelector } from 'react-redux';

const SubCategoryPills = (props: any) => {
  const { name, value, handler } = props;
  const shopCategories = useSelector((state: any) => state.shopCategories);

  if (!shopCategories?.subCategories?.length) return null;

  return (
    <div className="w-full mt-[1vw]">
      <div className="flex flex-wrap gap-[0.8vw]">
        {shopCategories.subCategories.map((item: any) => {
          const isSelected = value === item.name;
          return (
            <button
              onClick={() => handler(item, name)}
              key={item.id}
              className={`px-[1vw] py-[.7vw] text-[.9vw] rounded-[0.6vw] font-medium text-center shadow-md border
                ${isSelected
                  ? 'bg-[#2F8145] text-white border-[#2F8145]'
                  : 'bg-white text-black border-gray-300 hover:bg-gray-100'}
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
