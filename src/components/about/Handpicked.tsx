import React, { useState, useEffect } from 'react';
import handpickedImg from '/public/assets/images/about/handpicked.webp';
import farm from '/public/assets/images/about/farm.webp';
import Image from 'next/image';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';

const Handpicked = () => {
  const [scrollY, setScrollY] = useState(0);
  const mobile = useMediaQuery(600);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Increase the zoom factor by adjusting the multiplier
  const scaleFactor = 0.688 + scrollY * 0.0002; // Adjusted multiplier for a stronger zoom effect
  return (
    <div className=" mob:h-max w-full rounded-[6.6vw] mob:rounded-t-[4vw] mob:top-0 relative pb-[0vw] ">
      <div className="flex items-center mob:flex-col-reverse justify-between pt-[6vw]  bg-beige-100 pb-[8vw]">
        <div className="w-[38vw] mob:w-full ml-[10vw] mob:ml-0 mob:p-[4.1vw] pb-[5vw] pt-[5vw] mob:pb-[15vw]">
          <p className="text-[4.4vw] mob:text-[10.2vw] font-[SofiaPro] text-secondary leading-none font-bold pb-[4vw]">
            Carefully
            <br />
            Handpicked
          </p>
          <p className="font-[SofiaPro] font-light text-[1.25vw]  mob:text-[4.1vw] leading-[2vw] mob:leading-[6vw]">
            Our products are a testament to the art of careful selection and curation. Each item in our inventory is
            meticulously handpicked to ensure that it meets the highest standards of quality and freshness. We believe
            in offering our customers nothing but the best, which is why we take great care in choosing products that
            not only delight your taste buds but also align with our commitment to the planet's well-being.
          </p>
          <p className="font-[SofiaPro] font-light text-[1.25vw] leading-[2vw] py-[2.2vw] mob:py-[5vw] mob:text-[4.1vw]  mob:leading-[6vw]">
            When you indulge in the essence of pure goodness with our products, you're embarking on a journey of
            culinary delight. Every bite is a testament to our dedication to providing you with the finest ingredients,
            thoughtfully chosen and masterfully crafted. Our commitment goes beyond just the plate; it extends to our
            planet. By choosing our products, you are making a choice for sustainability and responsible consumption.
            It's a boon for the planet, as we prioritize ethical sourcing, reduced waste, and eco-friendly practices in
            every aspect of our product journey.
          </p>
          <p className="font-[SofiaPro] font-light text-[1.25vw]  leading-[2vw]  mob:text-[4.1vw]  mob:leading-[6vw]">
            Join us in savoring the pure goodness and making a positive impact, one delicious bite at a time.
          </p>
        </div>
        <div className="w-[38.5vw] mob:w-[70vw] mob:h-[120vw] h-[57vw] mob:relative mob:left-[5vw] relative">
          <Image src={handpickedImg} alt="commitment image" fill />
        </div>
      </div>
    </div>
  );
};

export default Handpicked;
