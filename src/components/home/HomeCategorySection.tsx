import React, { useState } from 'react';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import Image from 'next/image';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import catimg from '/public/assets/images/landingCatSampleImg.png';

interface HomeCategorySectionProps {
    categories: any[];
    loading?: boolean;
    title?: string;
}

const HomeCategorySection = ({ categories, loading, title }: HomeCategorySectionProps) => {
    const mobile = useMediaQuery(768);

    // Show skeleton if loading and no categories are present
    if (loading && (!categories || categories.length === 0)) {
        return <SkeletonLoader mobile={mobile} />;
    }

    // Helper function to generate safe href for category navigation
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

    if (!categories || categories.length === 0) return null;

    // Desktop UI matching the image
    const desktopUI = () => {
        const [firstCategory, ...otherCategories] = categories;

        return (
            <div className="grid grid-cols-4 gap-[4vw] w-[77vw] mx-auto">
                {/* Large Yellow Card - Takes 2 columns horizontally */}
                <Link
                    href={generateHref(firstCategory)}
                    className="col-span-2 rounded-[28px] flex flex-col justify-between relative overflow-hidden h-full hover:shadow-md transition-all duration-300 group"
                >
                    {/* Background Image filling the container */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={catimg}
                            alt={firstCategory?.name || "feature"}
                            fill
                            className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    <div className="relative z-10 p-[2.5vw]">
                    </div>

                    {/* <div className="relative z-10 p-[2.5vw] mt-auto">
                        <Link href={generateHref(firstCategory)} className="flex items-center justify-between bg-white/20 backdrop-blur-sm border border-black/10 rounded-full px-[1.5vw] py-[1vw] hover:bg-white/30 transition-colors group">
                            <span className="font-[SofiaPro] text-[1.2vw] font-medium text-[#231F20]">Shop {firstCategory?.name || 'now'}</span>
                            <div className="bg-[#231F20] rounded-full p-[0.4vw] flex items-center justify-center">
                                <ArrowForwardIcon sx={{ fontSize: '1.2vw', color: '#FFDD00' }} />
                            </div>
                        </Link>
                    </div> */}
                </Link>

                {/* Remaining categories */}
                {otherCategories.map((category: any) => (
                    <CategoryCard key={category.id} category={category} generateHref={generateHref} />
                ))}
            </div>
        );
    };

    // Mobile UI
    const mobileUI = () => {
        const [firstCategory, ...otherCategories] = categories;

        return (
            <div className="px-[4vw]">
                {/* Yellow Card */}
                <Link
                    href={generateHref(firstCategory)}
                    className="rounded-[30px] flex flex-col relative overflow-hidden min-h-[50vw] mb-[4vw] hover:shadow-md transition-all duration-300 group"
                >
                    {/* Background Image filling the container */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={firstCategory?.image}
                            alt={firstCategory?.name}
                            fill
                            className="object-fit opacity-80 transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* <div className="relative z-10 p-[6vw]">
                        <h1 className="font-Stinger font-bold text-[6vw] leading-tight mb-[4vw]">
                            Your freshest<br />finds
                        </h1>
                        <div className="inline-flex items-center gap-[2vw] bg-[#231F20] text-white px-[4vw] py-[3vw] rounded-full">
                            <span className="font-[SofiaPro] text-[3.5vw] font-medium">Shop {firstCategory?.name || 'now'}</span>
                            <ArrowForwardIcon sx={{ fontSize: '4vw' }} />
                        </div>
                    </div> */}
                </Link>

                {/* Category Grid */}
                <div className="grid grid-cols-2 gap-[6vw]">
                    {otherCategories.map((category: any) => (
                        <Link
                            key={category.id}
                            href={generateHref(category)}
                            className="group relative bg-[#F5F5F0] rounded-[30px] overflow-hidden aspect-square flex flex-col"
                        >
                            <div className="p-[4vw] mt-[3vw]">
                                <p className="font-[SofiaPro] font-medium text-[3.5vw] text-center text-black">
                                    {category.name}
                                </p>
                            </div>

                            <div className="absolute bottom-[-5%] right-[-5%] w-[80%] h-[80%]">
                                <Image
                                    src={catimg}
                                    alt={category.name}
                                    fill
                                    className="object-contain object-right-bottom"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="py-[4vw] mob:py-[8vw]">
            {title && (
                <div className="w-[77vw] mx-auto mb-[2.1vw] mob:w-full mob:px-[4vw]">
                    <h1 className="font-Stinger text-start font-bold text-[2.5vw] mob:text-[6vw]">
                        {title}
                    </h1>
                </div>
            )}
            {mobile ? mobileUI() : desktopUI()}
        </div>
    );
};

export default HomeCategorySection;

// Extracted CategoryCard component for cleaner layout
const CategoryCard = ({ category, generateHref }: { category: any, generateHref: (cat: any) => string }) => {
    return (
        <Link
            href={generateHref(category)}
            className="group relative bg-primary-100 rounded-[28px] overflow-hidden hover:shadow-md transition-all duration-300 aspect-square flex flex-col p-[1.5vw]"
        >
            {/* Category Name - Top Center/Left */}
            <div className="mt-[3vw]">
                <p className="font-[SofiaPro] font-medium text-[1.1vw] text-[#231F20] text-center">
                    {category.name}
                </p>
            </div>

            {/* Category Image - positioned at bottom right */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[75%] h-[75%]">
                <Image
                    src={catimg}
                    alt={category.name}
                    fill
                    className="object-contain object-right-bottom transition-transform duration-500 group-hover:scale-105"
                />
            </div>
        </Link>
    );
};

// Skeleton Loader Component
const SkeletonLoader = ({ mobile }: { mobile: boolean }) => {
    if (mobile) {
        return (
            <div className="px-[4vw] py-[8vw]">
                {/* Yellow Card Skeleton */}
                <div className="bg-gray-100 animate-pulse rounded-[30px] p-[6vw] mb-[4vw] h-[40vw]"></div>
                {/* Category Grid Skeleton */}
                <div className="grid grid-cols-2 gap-[6vw]">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-gray-100 animate-pulse rounded-[30px] aspect-square"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="py-[4vw] mob:py-[8vw]">
            <div className="grid grid-cols-4 gap-[4vw] w-[77vw] mx-auto">
                {/* Large Card Skeleton */}
                <div className="col-span-2 bg-gray-100 animate-pulse rounded-[28px] aspect-[16/7.5]"></div>
                {/* Small Card Skeletons */}
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-100 animate-pulse rounded-[28px] aspect-square"></div>
                ))}
            </div>
        </div>
    );
};
