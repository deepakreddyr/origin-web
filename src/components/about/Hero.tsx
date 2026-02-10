import Image from 'next/image';
import React from 'react';
import heroImg from '/public/assets/images/about/heroBanner.png';
import heroImg1 from '/public/assets/images/about/about1.webp';
import heroImgMob from '/public/assets/images/about/heroImgMob.webp';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
const Hero = () => {
  const mobile = useMediaQuery(600);
  return (
    <div className="flex mob:flex-col-reverse justify-between items-start bg-primary-100 overflow-hidden py-[5vw] mob:py-[10vw] pt-[8vw] mob:pt-[40vw]">
      <div className="pl-[10vw] mob:px-[4vw] mob:text-left flex flex-col justify-start mt-[6vw] mob:mt-0">
        {/* <p className="font-[SofiaPro] text-[1.67vw] mob:text-[3.6vw] font-medium ">About Us</p> */}
        <p className="font-[Recoleta] font-semibold leading-none text-[4.4vw] mob:text-[10.2vw] text-secondary">
          We get excited <br className="mob:hidden" /> about food.
          <br className="mob:hidden" />
        </p>
        <p className="font-[SofiaPro] font-medium text-[1.7vw] mob:text-[4.1vw] leading-[2vw] mob:leading-[6vw] pt-[2vw] mob:pt-[4vw]">
          Good cooking, when you strip it down, <br className="mob:hidden" /> begins long before the pan is hot. It{' '}
          <br className="mob:hidden" /> begins with ingredients. Origin Fresh <br className="mob:hidden" />
          was built on a simple belief. Love <br className="mob:hidden" />
          matters, yes. But so does where your <br className="mob:hidden" />
          food comes from and how it is grown. <br className="mob:hidden" />
          That belief has found its way into over <br className="mob:hidden" />
          60,000 kitchens across Bengaluru and <br className="mob:hidden" />
          Chennai. We do not take that lightly.
        </p>
      </div>
      <div className="pr-[10vw] mob:pr-0 mob:mb-[8vw] flex items-center mob:w-full mob:justify-center">
        <div className="h-[40vw] w-[40vw] mob:h-[85vw] mob:w-[85vw] relative">
          <Image src={heroImg1} alt="hero image" fill className="object-contain" priority quality={100} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
