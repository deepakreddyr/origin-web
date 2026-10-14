import React, { useState } from 'react';

type FamilySize = 2 | 3 | 5;

interface PlanDetails {
  weight: string;
  priceMonth: number;
  perDelivery: number;
  selection: string;
}

interface ProductCardData {
  id: string;
  tag: string;
  tagColor: 'orange' | 'green';
  rating: number;
  reviews: string;
  title: string;
  description: string;
  image: string;
  plans: Record<FamilySize, PlanDetails>;
}

const PRODUCTS_DATA: ProductCardData[] = [
  {
    id: 'mixed-harvest',
    tag: 'MOST POPULAR',
    tagColor: 'orange',
    rating: 4.9,
    reviews: '1.2k',
    title: 'Mixed Harvest Basket',
    description: 'A curated weekly harmony of staple cooking greens, root crops, aromatics, and orchard snacks.',
    image: '/onam.png',
    plans: {
      2: {
        weight: '~3.2 kg',
        priceMonth: 4200,
        perDelivery: 1050,
        selection: '500g Red Onion, 500g Pahari Potato, 500g Vine Tomatoes, Spinach bunches, 750g Royal...'
      },
      3: {
        weight: '~4.8 kg',
        priceMonth: 5800,
        perDelivery: 1450,
        selection: '750g Red Onion, 1kg Pahari Potato, 750g Vine Tomatoes, 2x Spinach bunches, 1kg Royal Gala Apples...'
      },
      5: {
        weight: '~7.5 kg',
        priceMonth: 8600,
        perDelivery: 2150,
        selection:
          '1.5kg Red Onion, 2kg Pahari Potato, 1.5kg Vine Tomatoes, 3x Spinach bunches, 1.5kg Royal Gala Apples...'
      }
    }
  },
  {
    id: 'orchard-fruit',
    tag: 'SWEET HARVEST',
    tagColor: 'green',
    rating: 4.8,
    reviews: '680',
    title: 'Orchard Fruit Box',
    description: '100% naturally tree-ripened local orchard fruits, hand-checked for blemish-free sweetness.',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
    plans: {
      2: {
        weight: '~2.5 kg',
        priceMonth: 3400,
        perDelivery: 850,
        selection: 'Himachal Golden Delicious Apples, Robusta Bananas, Nagpur Sweet Oranges, and Seasonal'
      },
      3: {
        weight: '~3.8 kg',
        priceMonth: 4800,
        perDelivery: 1200,
        selection: 'Himachal Golden Delicious Apples, Robusta Bananas, Nagpur Sweet Oranges, Grapes & Seasonal'
      },
      5: {
        weight: '~6.0 kg',
        priceMonth: 7200,
        perDelivery: 1800,
        selection: 'Himachal Golden Delicious Apples, Robusta Bananas, Nagpur Oranges, Kiwi, Grapes & Exotic Fruits'
      }
    }
  },
  {
    id: 'pure-veggie',
    tag: 'DAILY STAPLES',
    tagColor: 'green',
    rating: 5.0,
    reviews: '940',
    title: 'Pure Veggie Basket',
    description: 'High-density culinary greens, robust root stocks, and tender cooking essentials without fruit items.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    plans: {
      2: {
        weight: '~4.0 kg',
        priceMonth: 3800,
        perDelivery: 950,
        selection: 'Crisp Lettuce, Methi Greens, 1kg Golden Potatoes, Cauliflower, Capsicum, Green Chillies'
      },
      3: {
        weight: '~6.0 kg',
        priceMonth: 5400,
        perDelivery: 1350,
        selection: 'Crisp Lettuce, Methi Greens, 1.5kg Golden Potatoes, 2x Cauliflower, Capsicum, Green Chillies'
      },
      5: {
        weight: '~9.5 kg',
        priceMonth: 8200,
        perDelivery: 2050,
        selection:
          'Crisp Lettuce, Methi, 2.5kg Golden Potatoes, 2x Cauliflower, Broccoli, Capsicum, Green Chillies & Herbs'
      }
    }
  }
];

interface SubscriptionPlansSectionProps {
  onSubscribe?: (product: ProductCardData, familySize: FamilySize) => void;
  className?: string;
}

