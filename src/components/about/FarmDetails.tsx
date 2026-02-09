import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import farm from '/public/assets/images/about/about4.jpg';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import farmIll1 from '/public/assets/images/about/farmIll1.webp';
import farmIll2 from '/public/assets/images/about/farmIll2.webp';
import farmIll3 from '/public/assets/images/about/farmIll3.webp';

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
    <div className="w-full px-[5vw] py-[8vw] mob:py-[12vw] flex flex-col justify-center items-center bg-white">
      <div className="w-[85vw] mob:w-[92vw] overflow-hidden rounded-[48px] mob:rounded-[32px] flex flex-col">
        {/* Top Image Section */}
        <div className="w-full h-[35vw] mob:h-[60vw] relative overflow-hidden">
          <div
            style={{
              transform: `scale(${scaleFactor > 1 ? scaleFactor : 1})`,
              transformOrigin: 'center',
              transition: 'transform .5s ease-out',
              width: '100%',
              height: '100%',
              position: 'relative'
            }}
          >
            <Image src={farm} alt="farm" fill className="object-cover" priority />
          </div>
        </div>

        {/* Bottom Yellow Section */}
        <div className="bg-[#FBDF13] px-[6vw] py-[62px] mob:px-[8vw] mob:py-[10vw]">
          <div className="flex flex-row mob:flex-col justify-between items-start gap-[4vw] mob:gap-[8vw]">
            {/* Left Headline */}
            <div className="w-[40%] mob:w-full">
              <h1 className="font-[Recoleta] text-[4.2vw] mob:text-[10vw] leading-[1.1] font-bold text-[#1D1D1D]">
                A lot is <br /> going wrong <br /> in the world.
              </h1>
            </div>

            {/* Right Content */}
            <div className="w-[55%] mob:w-full flex flex-col gap-[0.3vw] mob:gap-[0.7vw]">
              <p className="font-[SofiaPro] text-[1.4vw] mob:text-[4vw] leading-[1.4] text-[#1D1D1D] font-normal">
                But food still has a strange and steady power to comfort, <br className="hidden md:block" />
                to ground, to surprise. That’s why we have partnered with
              </p>

              <div className="flex items-center gap-[1vw] mob:gap-[2.5vw]">
                <span className="font-[Recoleta] text-[6.5vw] mob:text-[10vw] font-bold text-[#1D1D1D] leading-none">
                  10,000+
                </span>
                <div className="flex flex-col justify-center">
                  <p className="font-[SofiaPro] text-[1.4vw] mob:text-[4vw] leading-[1.3] text-[#1D1D1D] font-normal">
                    microfarmers across the globe. <br />
                    Let your tastebuds travel. <br />
                    Discover something new.
                  </p>
                </div>
              </div>

              {/* <div className="grid grid-cols-2 mob:grid-cols-1 mt-[6.2vw] mob:gap-[8vw] mob:mt-[8vw] gap-[1.8vw] ">
                {list.map((data: any) => (
                  <div key={data.id} className="w-[17.4vw] mob:w-[88.7vw]">
                    <div className="relative w-[17.4vw] mob:w-[91.5vw] mob:h-[51vw] h-[12.1vw]  ">
                      <Image src={data.ill} alt="" fill />
                    </div>
                    <p className="text-[1.4vw] mob:text-[4.1vw] font-[SofiaPro] font-medium pt-[1.1vw] ">{data.text}</p>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmDetails;
