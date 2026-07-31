import Image from 'next/image';
import React from 'react';
import heroImg1 from '/public/assets/images/about/about1.png';
import heroImgMob from '/public/assets/images/about/aboutbannermob.png';
import heroImgNoText from '/public/assets/images/about/aboutNoText.webp';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="w-full mt-[-8vw]  flex flex-col">
      {/* Desktop View: Show aboutNoText.webp + Text Content Overlay */}
      <div className="hidden md:block w-full relative">
        <Image
          src={heroImg1}
          alt="Good food begins at the source"
          className="w-full h-[62vw] object-cover"
          priority
          quality={100}
        />
      </div>

      {/* Mobile View: Full image with centered text overlay */}
      <div className="md:hidden w-full relative" style={{ height: '591px' }}>
        {/* Background Image */}
        <Image
          src={heroImgMob}
          alt="Connecting Farms directly to your Table"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Centered Text Content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-[24px] transform translate-y-[8vw]"
          style={{ perspective: 1000 }}
        >
          {/* Heading */}
          <div style={{ overflow: 'hidden', width: '100%' }}>
            <motion.h1
              className="font-[Recoleta] text-white text-center"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              style={{
                fontWeight: 600,
                fontSize: '36.73px',
                lineHeight: '40.4px',
                letterSpacing: '0.57px'
              }}
            >
              <span className="text-primary">Connecting Farms</span> directly to your Table
            </motion.h1>
          </div>

          {/* Description */}
          <div style={{ overflow: 'hidden', width: '100%', marginTop: '16px' }}>
            <motion.p
              className="font-[SofiaPro] text-white text-center"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              style={{
                fontWeight: 400,
                fontSize: '13.77px',
                lineHeight: '16.78px',
                letterSpacing: '0px'
              }}
            >
              We believe the shortest distance between the soil and your soul is an honest harvest. Origin Fresh was
              born to bring the vibrant vitality of organic farming directly to your home.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
