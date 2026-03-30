import React from 'react';
import Link from 'next/link';
import MangoItemCard from './MangoItemCard';
import { Product } from '../shared/UOMPopup';

interface PopularMangoesProps {
  products?: Product[];
}

const PopularMangoes = ({ products = [] }: PopularMangoesProps) => {
  return (
    <section className="relative overflow-visible pt-12 pb-4 z-20">
      {/* Header Area - Constrained to site alignment */}
      <div className="max-w-[1440px] mx-auto px-12 md:px-[7vw] relative z-10 mb-10 md:mb-14">
        <div className="flex items-center justify-between">
          <h2 className="text-[32px] md:text-[50px] font-semibold text-[#1B1B1B]" style={{ fontFamily: 'Recoleta' }}>
            Must-try Mangoes
          </h2>
          <Link
            href="/mango/products"
            className="text-sm md:text-[24px] font-[SofiaPro] font-medium text-[#000000] bg-[#FFE9A1] py-3 md:py-4 px-6 md:px-10 rounded-full hover:bg-[#ffe482] transition-colors"
          >
            View all
          </Link>
        </div>
      </div>

      {/* Horizontal Scroll Area - Full width with alignment padding */}
      {products.length > 0 && (
        <div className="w-full relative z-10">
          <div
            className="flex overflow-x-auto gap-6 md:gap-5 pb-12 no-scrollbar scroll-smooth"
            style={{
              paddingLeft: 'max(3rem, calc((100vw - 1440px) / 2 + 7vw))'
            }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[280px] md:w-[350px]">
                <MangoItemCard itemDetails={product} />
              </div>
            ))}
            {/* Large spacer at the end to allow for a "natural" stop point far to the right */}
            <div className="flex-shrink-0 w-12 md:w-[20vw]" />
          </div>
        </div>
      )}
    </section>
  );
};

export default PopularMangoes;
