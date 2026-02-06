import Image from 'next/image';
import React from 'react';
import heroImg from '/public/assets/images/about/heroBanner.png';
import heroImg1 from '/public/assets/images/about/about1.webp';
import heroImgMob from '/public/assets/images/about/heroImgMob.webp';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
const Hero = () => {
  const mobile = useMediaQuery(600);
  return (
    <div className="flex mob:flex-col-reverse justify-between items-center bg-primary-100 overflow-hidden py-[5vw] mob:py-[10vw] pt-[8vw] mob:pt-[40vw]">
      <div className="pl-[10vw] mob:px-[4vw] mob:text-left flex flex-col justify-center">
        {/* <p className="font-[SofiaPro] text-[1.67vw] mob:text-[3.6vw] font-medium ">About Us</p> */}
        <p className="font-[Recoleta] font-bold leading-none text-[4.4vw] mob:text-[10.2vw] text-secondary">
          We get excited <br /> about food.<br />
        </p>
        <p className='font-[SofiaPro] font-light text-[1.25vw] mob:text-[4.1vw] leading-[2vw] mob:leading-[6vw] pt-[2vw] mob:pt-[4vw]'>
          Good cooking, when you strip it down, begins long before the pan is hot. It begins with ingredients. Origin Fresh was built on a simple belief. Love matters, yes. But so does where your food comes from and how it is grown. That belief has found its way into over 60,000 kitchens across Bengaluru and Chennai. We do not take that lightly.
        </p>
      </div>
      <div className="pr-[10vw] mob:pr-0 mob:mb-[8vw]">
        <div className="h-[40vw] w-[40vw] mob:h-[85vw] mob:w-[85vw] relative">
          <Image
            src={heroImg1}
            alt="hero image"
            fill
            className='object-contain'
            priority
            quality={100}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
