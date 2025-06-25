import React from 'react';
import { useSelector } from 'react-redux';

const SubCategoryPills = (props: any) => {
  const { name, value, handler } = props;
  const shopCategories = useSelector((state: any) => state.shopCategories);

  if (!shopCategories.isSubCategoriesFetched && shopCategories?.subCategories?.length)
    return (
      <div className="w-full mt-[1vw]">
        {/* Mobile: horizontal scroll */}
        <div className="hidden mob:flex w-full overflow-x-auto noscrollbar">
          <div className="flex w-full gap-[2vw] justify-between">
            {shopCategories.subCategories.map((item: any) => {
              const isSelected = value === item.name;
              return (
                <button
                  onClick={() => handler(item, name)}
                  key={item.id}
                  className={`flex-shrink-0 min-w-[20vw] text-[3.5vw] px-[4vw] py-[2.5vw] rounded-full font-semibold transition-all duration-150 shadow-md
                    ${isSelected
                      ? 'bg-[#2F8145] text-white border border-[#2F8145]'
                      : 'bg-white text-black border '}
                  `}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop: evenly spaced full-width pills */}
        <div className="mob:hidden flex justify-between w-full mt-[1vw]">
          {shopCategories.subCategories.map((item: any) => {
            const isSelected = value === item.name;
            return (
              <button
                onClick={() => handler(item, name)}
                key={item.id}
                className={`w-[12vw] text-[.9vw] py-[.7vw] px-[1vw] rounded-[0.6vw] font-medium text-center shadow-md
                  ${isSelected
                    ? 'bg-[#2F8145] text-white border border-[#2F8145]'
                    : 'bg-white text-black border  hover:bg-gray-100'}
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
