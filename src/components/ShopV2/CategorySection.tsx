import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import Image from 'next/image';
import Link from 'next/link';
import catimg from '/public/assets/images/shop/catimage.webp';

const CategorySection = () => {
  const filteredCategories = useSelector((state: any) => state.shopCategories);
  const { categories } = filteredCategories;
  const mobile = useMediaQuery(768);

  const mainCategoryList =
  Array.isArray(categories)
    ? categories.find((item: any) => item.type === 'main-category')?.data || []
    : [];

  const combinedCategoryList = [...mainCategoryList];
  const [showAll, setShowAll] = useState(false);

  const generateHref = (category: any) => {
    const firstSubCategory = category?.sub_categories?.[0];
    return firstSubCategory
      ? `/shop/${category.name.replace(/ /g, '-').toLowerCase()}/${category.id}/${firstSubCategory.name
          .replace(/ /g, '-')
          .toLowerCase()}/${firstSubCategory.id}`
      : `/shop/${category.name.replace(/ /g, '-').toLowerCase()}/${category.id}`;
  };

  // Helper to chunk array into groups of 5
  const chunkArray = (arr: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const categoryChunks = chunkArray(combinedCategoryList, 5);

  // Shared grid pattern
  const renderGrid = (categoryGroup: any[], groupIndex: number) => {
    const smallCardHeight = mobile ? '35vw' : '14vw';
    const largeCardHeight = mobile ? '70vw' : '30vw';
    const titleFont = mobile ? '4vw' : '1.2vw';
    const headingFont = mobile ? '5vw' : '1.8vw';
    const padding = mobile ? '5vw' : '2vw';

    return (
      <div
        key={groupIndex}
        className={`flex flex-col items-center w-full justify-center bg-[#FFFCDE] py-[${padding}] px-[4vw] rounded-[0.5rem] mb-[3vw]`}
      >
        {/* Heading only on first grid */}
        {groupIndex === 0 && (
          <h2
            className={`text-center text-[${headingFont}] font-bold font-[SofiaPro] mb-[2vw] text-[2.5vw] text-black`}
          >
            Explore Our Collection
          </h2>
        )}

        <div
          className="
            grid grid-cols-3 grid-rows-2 gap-[1.5vw]
            w-full justify-items-center
          "
          style={{
            gridTemplateAreas: `
              "small1 large small2"
              "small3 large small4"
            `,
          }}
        >
          {categoryGroup.map((category: any, index: number) => {
            const gridAreaNames = ['small1', 'large', 'small2', 'small3', 'small4'];
            const area = gridAreaNames[index] || 'small';
            const isLargeCard = area === 'large';

            return (
              <Link
                replace
                key={category.id}
                href={generateHref(category)}
                className="relative rounded-[1rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                style={{
                  gridArea: area,
                  width: '100%',
                  height: isLargeCard ? largeCardHeight : smallCardHeight,
                }}
              >
                <Image
                  src={category.website_image || catimg}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-end justify-start p-[1.2vw] bg-gradient-to-t from-black/40 via-transparent to-transparent">
                  <p
                    className={`text-white font-semibold font-[SofiaPro]`}
                    style={{
                      fontSize: titleFont,
                    }}
                  >
                    {category.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {combinedCategoryList.length > 0 && (
        <section className="w-full flex flex-col items-center justify-center my-[3vw]">
          {categoryChunks.map((group, index) => renderGrid(group, index))}
        </section>
      )}
    </>
  );
};

export default CategorySection;
