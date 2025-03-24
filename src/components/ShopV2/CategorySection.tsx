import { Categories, ShopDataType, ShopDetails } from '../../../src//utilities/types';
import React, { useState } from 'react';
import CategoryCard from './CategoryCard';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import Image from 'next/image';
import Link from 'next/link';

const CategorySection = () => {
  const filteredCategories = useSelector((state: any) => state.shopCategories);
  const { categories } = filteredCategories;
  const mobile = useMediaQuery(600);

  const mainCategoryList = categories.find((item: any) => item.type === 'main-category')?.data || [];

  const webUI = () => {
    return (
      <div className="flex items-center justify-start mob:grid-cols-2 gap-[1.1vw] mob:gap-[4.1vw]">
        {mainCategoryList.length > 0 &&
          mainCategoryList.map((category: any, index: number) => (
            <CategoryCard key={category.id} cardDetails={category} />
          ))}
      </div>
    );
  };

  const mobUI = () => {
    return (
      <div>
        <div className="grid grid-cols-3 gap-[4.1vw] ">
          {/* Render first row (2 items) */}
          {mainCategoryList.slice(0, 2).map((category: any, index: number) => (
            <Link
              replace
              href={`/shop/${category.name.replace(/ /g, '-').toLowerCase()}/${category?.id}/${category?.sub_categories[0].name
                .replace(/ /g, '-')
                .toLowerCase()}/${category?.sub_categories[0].id}`}
              className={`${index === 0 ? 'col-span-2' : 'col-span-1'}`}
            >
              <div key={index} className={`relative w-full   h-[25vw]`}>
                <Image src={category.image} alt="" fill />
              </div>
              <p className="font-[SofiaPro] text-[3vw] font-semibold text-center pt-[2vw]">{category.name}</p>
            </Link>
          ))}

          {/* Render second row (3 items) */}
        </div>
        <div className="grid grid-cols-3 mt-[4.1vw] gap-[4.1vw]">
          {mainCategoryList.slice(2, 5).map((category: any, index: number) => (
            <Link
              replace
              href={`/shop/${category.name}/${category?.id}/${
                category?.sub_categories[0].name
              }/${category?.sub_categories[0].id}`}
            >
              <div key={index} className="relative w-full h-[25vw]">
                <Image src={category.image} alt="" fill />
              </div>
              <p className="font-[SofiaPro] text-[3vw] font-semibold text-center pt-[2vw]">{category.name}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <p className="font-[Stinger]  text-start font-bold text-[2.08vw] mob:text-[5.1vw] pb-[2.1vw]">Shop by category</p>
      {mobile ? mobUI() : webUI()}
    </div>
  );
};

export default CategorySection;
