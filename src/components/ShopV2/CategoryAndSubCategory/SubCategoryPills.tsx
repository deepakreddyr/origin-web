import React from 'react';
import { useSelector } from 'react-redux';

const SubCategoryPills = (props: any) => {
  const { name, value, handler } = props;
  const shopCategories = useSelector((state: any) => state.shopCategories);

  if (!shopCategories?.subCategories?.length) return null;

  return (
    <div className="w-full mt-2 md:mt-[1vw]">
      {/* Scrollable wrapper only on mobile */}
      <div className="overflow-x-auto md:overflow-visible">
        <div className="flex md:flex-wrap gap-2 md:gap-[0.8vw] whitespace-nowrap">
          {shopCategories.subCategories.map((item: any) => {
            const isSelected = value === item.name;
            return (
              <button
                onClick={() => handler(item, name)}
                key={item.id}
                className={`px-3 py-2 text-sm font-medium md:px-[1vw] md:py-[.7vw] md:text-[.9vw] rounded-lg md:rounded-[0.6vw] text-center shadow-md transition-all duration-200
                  ${isSelected
                    ? 'bg-gradient-to-r from-[#FFDD00] to-[#FFFCDE] text-black'
                    : 'bg-[#FFFCDE] text-black'}
                `}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryPills;