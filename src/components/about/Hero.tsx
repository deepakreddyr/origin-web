import Image from 'next/image';
import React from 'react';
import heroImg1 from '/public/assets/images/about/about1.png';
import heroImgNoText from '/public/assets/images/about/aboutNoText.webp';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="w-full mt-[-8vw] mob:mt-[25vw] flex flex-col">
      {/* Desktop View: Show aboutNoText.webp + Text Content Overlay */}
      <div className="hidden md:block w-full relative">
        <Image
          src={heroImg1}
          alt="Good food begins at the source"
          className="w-full h-[62vw] object-cover"
          priority
          quality={100}
        />

        <div
          className="absolute inset-0 bg-[#000000B2] flex flex-col justify-center items-center text-white"
          style={{ perspective: 1000 }}
        >
          <div className="flex flex-col items-center transform translate-y-[6vw]">
            <div style={{ overflow: 'hidden', width: '850px', height: '141px' }}>
              <motion.h1
                className="font-[Recoleta] font-semibold text-center select-none"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                style={{
                  width: '100%',
                  height: '100%',
                  fontSize: '64px',
                  lineHeight: '70.4px',
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Connecting Farms directly
                <br />
                to your Table
              </motion.h1>
            </div>
            <div style={{ overflow: 'hidden', width: '841px', height: '88px', marginTop: '8.8px' }}>
              <motion.p
                className="font-[SofiaPro] font-normal text-center select-none"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                style={{
                  fontFamily: 'SofiaPro',
                  width: '100%',
                  height: '100%',
                  fontSize: '24px',
                  lineHeight: '29.25px',
                  letterSpacing: '0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                We believe the shortest distance between the soil and your soul is an honest harvest. Origin Fresh was
                born to bring the vibrant vitality of organic farming directly to your home.
              </motion.p>
            </div>
          </div>
        </div>
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
        <div className="w-full px-[6vw] bg-[#FFFBEB] py-[10vw] flex flex-col items-start" style={{ perspective: 1000 }}>
          {/* Headline */}
          <div style={{ overflow: 'hidden', width: '100%' }}>
            <motion.h1
              className="font-[Recoleta] font-bold text-[9vw] leading-[1.1] mb-[3vw]"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <span className="text-primary">Good food begins</span>
              <br />
              <span className="text-black">at the source.</span>
            </motion.h1>
          </div>

          <div style={{ overflow: 'hidden', width: '100%' }}>
            <motion.div
              className="w-full"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            >
              {/* Stat */}
              <p className="font-[SofiaPro] font-semibold text-black text-[4vw] leading-[1.25]">
                We work closely with over
              </p>
              <p className="font-[Recoleta] font-bold text-primary text-[9vw] leading-[1]">10,000+ farmers</p>

              {/* Paragraph */}
              <p className="font-[SofiaPro] font-semibold text-black text-[4vw] leading-[1.25]">
                globally, building long-term partnerships rooted in transparency. By removing unnecessary
                intermediaries, we ensure a more traceable journey from farm to table. The result is consistent quality
                for you and fair value for the farmers.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
