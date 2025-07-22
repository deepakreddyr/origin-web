import React, { useEffect, useState } from 'react';
import farmIll1 from '/public/assets/images/about/farmIll1.webp';
import farmIll2 from '/public/assets/images/about/farmIll2.webp';
import farmIll3 from '/public/assets/images/about/farmIll3.webp';
import Image from 'next/image';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import farm from '/public/assets/images/about/farm.webp';

const list = [
  { id: 1, ill: farmIll1, text: 'Cultivating the culture of fair trade since 1970.' },
  { id: 2, ill: farmIll2, text: 'At Origin, we ensure every farmer earns a profit.' },
  { id: 3, ill: farmIll3, text: 'We deliver the essence of what sets us apart' }
];

const FarmDetails = () => {
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
  const scaleFactor = 0.688 + scrollY * 0.0002;
  return (
    <div className=" mob:pt-0 pb-[12vw] mob:bg-beige-100 h-full relative">
      <div className="flex relative flex-col  items-center justify-center">
        <div className="bg-beige-100 w-full h-[15vw] "></div>
        <div className="w-[80vw] mob:w-[90vw] absolute top-[-5vw] rounded-[3vw] overflow-hidden ">
          <div
            style={{
              transform: `scale(${mobile ? 1 : scaleFactor > 1 ? scaleFactor : 1})`,
              transformOrigin: 'center',
              transition: 'transform .5s ease-out' // Smooth scaling
            }}
            className="rounded-[3vw]"
          >
            <Image className="rounded-[3vw]" src={farm} alt="farm" />
          </div>
        </div>
      </div>
      <div className="flex mob:flex-col mob:relative sticky top-0 pt-[20vw] mob:pt-[25vw] px-[7vw] mob:px-[4vw]  mob:h-full mob:justify-start justify-between">
        <div className="pl-[4vw] mob:pl-0 sticky mob:relative mob:top-0 top-[7vw] h-[12vh] mob:h-full pt-[1.1vw] ">
          <p className="text-[4.4vw] mob:text-[10.2vw] font-[SofiaPro] text-secondary leading-none font-bold ">
            Its a small <br /> world after all
          </p>
        </div>
        <div className="w-[38vw] mob:w-full mob:mr-0 mr-[5vw]  mob:pt-[6vw]">
          <p className="font-[SofiaPro] font-light text-[1.25vw]  mob:text-[4.1vw] leading-[2vw] mob:leading-[6vw] ">
            As a member of our community, you play a vital role in supporting local farmers and reducing food waste. We
            believe in fostering relationships that benefit both those who grow our food and those who enjoy it.
            Together, we're making fresh, high-quality produce accessible to all, ensuring that nobody is left behind in
            their quest for nutritious and delicious meals. Join us in this extraordinary journey where every purchase
            is a step toward a brighter, more sustainable future for everyone. We are Origin, and we are
            community-centric, driven by the power of togetherness and shared purpose.
          </p>
          <div className="grid grid-cols-2 mob:grid-cols-1 mt-[6.2vw] mob:gap-[8vw] mob:mt-[8vw] gap-[1.8vw] ">
            {list.map((data: any) => (
              <div key={data.id} className="w-[17.4vw] mob:w-[88.7vw]">
                <div className="relative w-[17.4vw] mob:w-[91.5vw] mob:h-[51vw] h-[12.1vw]  ">
                  <Image src={data.ill} alt="" fill />
                </div>
                <p className="text-[1.4vw] mob:text-[4.1vw] font-[SofiaPro] font-medium pt-[1.1vw] ">{data.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmDetails;
