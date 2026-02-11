import React, { useState, useEffect } from 'react';
import handpickedImg from '/public/assets/images/about/handpicked.webp';
import handpickedImg1 from '/public/assets/images/about/about3.webp';
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
        <div className="w-[38vw] mob:w-full ml-[10vw] mob:ml-0 mob:px-[4vw] pb-[5vw] pt-[5vw] mob:pt-[8vw] mob:pb-[10vw]">
          <p className="text-[4.4vw] mob:text-[10.2vw] font-[Recoleta] text-secondary leading-none font-semibold pb-[4vw] mob:text-left">
            {/* Carefully
            <br />
            Handpicked */}
            We help you waste less food.
          </p>
          <p className="font-[SofiaPro] font-medium text-[1.7vw]  mob:text-[4.1vw] leading-[2vw] mob:leading-[6vw] mob:text-left">
            Food waste isn’t usually the result of neglect. <br className="mob:hidden" />
            It’s the byproduct of busy lives colliding with <br className="mob:hidden" />
            the narrow window in which fresh produce <br className="mob:hidden" /> stays usable. Fruits ripen, greens
            wilt, and <br className="mob:hidden" /> meals get postponed. Our Ripeness Quotient{' '}
            <br className="mob:hidden" />
            addresses this mismatch by letting you <br className="mob:hidden" />
            choose produce at the exact stage of <br className="mob:hidden" />
            ripeness you need. With better timing comes <br className="mob:hidden" /> better planning, fewer surprises
            in the fridge, <br className="mob:hidden" /> and far less food thrown away.
          </p>
          {/* <p className="font-[SofiaPro] font-light text-[1.25vw] leading-[2vw] py-[2.2vw] mob:py-[5vw] mob:text-[4.1vw]  mob:leading-[6vw]">
            When you indulge in the essence of pure goodness with our products, you're embarking on a journey of
            culinary delight. Every bite is a testament to our dedication to providing you with the finest ingredients,
            thoughtfully chosen and masterfully crafted. Our commitment goes beyond just the plate; it extends to our
            planet. By choosing our products, you are making a choice for sustainability and responsible consumption.
            It's a boon for the planet, as we prioritize ethical sourcing, reduced waste, and eco-friendly practices in
            every aspect of our product journey.
          </p>
          <p className="font-[SofiaPro] font-light text-[1.25vw]  leading-[2vw]  mob:text-[4.1vw]  mob:leading-[6vw]">
            Join us in savoring the pure goodness and making a positive impact, one delicious bite at a time.
          </p> */}
        </div>
        <div className="w-[38.5vw] mob:w-full mob:h-[90vw] h-[45vw] relative mr-[10vw] mob:mr-0">
          <Image src={handpickedImg1} alt="handpicked image" fill className="object-contain" quality={100} />
        </div>
      </div>
    </div>
  );
};

export default Handpicked;
