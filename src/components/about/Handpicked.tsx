import React from 'react';
import handpickedImg1 from '/public/assets/images/about/about3.webp';
import Image from 'next/image';

const Handpicked = () => {
  return (
    <section className="w-full bg-[#FEF5E3] relative flex flex-col justify-start overflow-hidden min-h-[75vw] md:min-h-[58vw]">
      {/* Upper Content Part */}
      <div className="flex flex-col md:flex-row items-start justify-start w-full px-[8vw] md:pr-[11.5vw] pb-[50vw] md:pb-[8vw] z-10 relative">
        {/* Left: Heading */}
        <div className="w-full md:w-auto mt-[10vw] md:mt-[2vw] mb-[2vw] md:mb-0 text-left md:text-right">
          <h2 className="font-[Recoleta] font-bold text-[17vw] md:text-[7.6vw] leading-[1.1] md:leading-[1.05] tracking-tight">
            <span className="text-black md:pl-[10vw]">We have a</span> <br className="md:hidden" />
            <span className="text-[#f2ae25]">dream.</span>
          </h2>
        </div>

        {/* Right: Stats and Description */}
        <div className="w-full md:w-[32vw] md:ml-[3vw] mt-[4vw] md:mt-[10vw] flex flex-col items-start text-left md:pt-4">
          <p className="font-[SofiaPro] font-semibold text-[4vw] md:text-[1.7vw] leading-[1.25] text-black mb-4">
            It is both modest and ambitious. <br className="hidden md:block" />
            That no one should ever have to <br className="hidden md:block" />
            eat a boring plate of food again. <br className="hidden md:block" />
            So we source more&nbsp;than
          </p>

          <div className="flex items-baseline gap-2">
            <span className="text-secondary text-[25vw] md:text-[8vw] font-black leading-[0.85] font-[Recoleta]">
              150
            </span>
            <span className="text-secondary text-[8vw] md:text-[4vw] font-bold font-[Recoleta]">exotic</span>
          </div>

          <p className="font-[SofiaPro] font-semibold text-[4vw] md:text-[1.65vw] leading-[1.25] text-black">
            ingredients alongside carefully <br className="hidden md:block" />
            grown local produce, for people <br className="hidden md:block" />
            who care not just about taste, but <br className="hidden md:block" />
            about the story behind&nbsp;it.
          </p>
        </div>
      </div>

      {/* Bottom Illustration - Absolute so it sits behind text, reducing gap */}
      <div className="absolute bottom-0 left-0 w-full h-full">
        <Image
          src={handpickedImg1}
          alt="farm illustration"
          fill
          className="object-contain object-bottom"
          quality={100}
          priority
        />
      </div>
    </section>
  );
};

export default Handpicked;