const SubscriptionPlansSection: React.FC<SubscriptionPlansSectionProps> = ({ onSubscribe, className = '' }) => {
  const [selectedFamily, setSelectedFamily] = useState<FamilySize>(2);
  const familyOptions: FamilySize[] = [2, 3, 5];

  return (
    <section className={`w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 ${className}`}>
      {/* ── Section 1: Customize Subscription Rhythm Filter Bar ── */}
      <div
        className="w-full max-w-[1332px] mx-auto bg-[#EAE6DE] rounded-[13.5px] p-[27px] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6 shadow-sm"
        style={{
          borderRadius: '13.5px',
          minHeight: '113.125px',
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
      >
        {/* Left: Icon & Title */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-[#EA5824] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <circle cx="8" cy="14" r="1" fill="currentColor" />
              <circle cx="12" cy="14" r="1" fill="currentColor" />
              <circle cx="16" cy="14" r="1" fill="currentColor" />
              <circle cx="8" cy="18" r="1" fill="currentColor" />
              <circle cx="12" cy="18" r="1" fill="currentColor" />
              <circle cx="16" cy="18" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span
              className="text-[#8D4320] font-bold text-[10px] sm:text-[11px] tracking-[0.12em] uppercase leading-none mb-1.5"
              style={{ fontFamily: 'SofiaPro' }}
            >
              CUSTOMIZE SUBSCRIPTION RHYTHM
            </span>
            <h2
              className="text-[#132B1E] font-semibold text-[19px] sm:text-[22.5px] leading-[31.5px]"
              style={{
                fontFamily: 'Recoleta',
                fontWeight: 600,
                fontSize: '22.5px',
                lineHeight: '31.5px',
                letterSpacing: '0px'
              }}
            >
              Tailor frequency to your cooking habits
            </h2>
          </div>
        </div>

        {/* Right: Frequency Pill, Family Selector & Delivery Info */}
        <div className="flex flex-wrap items-center gap-3.5 sm:gap-5 w-full lg:w-auto justify-between lg:justify-end">
          {/* Frequency pill */}
          <div
            className="w-[92px] h-[37px] rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0"
            style={{
              width: '92px',
              height: '37px',
              borderRadius: '11248.88px',
              padding: '4.5px',
              backgroundColor: '#FFFFFF',
              opacity: 1,
              transform: 'rotate(0deg)'
            }}
          >
            <div
              className="w-full h-full rounded-full bg-[#F5A623] text-[#132B1E] font-semibold text-[13px] flex items-center justify-center text-center shadow-xs"
              style={{
                borderRadius: '11248.88px',
                fontFamily: 'SofiaPro'
              }}
            >
              Weekly
            </div>
          </div>

          {/* Family Size Selector */}
          <div className="bg-white rounded-full px-2.5 py-1 flex items-center gap-1.5 border border-[#DFDAD0] shadow-sm">
            <span className="text-[#6B7268] text-[13px] font-medium pl-1.5" style={{ fontFamily: 'SofiaPro' }}>
              Family:
            </span>
            {familyOptions.map((size) => {
              const isActive = selectedFamily === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedFamily(size)}
                  className={`w-6 h-6 flex-shrink-0 rounded-full text-[13px] font-bold leading-none flex items-center justify-center text-center cursor-pointer transition-colors duration-150 ${
                    isActive ? 'bg-[#F5A623] text-[#132B1E]' : 'bg-transparent text-[#6B7268] hover:text-[#132B1E]'
                  }`}
                  style={{ fontFamily: 'SofiaPro' }}
                  aria-label={`Select family size of ${size}`}
                >
                  <span className="w-full text-center select-none">{size}</span>
                </button>
              );
            })}
          </div>

          {/* Free Delivery Info */}
          <div className="flex flex-col text-left sm:text-right pl-2 sm:pl-0 sm:border-l sm:border-black/10 sm:pl-5">
            <span
              className="text-[#7A837A] uppercase font-bold text-[10px] tracking-wider leading-none mb-1"
              style={{ fontFamily: 'SofiaPro' }}
            >
              FREE DELIVERY
            </span>
            <span className="text-[#132B1E] font-bold text-[12px] leading-none" style={{ fontFamily: 'SofiaPro' }}>
              Sundays 7:00 AM – 11:00 AM
            </span>
          </div>
        </div>
      </div>

      {/* ── Section 2: Three ways to fill your kitchen ── */}
      <div className="w-full max-w-[1332px] mx-auto mt-10 lg:mt-14">
        {/* Section Header */}
        <div className="text-left mb-8">
          <span
            className="text-[#8D4320] font-bold text-[11px] tracking-[0.14em] uppercase leading-none mb-2 block"
            style={{ fontFamily: 'SofiaPro' }}
          >
            FIND YOUR WEEKLY FAVOURITES
          </span>
          <h2
            className="text-[#132B1E] font-semibold text-[32px] sm:text-[38px] lg:text-[42px] leading-[1.1] mb-2.5"
            style={{ fontFamily: 'Recoleta' }}
          >
            Three ways to fill your kitchen.
          </h2>
          <p className="text-[#556057] text-[14px] sm:text-[17px]" style={{ fontFamily: 'SofiaPro' }}>
            Every box comes fresh from verified regenerative plots in recyclable thermal insulation.
          </p>
        </div>

        {/* 3 Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PRODUCTS_DATA.map((product) => {
            const currentPlan = product.plans[selectedFamily];

            return (
              <div
                key={product.id}
                className="bg-white rounded-[22px] overflow-hidden border border-[#EBE8E0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Image + Badges */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F2EEE7]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />

                  {/* Top-Left Floating Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <span
                      className={`text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-xs tracking-wider ${
                        product.tagColor === 'orange' ? 'bg-[#EA5824]' : 'bg-[#1E3F2F]'
                      }`}
                      style={{ fontFamily: 'SofiaPro' }}
                    >
                      {product.tag}
                    </span>

                    <span
                      className="bg-[#132B1E]/90 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-xs tracking-wider"
                      style={{ fontFamily: 'SofiaPro' }}
                    >
                      FAMILY OF {selectedFamily}
                    </span>
                  </div>

                  {/* Bottom-Right Rating Badge */}
                  <div
                    className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1 shadow-md text-[11px] font-bold text-[#132B1E]"
                    style={{ fontFamily: 'SofiaPro' }}
                  >
                    <span className="text-[#F5A623]">★</span>
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-gray-400 font-normal">({product.reviews})</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4 text-left">
                  <div className="flex flex-col gap-2">
                    {/* Title and Weight */}
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="text-[#132B1E] font-semibold text-[20px] leading-tight"
                        style={{ fontFamily: 'Recoleta' }}
                      >
                        {product.title}
                      </h3>
                      <span
                        className="text-[#D96528] font-semibold text-[13px] flex-shrink-0 pt-0.5"
                        style={{ fontFamily: 'SofiaPro' }}
                      >
                        {currentPlan.weight}
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className="text-[#556057] text-[13px] sm:text-[14px] leading-relaxed line-clamp-2"
                      style={{ fontFamily: 'SofiaPro' }}
                    >
                      {product.description}
                    </p>

                    {/* This Week's Selection Box */}
                    <div className="bg-[#F9F8F5] rounded-[12px] p-3 border border-[#EFECE6] mt-1">
                      <span
                        className="text-[#7A837A] uppercase font-bold text-[10px] tracking-wider mb-1 block"
                        style={{ fontFamily: 'SofiaPro' }}
                      >
                        THIS WEEK&apos;S SELECTION:
                      </span>
                      <p
                        className="text-[#2C3830] text-[12px] leading-snug line-clamp-2"
                        style={{ fontFamily: 'SofiaPro' }}
                      >
                        {currentPlan.selection}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Price & Subscribe Button */}
                  <div className="pt-2">
                    <div className="flex items-baseline justify-between mb-3">
                      <div className="flex items-baseline">
                        <span
                          className="text-[#132B1E] font-bold text-[24px] leading-none"
                          style={{ fontFamily: 'Recoleta' }}
                        >
                          ₹{currentPlan.priceMonth.toLocaleString()}
                        </span>
                        <span
                          className="text-[#7A837A] text-[13px] font-normal ml-1"
                          style={{ fontFamily: 'SofiaPro' }}
                        >
                          / month
                        </span>
                      </div>
                      <span className="text-[#7A837A] text-[12px]" style={{ fontFamily: 'SofiaPro' }}>
                        ₹{currentPlan.perDelivery.toLocaleString()} per harvest delivery
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSubscribe?.(product, selectedFamily)}
                      className="w-full bg-[#F5A623] hover:bg-[#EAA01E] active:scale-[0.98] text-[#132B1E] font-semibold text-[14px] py-3 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      style={{ fontFamily: 'SofiaPro' }}
                    >
                      <span>Subscribe</span>
                      <span className="text-[16px] leading-none">→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlansSection;
