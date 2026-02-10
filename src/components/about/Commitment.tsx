import React from 'react';
import commitmentImg from '/public/assets/images/about/commitment.webp';
import commitmentImg1 from '/public/assets/images/about/about2.webp';

import Image from 'next/image';

const Commitment = () => {
  return (
    <div className="w-full bg-primary relative flex items-center mob:flex-col justify-between mob:pb-[10vw]">
      <div className="w-[40vw] mob:w-[92vw] h-[35vw] mob:h-[105vw] relative">
        <Image src={commitmentImg1} alt="commitment image" fill className="object-cover" quality={100} />
      </div>
      <div className="w-[42vw] mob:w-full mob:px-[4vw] mob:pt-[8vw] mr-[5vw] mob:text-left">
        <p className="text-[4.4vw] mob:text-[10.2vw] font-[Recoleta] leading-none font-semibold pb-[1.5vw]">
          We have a dream.
        </p>
        <p className="font-[SofiaPro] font-medium text-[1.7vw] mob:text-[4.1vw] leading-[2vw] mob:leading-[6vw]">
          It is a modest one, and also an ambitious one. <br className="mob:hidden" /> That no one should ever have to
          eat a boring <br className="mob:hidden" /> plate of food again. So we source more than{' '}
          <br className="mob:hidden" /> 150 exotic ingredients alongside carefully <br className="mob:hidden" /> grown
          local produce, for people who care not <br className="mob:hidden" /> just about taste, but about the story
          behind it.
        </p>
      </div>
    </div>
  );
};

export default Commitment;
