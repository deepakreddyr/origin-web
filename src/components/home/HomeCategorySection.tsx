import React, { useState } from 'react';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import Image from 'next/image';
import Link from 'next/link';
import catimg from '/public/assets/images/landingCatSampleImg.webp';
import blends from '/public/assets/images/blendsCatimg.webp';
interface HomeCategorySectionProps {
  categories: any[];
  blendsCategory?: any[];
  loading?: boolean;
  title?: string;
}

const HomeCategorySection = ({ categories, blendsCategory, loading, title }: HomeCategorySectionProps) => {
  const mobile = useMediaQuery(600);
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading && (!categories || categories.length === 0)) {
    return <SkeletonLoader mobile={mobile} />;
  }

  if (!categories || categories.length === 0) return null;

  const generateHref = (category: any) => {
    const catName = (category.name || category.title || '').replace(/ /g, '-').toLowerCase();
    const catId = category.id;
    const firstSubCategory = category?.sub_categories?.[0];

    if (firstSubCategory) {
      const subName = (firstSubCategory.name || firstSubCategory.title || '').replace(/ /g, '-').toLowerCase();
      const subId = firstSubCategory.id;
      return `/shop/${catName}/${catId}/${subName}/${subId}`;
    }

    return `/shop/${catName}/${catId}/${catName}/${catId}`;
  };

  const initialCount = mobile ? 4 : 8;
  const displayedCategories = isExpanded ? categories : categories.slice(0, initialCount);
  const hasMore = categories.length > initialCount;

  return (
    <div className="py-[4vw] mob:py-[8vw] relative">
      <div className="w-[92vw] md:w-[80vw] mx-auto">
        {title && (
          <div className="w-full mb-[2.1vw] mob:pb-[5vw]">
            <h1 className="font-Stinger text-start font-semibold text-[2.5vw] mob:text-[7vw] text-[#231F20] ">
              {title}
            </h1>
          </div>
        )}

        <div className={`relative w-full ${!isExpanded && hasMore ? 'pb-[4vw]' : ''}`}>
          <div
            className={`
                    grid grid-cols-2 tabp:grid-cols-4 gap-[4vw] mob:gap-x-[4vw] mob:gap-y-[12vw] pt-[3vw] mob:pt-[8vw]
                    transition-all duration-500 ease-in-out
                    ${!isExpanded && hasMore ? 'max-h-[125vw] tabp:max-h-[45vw] overflow-hidden' : 'max-h-[5000px]'}
                `}
          >
            {blendsCategory && blendsCategory.length > 0 && <BlendsCategoryCard category={blendsCategory[0]} />}
            {displayedCategories.map((category: any) => (
              <CategoryCard key={category.id} category={category} generateHref={generateHref} />
            ))}
          </div>

          {!isExpanded && hasMore && (
            <div
              className="absolute bottom-0 left-0 right-0 h-[20vw] md:h-[15vw] flex items-end justify-center rounded-b-[20px] pointer-events-none"
              style={{
                width: '100%',
                background: 'linear-gradient(180deg, rgba(248, 244, 233, 0) 0%, rgba(237, 230, 212, 0.8) 100%)'
              }}
            >
              <button
                onClick={() => setIsExpanded(true)}
                className="mb-[2vw] mob:mb-[4vw] bg-[#FFDD00] text-black font-[SofiaPro] font-bold py-[1vw] px-[3vw] mob:py-[3vw] mob:px-[8vw] rounded-full text-[1.1vw] mob:text-[3.5vw] transition-colors pointer-events-auto shadow-sm hover:bg-[#f2d200]"
              >
                Show more ({categories.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BlendsCategoryCard = ({ category }: { category: any }) => {
  return (
    <Link
      href={`/shop/${category.name.replace(/ /g, '-').toLowerCase()}/${category.id}`}
      className="lg:col-span-2 col-span-2 relative rounded-[20px] mob:rounded-[15px] overflow-hidden group min-h-[17vw] mob:min-h-[44vw] flex flex-col items-center justify-end"
      style={{
        background: 'linear-gradient(180deg, #CBB270 0%, #F7E1BA 100%)'
      }}
    >
      {/* Image Container - Now spans the full background */}
      <div className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105">
        <Image src={blends} alt={category.name} fill className="object-cover object-center" />

        {/* Subtle Gradient Overlay to ensure text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Category Name - Styled to sit over the background */}
      <div className="relative w-full p-[1.5vw] mob:p-[4vw] z-10">
        <h2 className="font-[Recoleta] font-semibold text-[1.25vw] mob:text-[4vw] text-black mob:text-white text-center px-2 drop-shadow-md">
          {category.name}
        </h2>
      </div>
    </Link>
  );
};

const CategoryCard = ({ category, generateHref }: { category: any; generateHref: (cat: any) => string }) => {
  return (
    <Link
      href={generateHref(category)}
      /* Changed aspect-square to aspect-[4/3] for a shorter card */
      className="group relative rounded-[20px] mob:rounded-[15px] aspect-[1/1] flex flex-col items-center justify-end p-[1.5vw] mob:p-[4vw] overflow-visible"
      style={{
        background: 'linear-gradient(180deg, #CBB270 0%, #F7E1BA 100%)'
      }}
    >
      {/* Image Container */}
      <div className="absolute top-[-3vw] mob:top-[-7vw] inset-0 w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 p-[10%]">
        <div className="relative w-[18vw] h-[18vw] mob:w-[35vw] mob:h-[35vw]">
          <Image src={catimg} alt={category.name} fill className="object-contain object-center" />
        </div>
      </div>

      {/* Category Name */}
      <div className="relative w-full mb-[0.5vw] mob:mb-[1vw]">
        <p className="font-[Recoleta] font-semibold text-[1.25vw] mob:text-[4vw] text-[#231F20] text-center px-2">
          {category.name}
        </p>
      </div>
    </Link>
  );
};

const SkeletonLoader = ({ mobile }: { mobile: boolean }) => {
  return (
    <div className="py-[4vw] mob:py-[8vw]">
      <div className="w-[92vw] md:w-[80vw] mx-auto">
        <div className="w-full mb-[2.1vw] mob:pb-[5vw]">
          <div className="h-[3vw] mob:h-[8vw] bg-gray-100 animate-pulse rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-2 tabp:grid-cols-4 gap-[4vw] mob:gap-x-[4vw] mob:gap-y-[12vw] pt-[3vw] mob:pt-[8vw]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-[30px] aspect-square"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeCategorySection;
