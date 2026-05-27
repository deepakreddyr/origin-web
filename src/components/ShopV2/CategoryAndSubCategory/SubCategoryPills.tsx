import React from 'react';
import { useSelector } from 'react-redux';

const SubCategoryPills = (props: any) => {
  const { name, value, valueId, handler } = props;
  const shopCategories = useSelector((state: any) => state.shopCategories);

  if (!shopCategories?.subCategories?.length) return null;

  return (
    <div className="w-full mt-2 md:mt-[1vw]">
      {/* Scrollable wrapper only on mobile */}
      <div className="overflow-x-auto md:overflow-visible noscrollbar">
        <div className="flex md:flex-wrap gap-2 md:gap-[0.8vw] whitespace-nowrap">
          {shopCategories.subCategories.map((item: any) => {
            const isSelected =
              (value &&
                item.name &&
                value.toLowerCase().replace(/-/g, ' ') === item.name.toLowerCase().replace(/-/g, ' ')) ||
              String(valueId) === String(item.id);
            return (
              <button
                onClick={() => handler(item, name)}
                key={item.id}
                className={`px-[4vw] py-[2vw] text-[3.6vw] md:px-[1.5vw] md:py-[0.6vw] md:text-[1vw] rounded-full font-semibold text-center border-[1.13px] transition-all duration-200
                  ${
                    isSelected
                      ? 'bg-[#2D8A4E] text-white border-[#2D8A4E]'
                      : 'bg-white text-[#231F20] border-[#C2BDAE33] hover:bg-gray-50'
                  }
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
