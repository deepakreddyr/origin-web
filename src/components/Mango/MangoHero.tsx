import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import originLogo from '/public/assets/images/neworiginlogo.png';

const MangoHero = () => {
  return (
    <section className="relative bg-transparent min-h-[600px] md:min-h-[600px] flex items-center px-4 md:px-[7vw] pt-[0px] md:pt-[100px]">
      {/* Left Content only — image is rendered in parent wrapper */}
      <div className="relative w-full">
        {/* Mobile Logo */}
        <div className="md:hidden mb-8 flex justify-center -ml-4">
          <Image
            src={originLogo}
            alt="Origin Fresh"
            width={220}
            height={60}
            className="object-contain scale-125"
            priority
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center">
            <svg className="w-3 h-3 text-[#000000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span
            className="text-[13px] md:text-[14.2px] font-medium text-[#000000] tracking-wide"
            style={{ fontFamily: 'SofiaPro' }}
          >
            Season&apos;s Best Harvest
          </span>
        </div>

        <h1
          className="text-[38px] leading-[1.1] md:text-[4.7vw] font-semibold text-[#000000] mb-6"
          style={{ fontFamily: 'Recoleta' }}
        >
          Farm fresh, <br className="" /> sun-ripened mangoes!
        </h1>

        <p
          className="text-[18px] md:text-[28.4px] leading-relaxed text-black mb-10 md:w-[50%]"
          style={{ fontFamily: 'SofiaPro' }}
        >
          100% carbide-free mangoes, sourced straight from the farmers.
        </p>

        <Link
          href="/mango/products"
          className="inline-block bg-[#000000] text-white font-semibold text-[18px] md:text-[24px] py-4 md:py-6 px-3 md:px-6 rounded-[12px] md:rounded-[20px]"
          style={{ fontFamily: 'Recoleta' }}
        >
          Explore now
        </Link>
      </div>
    </section>
  );
};

export default MangoHero;
