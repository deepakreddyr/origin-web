import React, { useState } from 'react';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import Image from 'next/image';
import Link from 'next/link';
import catimg from '/public/assets/images/landingCatSampleImg.webp';
import blends from '/public/assets/images/blendsCatimg.webp';
import { BlendsBanner } from './BlendsBanner';
interface HomeCategorySectionProps {
  categories: any[];
  blendsCategory?: any[];
  loading?: boolean;
  title?: string;
}

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-black group-hover:translate-x-0.5 transition-transform mob:w-3.5 mob:h-3.5"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const chunkArray = (arr: any[], size: number) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

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

    if (catId === 15 || catName.includes('blends')) {
      return `/shop/blends/15/cold-press/53`;
    }

    return `/shop/${catName}/${catId}/${catName}/${catId}`;
  };

  const blendsFromMain = categories.find((cat: any) => cat.name.toLowerCase() === 'blends');
  const otherCategories = categories.filter((cat: any) => cat.name.toLowerCase() !== 'blends');

  const initialCount = mobile ? 5 : 8;
  const displayedCategories = isExpanded ? otherCategories : otherCategories.slice(0, initialCount);
  const hasMore = otherCategories.length > initialCount;

  const finalBlendsCategory = blendsCategory && blendsCategory.length > 0 ? blendsCategory[0] : blendsFromMain;

  // Build the unified list of categories to display
  const allCategories = displayedCategories;

  return (
    <div className="pt-[4vw] mob:pt-[8vw] relative">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[3vw]">
        {title && (
          <div className="w-full mb-[2.1vw] mob:mb-[2vw]">
            <h1 className="font-[Recoleta] text-start font-bold text-[3vw] mob:text-[22px] text-[#231F20]">{title}</h1>
          </div>
        )}

        <div className={`relative w-full ${!isExpanded && hasMore ? 'pb-[4vw]' : ''}`}>
          <div
            className={`
              transition-all duration-500 ease-in-out overflow-hidden -mx-[4vw] px-[0vw] md:-mx-[100px] md:px-[100px]
              ${!isExpanded && hasMore ? (mobile ? 'max-h-[180vw]' : 'max-h-[460px]') : 'max-h-[5000px]'}
            `}
          >
            {mobile ? (
              <div className="pt-[4vw] mob:pt-[4vw]">
                {/* 2-column grid for pairs — fixed gap so spacing is consistent across screen sizes */}
                <div className="grid grid-cols-2 gap-x-[12px] gap-y-[20px]">
                  {(allCategories.length % 2 === 0 ? allCategories : allCategories.slice(0, -1)).map(
                    (category: any) => (
                      <CategoryCard key={category.id} category={category} generateHref={generateHref} mobile={mobile} />
                    )
                  )}
                </div>
                {/* Centered last item if odd count */}
                {allCategories.length % 2 !== 0 && (
                  <div className="flex justify-center mt-[20px]">
                    <CategoryCard
                      category={allCategories[allCategories.length - 1]}
                      generateHref={generateHref}
                      mobile={mobile}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-y-[63px] pt-[2vw]">
                {chunkArray(allCategories, 3).map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`flex ${row.length === 3 ? 'justify-between' : 'justify-center'}`}
                    style={row.length < 3 ? { columnGap: 'calc((100% - 1133.16px) / 2)' } : {}}
                  >
                    {row.map((category) => (
                      <CategoryCard key={category.id} category={category} generateHref={generateHref} mobile={mobile} />
                    ))}
                  </div>
                ))}
              </div>
            )}
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
                className="mb-[2vw] bg-[#fac510] text-black font-[SofiaPro] font-bold py-[1vw] px-[3vw] mob:py-[3vw] mob:px-[8vw] rounded-full text-[1.1vw] mob:text-[3.5vw] transition-colors pointer-events-auto shadow-sm hover:bg-[#f2d200]"
              >
                Show more ({otherCategories.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {finalBlendsCategory && (
        <div className="w-[100vw] relative left-1/2 -translate-x-1/2 mt-[32px] md:mt-[60px]">
          <BlendsBanner href={generateHref(finalBlendsCategory)} />
        </div>
      )}
    </div>
  );
};

