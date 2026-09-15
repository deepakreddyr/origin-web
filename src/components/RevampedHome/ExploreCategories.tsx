import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ExploreCategoriesProps {
  categories?: any[];
  blendsCategory?: any[];
  className?: string;
}

const ExploreCategories: React.FC<ExploreCategoriesProps> = ({ categories, blendsCategory, className }) => {
  const [activeTab, setActiveTab] = useState('All');

  // We map the incoming data into this component's UI
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

  const getFilteredCategories = () => {
    if (!categories) return [];
    if (activeTab === 'All') return categories;
    return categories.filter((cat) => cat.name === activeTab);
  };

  const displayedCats = getFilteredCategories().slice(0, 8); // Just show a few for now

  return (
    <section className={`section-pad section-pad--tight-b texture-paper ${className || ''}`}>
      <div className="wrap">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-[32px] animate-fade-in-up">
          <div>
            <span className="eyebrow">Explore Our Categories</span>
            <h2 className="h-lg m-0">Shop by what's calling you.</h2>
          </div>
          {/* <div className="flex gap-2 overflow-x-auto pb-2 noscrollbar">
            {['All', 'Fruits', 'Vegetables', 'Exotic'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-[14px] font-SofiaPro transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-ink text-cream' : 'bg-transparent text-ink border border-ink/20 hover:border-ink'}`}
              >
                {tab}
              </button>
            ))}
          </div> */}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up delay-100">
          {displayedCats.map((cat, i) => (
            <Link href={generateHref(cat)} key={i} className="group flex flex-col gap-[15px]">
              <div className="relative aspect-[4/5] w-full rounded-[16px] overflow-hidden bg-[#F9F7F0]">
                <Image
                  src={cat.website_image || cat.image || '/assets/images/landingCatSampleImg.webp'}
                  alt={cat.name || 'Category'}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <p className="font-Recoleta text-[18px] text-ink m-0 text-start">{cat.name}</p>
            </Link>
          ))}
          {/* Static fallback if no data */}
          {!categories?.length && (
            <>
              {['Just Landed', 'Fruits', 'Veggies', 'In Season'].map((name, i) => (
                <Link href="/shop" key={i} className="group flex flex-col gap-[12px]">
                  <div className="relative aspect-[4/5] w-full rounded-[16px] overflow-hidden bg-[#F9F7F0]">
                    <Image
                      src={`/assets/revamp/Images/Category images/cat-${name.toLowerCase().replace(' ', '-')}.jpg`}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <p className="font-Recoleta text-[18px] text-ink m-0 text-center">{name}</p>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExploreCategories;
