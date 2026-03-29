import Image from 'next/image';
import React from 'react';
import heroImg1 from '/public/assets/images/about/about1.webp';
import heroImgNoText from '/public/assets/images/about/aboutNoText.webp';

const Hero = () => {
  return (
    <section className="w-full mob:mt-[25vw] flex flex-col">
      {/* Desktop View: Show about1.webp (already has text) */}
      <div className="hidden md:block w-full">
        <Image
          src={heroImg1}
          alt="Good food begins at the source"
          className="w-full h-auto object-cover"
          priority
          quality={100}
        />
      </div>

      {/* Mobile View: Show aboutNoText.webp + Text Content Below */}
      <div className="md:hidden w-full flex flex-col mt-[9vw]">
        <div className="w-full">
          <Image
            src={heroImgNoText}
            alt="Hero background"
            className="w-full h-auto object-cover"
            priority
            quality={100}
          />
        </div>

        {/* Mobile Description Section */}
        <div className="w-full px-[6vw] bg-[#FFFBEB] py-[10vw] flex flex-col items-start">
          {/* Headline */}
          <h1 className="font-[Recoleta] font-bold text-[9vw] leading-[1.1] mb-[6vw]">
            <span className="text-primary">Good food begins</span>
            <br />
            <span className="text-black">at the source.</span>
          </h1>

          {/* Stat */}
          <p className="font-[SofiaPro] font-semibold text-black text-[4vw] leading-[1.25]">
            We work closely with over
          </p>
          <p className="font-[Recoleta] font-bold text-primary text-[9vw] leading-[1]">10,000+ farmers</p>

          {/* Paragraph */}
          <p className="font-[SofiaPro] font-semibold text-black text-[4vw] leading-[1.25]">
            globally, building long-term partnerships rooted in transparency. By removing unnecessary intermediaries, we
            ensure a more traceable journey from farm to table. The result is consistent quality for you and fair value
            for the farmers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
