import React from 'react';
import MangoItemCard from '../Mango/MangoItemCard';
import MangoItemSkeleton from '../Mango/MangoItemSkeleton';
import { Product } from '../shared/UOMPopup';

interface PremiumImportedProduceProps {
  products?: Product[];
  isLoading?: boolean;
}

const GlobeWithPlane = () => (
  <div className="relative w-10 h-10 md:w-16 md:h-16 flex items-center justify-center select-none pointer-events-none">
    {/* Globe */}
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Ocean/Base Circle */}
      <circle cx="50" cy="50" r="40" fill="#2E7D32" opacity="0.1" />
      <circle cx="50" cy="50" r="40" stroke="#0D47A1" strokeWidth="4" fill="#1976D2" />
      {/* Landmasses (simple paths inside circle) */}
      <path d="M30,35 Q35,25 45,30 T55,25 T65,35 Q60,45 50,40 T30,35 Z" fill="#4CAF50" />
      <path d="M25,60 Q35,50 45,55 T60,50 T75,60 Q60,75 45,70 T25,60 Z" fill="#4CAF50" />
      <path d="M45,15 Q50,12 55,15 T60,20 Q50,22 45,15 Z" fill="#4CAF50" />
      {/* Meridians & Equator */}
      <path d="M10,50 H90" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" fill="none" />
      <path d="M50,10 V90" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" fill="none" />
      {/* Orbit path */}
      <ellipse
        cx="50"
        cy="50"
        rx="44"
        ry="20"
        stroke="#212121"
        strokeWidth="3"
        strokeDasharray="6,4"
        fill="none"
        transform="rotate(-15 50 50)"
      />
    </svg>
    {/* Orbiting Plane */}
    <svg
      viewBox="0 0 24 24"
      className="absolute w-4 h-4 md:w-6 md:h-6 text-[#212121] fill-current"
      style={{
        top: '12%',
        right: '2%',
        transform: 'rotate(35deg)'
      }}
    >
      <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
    </svg>
  </div>
);

const PremiumImportedProduce = ({ products = [], isLoading = false }: PremiumImportedProduceProps) => {
  const displayProducts = products;

  return (
    <div className="bg-[#FCEFAEB2] w-full relative overflow-hidden pb-16 mob:pb-10">
      {/* Full Width Curved Yellow Header Banner */}
      <div className="relative bg-primary py-10 mob:py-6 px-16 mob:px-6 flex items-center justify-between overflow-hidden rounded-b-[60px] md:rounded-b-[230px]">
        {/* Decorative elements (hidden on mobile) */}
        <div className="absolute left-6 md:left-[10vw] top-1/2 -translate-y-1/2 hidden md:block">
          {/* <GlobeWithPlane /> */}
        </div>
        <div className="absolute right-6 md:right-[10vw] top-1/2 -translate-y-1/2 hidden md:block">
          {/* <GlobeWithPlane /> */}
        </div>

        {/* Header Title */}
        <h1 className="font-[Recoleta] text-[20px] md:text-[2.5vw] font-bold text-black mx-auto text-center z-[1] select-none tracking-wide">
          Premium Imported Produce
        </h1>
      </div>

      {/* Centered Grid / Scrollable Content */}
      <div className="max-w-[1440px] mx-auto mt-12 mob:mt-6">
        <div className="flex overflow-x-auto noscrollbar gap-[4vw] md:gap-[1.5vw] px-4 md:px-[5vw] pb-4">
          {isLoading || displayProducts.length === 0
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-[50vw] md:w-[24vw] lg:w-[300px] xl:w-[325px]">
                  <MangoItemSkeleton />
                </div>
              ))
            : displayProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[50vw] md:w-[24vw] lg:w-[300px] xl:w-[325px]">
                  <MangoItemCard itemDetails={product} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumImportedProduce;
