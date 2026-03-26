import React from 'react';
import Link from 'next/link';

const MangoHero = () => {
  return (
    <section className="relative bg-transparent min-h-[500px] md:min-h-[600px] flex items-center px-12 md:px-[7vw] pt-[100px]">
      {/* Left Content only — image is rendered in parent wrapper */}
      <div className="relative z-20 w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center">
            <svg className="w-3 h-3 text-[#000000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span
            className="md:text-[14.2px] font-medium text-[#000000] tracking-wide"
            style={{ fontFamily: 'SofiaPro' }}
          >
            Season&apos;s Best Harvest
          </span>
        </div>

        <h1 className="text-5xl md:text-[4.7vw] font-semibold text-[#000000] mb-6" style={{ fontFamily: 'Recoleta' }}>
          Farm fresh, <br /> sun-ripened mangoes!
        </h1>

        <p
          className="text-[28.4px] md:text-[28.4px] text-black mb-10 pb-10 md:w-[50%]"
          style={{ fontFamily: 'SofiaPro' }}
        >
          100% carbide-free mangoes, sourced straight from the farmers.
        </p>

        <Link
          href="/mango/products"
          className="inline-block bg-[#000000] text-white font-semibold text-[24px] py-6 px-6 rounded-[20px]"
          style={{ fontFamily: 'Recoleta' }}
        >
          Explore now
        </Link>
      </div>
    </section>
  );
};

export default MangoHero;
