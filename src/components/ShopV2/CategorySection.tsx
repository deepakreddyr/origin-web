import { Categories, ShopDataType, ShopDetails } from '../../../src//utilities/types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import Link from 'next/link';

const CategorySection = () => {
  const filteredCategories = useSelector((state: any) => state.shopCategories);
  const { categories } = filteredCategories;

  const mobile = useMediaQuery(600); 
  
  const mainCategoryList = categories.find((item: any) => item.type === 'main-category')?.data || [];
  const [showAll, setShowAll] = useState(false);
  
  const generateHref = (category: any) => {
    const firstSubCategory = category?.sub_categories?.[0];
    const categorySlug = category.name.replace(/ /g, '-').toLowerCase();
    
    return firstSubCategory
      ? `/shop/${categorySlug}/${category.id}/${firstSubCategory.name.replace(/ /g, '-').toLowerCase()}/${firstSubCategory.id}`
      : `/shop/${categorySlug}/${category.id}`;
  };

  const CategoryPill = ({ category }: { category: any }) => (
    <Link
      replace
      href={generateHref(category)}
      className="inline-block">
      <div className="bg-[#FFFCDE] text-black rounded-[10px] px-5 py-2 whitespace-nowrap transition-colors duration-200">
        <span className="font-[SofiaPro] font-medium text-[1.1vw] mob:text-[3.8vw]">
          {category.name}
        </span>
      </div>
    </Link>
  );

  const webUI = () => {
    const itemsToShow = showAll ? mainCategoryList : mainCategoryList.slice(0, 8);
    const hasMore = mainCategoryList.length > 8;
    
    return (
      <div>
        <div className="flex flex-wrap justify-start gap-[0.8vw] mb-[2vw]">
          {itemsToShow.map((category: any) => (
            <CategoryPill key={category.id} category={category} />
          ))}
        </div>
        
        {hasMore && (
          <div className="flex justify-center items-center">
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
    return (
      <div style={{ 
        overflowX: 'scroll',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        marginLeft: '-7vw',
        marginRight: '-7vw'
      }}>
        <div style={{ 
          display: 'flex',
          gap: '2.5vw',
          paddingLeft: '7vw',
          paddingRight: '7vw',
          paddingBottom: '2vw',
          width: 'fit-content',
          minWidth: '100%'
        }}>
          {mainCategoryList.map((category: any) => (
            <div key={category.id} style={{ flexShrink: 0 }}>
              <CategoryPill category={category} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {mainCategoryList.length > 0 && (
        <div className="px-[7vw]">
          <p className="font-slab text-start font-bold text-white text-[2.08vw] mob:text-[5.1vw] pb-[2.1vw] mob:pb-[4vw]">
            Shop By Category
          </p>
          {mobile ? mobUI() : webUI()}
        </div>
      )}
    </>
  );
};

export default CategorySection;