const CategoryCard = ({
  category,
  generateHref,
  mobile
}: {
  category: any;
  generateHref: (cat: any) => string;
  mobile: boolean;
}) => {
  const imageSrc = category.website_image || category.image || null;

  return (
    <Link
      href={generateHref(category)}
      className="group relative flex-shrink-0 flex-grow-0 w-full md:w-[377.72px] h-[20vw] md:h-[165.36px] overflow-visible mt-[0px] md:mt-[25px]"
      style={mobile ? { height: '92.58px', maxWidth: '175px' } : {}}
    >
      {/* Main Rectangular Card — positioned to the right to leave space for the image */}
      <div
        className={`absolute top-0 right-0 w-[calc(100%-4vw)] md:w-[299.77px] h-full rounded-[14px] md:rounded-[22.44px] ${!category.bg_color ? 'bg-[#FAF2DCB2]' : ''} overflow-visible transition-all duration-300`}
        style={{
          backdropFilter: 'blur(21.036842346191406px)',
          WebkitBackdropFilter: 'blur(21.036842346191406px)',
          backgroundColor: category.bg_color ? `${category.bg_color}B2` : undefined,
          ...(mobile
            ? {
                // Box fills the card minus the 31.32px image overhang on the left
                width: 'calc(100% - 31.32px)',
                height: '75.29px',
                top: '17.29px',
                borderRadius: '10.22px'
              }
            : {})
        }}
      >
        {/* Badge — overlapping divs with transparent cutout to prevent background bleed */}
        {category.tag?.title && (
          <div className="absolute top-0 right-0 z-20 flex items-start pointer-events-none">
            {/* Left half: curve generator using transparent div with box-shadow to paint the red concave corner */}
            <div className="w-[6px] md:w-[10px] h-[6px] md:h-[10px] relative overflow-hidden">
              <div
                className="absolute bottom-0 left-0 w-full h-full rounded-tr-[6px] md:rounded-tr-[10px]"
                style={{ boxShadow: '10px -10px 0 10px #B60202' }}
              ></div>
            </div>

            {/* Top right corner: red div with border radius on bottom left */}
            <div className="bg-[#B60202] h-[28px] md:h-[35px] rounded-bl-[6px] md:rounded-bl-[10px] rounded-tr-[14px] md:rounded-tr-[22.44px] flex items-center justify-center px-[12px] md:px-[15px] pointer-events-auto">
              <span className="text-white text-[2.5vw] md:text-[12px] font-[SofiaPro] font-semibold leading-[8.96px] tracking-[0%] text-center align-middle whitespace-nowrap">
                {category.tag.title}
              </span>
            </div>
          </div>
        )}

        {/* Text Title — centered in the right-side space, vertically centered */}
        <div
          className="absolute top-0 right-0 h-full flex items-center justify-center"
          style={{
            ...(mobile
              ? {
                  // Text container occupies the right ~72% of the box (excluding image overlap zone)
                  width: 'calc((100% - 31.32px) * 0.72)',
                  height: '75.29px',
                  top: 0
                }
              : { width: '56%' })
          }}
        >
          <h2
            className="font-[Recoleta] font-bold text-[13px] md:text-[22px] text-[#231F20] leading-tight select-none whitespace-nowrap text-center pr-[10px] md:pr-[20px]"
            style={
              mobile
                ? {
                    fontSize: 'clamp(11px, 3.2vw, 13px)',
                    lineHeight: '1.2',
                    fontWeight: 600,
                    paddingRight: 0,
                    whiteSpace: 'normal'
                  }
                : {}
            }
          >
            {category.name}
          </h2>
        </div>

        {/* Arrow Button */}
        <div
          className="absolute bottom-[10px] right-[10px] md:bottom-[22px] md:right-[22px] w-6 h-6 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center transition-all duration-300"
          style={{
            boxShadow: '-10px 12px 13.46px 0px rgba(0, 0, 0, 0.14)',
            ...(mobile
              ? {
                  width: '17px',
                  height: '17px',
                  // Position from bottom-right of box so it stays in place as box scales
                  bottom: '5px',
                  right: '5px',
                  top: 'auto',
                  left: 'auto',
                  borderRadius: '10px'
                }
              : {})
          }}
        >
          <div className="flex items-center justify-center" style={mobile ? { transform: 'scale(0.5)' } : {}}>
            <ArrowIcon />
          </div>
        </div>
      </div>

      {/* Left Circular overlapping Image — aligned to bottom, starting from the left edge of wrapper */}
      <div
        className="absolute z-10 transition-transform duration-500 select-none pointer-events-none"
        style={
          mobile
            ? {
                width: '90.68px',
                height: '85.96px',
                top: '7px',
                left: '0px', // Image always at left edge of card
                transformOrigin: 'left top'
              }
            : {
                width: '185.82px',
                height: '216.79px',
                bottom: '0px',
                left: '0px',
                transformOrigin: 'left bottom',
                scale: '1.03'
              }
        }
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={category.name || 'Category'}
            className="w-full h-full object-contain object-bottom"
          />
        ) : (
          <div className="relative w-full h-full">
            <Image src={catimg} alt={category.name || 'Category'} fill className="object-contain object-bottom" />
          </div>
        )}
      </div>
    </Link>
  );
};

const SkeletonLoader = ({ mobile }: { mobile: boolean }) => {
  const skeletonItems = Array.from({ length: 8 });
  return (
    <div className="py-[4vw] mob:py-[8vw]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[3vw]">
        <div className="w-full mb-[2.1vw]">
          <div className="h-[3vw] mob:h-[8vw] bg-gray-100 animate-pulse rounded w-1/3"></div>
        </div>
        {mobile ? (
          <div className="flex flex-wrap justify-center gap-x-[4vw] gap-y-[12vw] pt-[4vw]">
            {skeletonItems.map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 animate-pulse rounded-[14px] w-[41.8vw] h-[22vw] mt-[3vw] mob:mt-[8vw]"
              ></div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-y-[63px] pt-[2vw]">
            {chunkArray(skeletonItems, 3).map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-x-[63px]">
                {row.map((_, i) => (
                  <div key={i} className="bg-gray-100 animate-pulse rounded-[22.44px] w-[299.77px] h-[165.36px]"></div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeCategorySection;
