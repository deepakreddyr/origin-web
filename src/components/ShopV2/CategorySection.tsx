import { Categories, ShopDataType, ShopDetails } from '../../../src//utilities/types';
import React, { useState } from 'react';
import CategoryCard from './CategoryCard';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import Image from 'next/image';
import Link from 'next/link';
import catimg from '/public/assets/images/shop/catimage.webp';

const CategorySection = () => {
  const filteredCategories = useSelector((state: any) => state.shopCategories);
  const { categories } = filteredCategories;
  const mobile = useMediaQuery(600);
  
  const mainCategoryList = categories.find((item: any) => item.type === 'main-category')?.data || [];
  
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
    const itemsToShow = showAll ? mainCategoryList : mainCategoryList.slice(0, 8);
    const hasMore = mainCategoryList.length > 8;
    if (mainCategoryList.length <= 5) {
      // Original layout for 5 or fewer categories
      return (
        <div className="flex justify-center gap-[1.1vw]">
          {mainCategoryList.map((category: any) => (
            <CategoryCard key={category.id} cardDetails={category} />
          ))}
        </div>
      );
    }
    return (
      <div>
        {/* Grid Layout */}
        <div className="grid grid-cols-4 gap-[1.1vw] mb-[2vw]">
          {itemsToShow.map((category: any) => (
            <CategoryCard key={category.id} cardDetails={category} />
          ))}
        </div>
        
        {/* Show More/Less Button */}
        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-[2vw] py-[0.5vw] border-2 border-gray-300 rounded-[0.5vw] text-[1.1vw] font-[SofiaPro] font-semibold hover:border-gray-500 transition-colors duration-200"
            >
              {showAll ? 'Show Less' : `View All Categories (${mainCategoryList.length})`}
            </button>
          </div>
        )}
      </div>
    );
  };

  const mobUI = () => {
    const renderCategoryBlock = (categories: any[], startIndex: number) => (
      <div className="mb-[4.1vw]">
        {/* First Row: 2 Items (left is wide) */}
        <div className="grid grid-cols-3 gap-[4.1vw]">
          {categories.slice(startIndex, startIndex + 2).map((category: any, index: number) => (
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
              <p className="font-[SofiaPro] text-[3.6vw] font-semibold text-center mt-[2vw]">
                {category.name}
              </p>
            </Link>
          ))}
        </div>

        {/* Second Row: 3 Regular Items (if available) */}
        {categories.slice(startIndex + 2, startIndex + 5).length > 0 && (
          <div className="grid grid-cols-3 mt-[4.1vw] gap-[4.1vw]">
            {categories.slice(startIndex + 2, startIndex + 5).map((category: any) => (
              <Link
                replace
                key={category.id}
                href={generateHref(category)}
                className="flex flex-col items-center"
              >
                <div className="relative w-full h-[30vw] border border-[#E3E3E3] rounded-[2vw] shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Image
                    src={category.website_image || category.image || catimg}
                    alt={category.name}
                    fill
                    className="object-cover rounded-[2vw]"
                  />
                </div>
                <p className="font-[SofiaPro] text-[3.6vw] font-semibold text-center mt-[2vw]">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    );

    const itemsToShow = showAll ? mainCategoryList : mainCategoryList.slice(0, 10);
    const hasMore = mainCategoryList.length > 10;

    // Render blocks of 5 categories each
    const blocks = [];
    for (let i = 0; i < itemsToShow.length; i += 5) {
      blocks.push(renderCategoryBlock(itemsToShow, i));
    }

    return (
      <div>
        {blocks}
        {/* Show More/Less Button for Mobile */}
        {hasMore && (
          <div className="flex justify-center mt-[4vw]">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-[6vw] py-[3vw] border-2 border-gray-300 rounded-[2vw] text-[4vw] font-[SofiaPro] font-semibold hover:border-gray-500 transition-colors duration-200"
            >
              {showAll ? 'Show Less' : `View All (${mainCategoryList.length})`}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {mainCategoryList.length > 0 && (
        <div className="px-[7vw]">
          <p className="font-[SofiaPro] text-start font-bold text-[2.08vw] mob:text-[5.1vw] pb-[2.1vw]">
            Shop by category
          </p>
          {mobile ? mobUI() : webUI()}
        </div>
      )}
    </>
  );
};

export default CategorySection;