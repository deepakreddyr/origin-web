import React from 'react';
import Image from 'next/image';

const MangoPulpBanner = () => {
  return (
    <section className="relative w-full z-10 pointer-events-none -mt-[15vw] md:-mt-[12vw]">
      {/* Using the natural aspect ratio of the image (2880x1773) */}
      <div className="w-full">
        <Image
          src="/assets/images/mangopulp.png"
          alt="Delicious Mango Pulp"
          width={2880}
          height={1773}
          className="w-full h-auto"
          priority
        />
      </div>
    </section>
  );
};

export default MangoPulpBanner;
