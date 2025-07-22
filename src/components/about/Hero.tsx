import Image from 'next/image';
import React from 'react';
import heroImg from '/public/assets/images/about/heroBanner.png';
import heroImgMob from '/public/assets/images/about/heroImgMob.webp';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
const Hero = () => {
  const mobile = useMediaQuery(600);
  return (
    <div className="flex mob:flex-col-reverse mob:pb-[8vw] justify-between mob:items-start items-center mob:pt-[12vw] bg-primary-100 overflow-hidden">
      {/* <div className="flex flex-col gap-[3vw] md:gap-[8vw] md:ml-[5vw] lg:ml-[10vw] px-[5vw] pt-[10vw] pb-[15vw]">
        <p className="font-medium text-[3vw] md:text-[2.2vw] leading-[2.2vw]">About Us</p>
        <h1 className="font-semibold text-secondary leading-[4.4vw] lg:leading-[7vw] text-[5vw] md:text-[4vw]">
          Embracing <br /> Freshness, Selection, and Community
        </h1>
      </div> */}
      <div className="pl-[10vw] pt-[6vw] mob:pl-[4vw] ">
        <p className="font-[SofiaPro] text-[1.67vw] mob:text-[3.6vw] font-medium ">About Us</p>
        <p className="font-[SofiaPro] font-bold leading-none text-[4.4vw] mob:text-[10.2vw] pt-[4vw] text-secondary  ">
          Embracing <br /> Freshness , Selection, <br /> and Community
        </p>
      </div>
      <div className="h-[54vw] mob:w-screen mob:h-[90vw] w-[41.5vw] relative">
        <Image src={mobile ? heroImgMob : heroImg} alt="hero image" fill />
      </div>
    </div>
  );
};

export default Hero;
