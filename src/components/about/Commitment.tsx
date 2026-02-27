import React from 'react';
import commitmentImg1 from '/public/assets/images/about/about2.webp';
import Image from 'next/image';
import ScrollUnderline from '@/components/shared/ScrollUnderline';
import { useMediaQuery, useTheme } from '@mui/material';

const Commitment = () => {
  return (
    <section className="w-full min-h-screen bg-[#FFFBEB] flex flex-col items-start pt-[2vh] pb-[10vh] mob:pt-[5vh] overflow-hidden">
      {/* 1. Heading - Always First */}
      <div className="z-[20] mb-[5vh] md:mb-[2vh] w-full px-[8vw]">
        <h2 className="font-[Recoleta] font-bold text-[8.5vw] md:text-[3.7vw] leading-[1.15]">
          <span className="text-secondary">We empower women</span>
          <br />
          <ScrollUnderline underlineColor="#E18D1F">
            <span className="text-black">in the farming sector</span>
          </ScrollUnderline>
        </h2>
      </div>

      {/* 2. Content Row: Image and Stats */}
      <div className="flex flex-col md:flex-row items-center w-full h-full gap-4 md:gap-0">
        {/* Left/Center: Leaf Image - Sticks to left edge on desktop */}
        <div className="relative w-full mt-[2vh] md:mt-[10vh] md:w-[50vw] h-[40vh] md:h-[70vh] flex items-center justify-center md:items-start md:justify-start">
          <div className="relative w-[85vw] md:w-[50vw] h-full scale-100 md:scale-125">
            <Image
              src={commitmentImg1}
              alt="Women in farming"
              fill
              className="object-contain object-center md:object-left lg:ml-[5vw]"
              quality={100}
              priority
            />
          </div>
        </div>

        {/* Right: Statistics and Description - Maintains grid padding */}
        <div className="w-full md:w-[50vw] flex flex-col items-start text-left px-[8vw] mt-[4vh] md:mt-0 md:pl-[13vw] md:pt-[12vh] md:pr-[8vw]">
          <div className="mb-6">
            <span className="font-[SofiaPro] lg:ml-[1vw] mob:ml-[3vw] text-black text-[6vw] md:text-[3.3vw] font-medium block leading-tight">
              More than
            </span>
            <span className="text-secondary text-[25vw] md:text-[12vw] font-black block leading-[0.8] tracking-tight font-[Recoleta]">
              50%
            </span>
          </div>
          <p className="font-[SofiaPro] font-medium text-[4vw] md:text-[1.38vw] leading-[1.25] text-black">
            of our farmer network is led by <br className="md:block hidden" />
            women. Through our digital <br className="md:block hidden" />
            farmer platform and dedicated <br className="md:block hidden" />
            helpline support, we provide <br className="md:block hidden" />
            access to information, market <br className="md:block hidden" />
            insights, and operational tools <br className="md:block hidden" />
            that enable independence and <br className="md:block hidden" />
            productivity at scale.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Commitment;
