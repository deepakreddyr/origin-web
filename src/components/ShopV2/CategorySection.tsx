import { Categories, ShopDataType, ShopDetails } from '../../../src//utilities/types';
import React, { useState } from 'react';
import CategoryCard from './CategoryCard';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import Image from 'next/image';
import Link from 'next/link';
import catimg from '/public/assets/images/shop/catimage.webp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const CategorySection = () => {
  const filteredCategories = useSelector((state: any) => state.shopCategories);
  const { categories } = filteredCategories;
  const mobile = useMediaQuery(600);

  const mainCategoryList = categories.find((item: any) => item.type === 'main-category')?.data || [];

  // Merge the real categories with test categories for testing
  const combinedCategoryList = [...mainCategoryList];

  // State for showing more categories
  const [showAll, setShowAll] = useState(false);

  // Helper function to generate safe href
  const generateHref = (category: any) => {
    const firstSubCategory = category?.sub_categories?.[0];
    return firstSubCategory
      ? `/shop/${category.name.replace(/ /g, '-').toLowerCase()}/${category.id}/${firstSubCategory.name.replace(/ /g, '-').toLowerCase()}/${firstSubCategory.id}`
      : `/shop/${category.name.replace(/ /g, '-').toLowerCase()}/${category.id}`;
  };

  const webUI = () => {
    const INITIAL_DISPLAY_COUNT = 8;
    const itemsToShow = showAll ? combinedCategoryList : combinedCategoryList.slice(0, INITIAL_DISPLAY_COUNT);
    const hasMore = combinedCategoryList.length > INITIAL_DISPLAY_COUNT;

    if (combinedCategoryList.length <= 5) {
      return (
        <div className="flex justify-center gap-[1.1vw]">
          {combinedCategoryList.map((category: any) => (
            <CategoryCard key={category.id} cardDetails={category} />
          ))}
        </div>
      );
    }

    return (
      <div>
        {/* Grid Layout */}
        <div className="grid grid-cols-4 gap-[1.1vw] mb-[1.5vw] justify-items-center">
          {itemsToShow.map((category: any) => (
            <CategoryCard key={category.id} cardDetails={category} />
          ))}
        </div>

        {/* Show More/Less Button with Icon */}
        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-[0.5vw] px-[2vw] py-[0.6vw] text-[1.1vw] font-[SofiaPro] font-semibold"
            >
              {showAll ? (
                <>
                  <span>Show Less</span>
                  <KeyboardArrowUpIcon sx={{ fontSize: '1.5vw' }} />
                </>
              ) : (
                <>
                  <span>View All Categories ({combinedCategoryList.length})</span>
                  <KeyboardArrowDownIcon sx={{ fontSize: '1.5vw' }} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  const mobUI = () => {
    const INITIAL_DISPLAY_COUNT = 10;
    const itemsToShow = showAll ? combinedCategoryList : combinedCategoryList.slice(0, INITIAL_DISPLAY_COUNT);
    const hasMore = combinedCategoryList.length > INITIAL_DISPLAY_COUNT;

    // First 2 larger cards
    const firstTwo = itemsToShow.slice(0, 2);
    // Remaining smaller cards
    const rest = itemsToShow.slice(2);

    return (
      <div>
        {/* First row: 2 larger cards */}
        <div className="grid grid-cols-3 gap-[4.1vw] mb-[4.1vw]">
          {firstTwo.map((category: any, index: number) => (
            <Link
              replace
              key={category.id}
              href={generateHref(category)}
              className={`${index === 0 ? 'col-span-2' : 'col-span-1'} flex flex-col items-center`}
            >
              <div className="relative w-full h-[29vw] rounded-[2vw] shadow-sm hover:shadow-md transition-shadow duration-200">
                <Image
                  src={category.website_image || category.image || catimg}
                  alt={category.name}
                  fill
                  className="object-cover rounded-[2vw]"
                />
              </div>
              <p className="font-[SofiaPro] text-[3.6vw] font-semibold text-center mt-[2vw]">{category.name}</p>
            </Link>
          ))}
        </div>

        {/* All remaining categories — small uniform grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-3 gap-[4.1vw]">
            {rest.map((category: any) => (
              <Link replace key={category.id} href={generateHref(category)} className="flex flex-col items-center">
                <div className="relative w-full h-[30vw] border border-[#E3E3E3] rounded-[2vw] shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Image
                    src={category.website_image || category.image || catimg}
                    alt={category.name}
                    fill
                    className="object-cover rounded-[2vw]"
                  />
                </div>
                <p className="font-[SofiaPro] text-[3.6vw] font-semibold text-center mt-[2vw]">{category.name}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Show More/Less Button */}
        {hasMore && (
          <div className="flex justify-center mt-[4vw]">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-[2vw] px-[6vw] py-[3vw] text-[4vw] font-[SofiaPro] font-semibold"
            >
              {showAll ? (
                <>
                  <span>Show Less</span>
                  <KeyboardArrowUpIcon sx={{ fontSize: '5vw' }} />
                </>
              ) : (
                <>
                  <span>View All ({combinedCategoryList.length})</span>
                  <KeyboardArrowDownIcon sx={{ fontSize: '5vw' }} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {combinedCategoryList.length > 0 && (
        <div className="px-[7vw]">
          <h1 className="font-[Recoleta] text-start font-semibold text-[2.08vw] mob:text-[5.1vw] pb-[2.1vw]">
            Shop by category
          </h1>
          {mobile ? mobUI() : webUI()}
        </div>
      )}
    </>
  );
};

export default CategorySection;
