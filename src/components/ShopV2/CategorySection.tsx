import { Categories, ShopDataType, ShopDetails } from '../../../src//utilities/types';
import React from 'react';
import CategoryCard from './CategoryCard';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import Image from 'next/image';
import Link from 'next/link';
import catimg from '/public/assets/images/shop/catimage.webp';

const CategorySection = () => {
  const filteredCategories = useSelector((state: any) => state.shopCategories);
  console.log(filteredCategories,"CAT SECTION")
  const { categories } = filteredCategories;
  const mobile = useMediaQuery(600);
  
  const mainCategoryList = categories.find((item: any) => item.type === 'main-category')?.data || [];

  const webUI = () => (
    <div className="flex justify-start mob:grid-cols-2 gap-[1.1vw] mob:gap-[4.1vw]">
      {mainCategoryList.map((category: any) => (
        <CategoryCard key={category.id} cardDetails={category} />
      ))}
    </div>
  );

  const mobUI = () => (
    <div>
      {/* First Row: 2 Items (left is wide) */}
      <div className="grid grid-cols-3 gap-[4.1vw]">
        {mainCategoryList.slice(0, 2).map((category: any, index: number) => (
          <Link
            replace
            key={category.id}
            href={`/shop/${category.name.replace(/ /g, '-').toLowerCase()}/${category.id}/${category.sub_categories[0].name.replace(/ /g, '-').toLowerCase()}/${category.sub_categories[0].id}`}
            className={`${index === 0 ? 'col-span-2' : 'col-span-1'} flex flex-col items-center`}
          >
            <div className="relative w-full h-[29vw] border border-[#E3E3E3] rounded-[2vw] shadow-sm hover:shadow-md transition-shadow duration-200">
              <Image
                src={category.image || catimg}
                alt={category.name}
                fill
                className="object-contain rounded-[2vw]"
              />
            </div>
            <p className="font-[SofiaPro] text-[3.6vw] font-semibold text-center mt-[2vw]">
              {category.name}
            </p>
          </Link>
        ))}
      </div>

      {/* Second Row: 3 Regular Items */}
      <div className="grid grid-cols-3 mt-[4.1vw] gap-[4.1vw]">
        {mainCategoryList.slice(2, 5).map((category: any) => (
          <Link
            replace
            key={category.id}
            href={`/shop/${category.name.replace(/ /g, '-').toLowerCase()}/${category.id}/${category.sub_categories[0].name.replace(/ /g, '-').toLowerCase()}/${category.sub_categories[0].id}`}
            className="flex flex-col items-center"
          >
            <div className="relative w-full h-[30vw] border border-[#E3E3E3] rounded-[2vw] shadow-sm hover:shadow-md transition-shadow duration-200">
              <Image
                src={category.image || catimg}
                alt={category.name}
                fill
                className="object-contain rounded-[2vw]"
              />
            </div>
            <p className="font-[SofiaPro] text-[3.6vw] font-semibold text-center mt-[2vw]">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );

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
