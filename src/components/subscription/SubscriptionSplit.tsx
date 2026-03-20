import React from 'react';
import Image from 'next/image';

const SubscriptionSplit = ({ comboItems }: { comboItems?: any[] }) => {
  return (
    <section className="flex flex-col md:flex-row relative bg-[#fce38d] md:min-h-[770px]">
      <div
        className="hidden md:block absolute bottom-0 z-10 pointer-events-none"
        style={{ left: '47%', transform: 'translateX(-50%)', width: '650px', height: '750px' }}
      >
        <Image
          src="/assets/svg/subbanana.svg"
          alt="Banana Hand"
          width={650}
          height={950}
          className="w-full h-[750px]"
          priority
          quality={100}
        />
      </div>

      {/* Left: Brown Section */}
      <div className="bg-[#CE6B34] text-white pl-6 pr-10 pt-14 pb-20 md:px-10 md:py-20 w-full md:w-1/2 flex flex-col justify-start relative overflow-hidden min-h-[380px] md:min-h-0">
        <p className="font-[Recoleta] font-semibold md:pl-[2vw] text-[6vw] md:text-[3vw] leading-[1.1] uppercase max-w-[300px] relative z-20">
          4 O'CLOCK <br /> HUNGER <br /> HITS HARD.
        </p>

        {/* Banana — absolute on mobile at bottom-right of brown section */}
        <div className="md:hidden absolute right-0 bottom-[-6px] z-10 pointer-events-none" style={{ width: '60%' }}>
          <Image src="/assets/svg/subbanana.svg" alt="Banana Hand" width={250} height={315} className="w-full h-auto" />
        </div>
      </div>

      {/* Right: Cream Section */}
      <div className="bg-[#F9DB87] w-full md:w-1/2 flex flex-col justify-center relative">
        <div className="border-[22px] mob:border-[10px] border-white p-8 md:p-20 h-full flex flex-col justify-center items-center">
          <div className="max-w-[700px] relative z-20 ml-0 md:ml-[9vw] text-center md:text-left">
            <p className="text-black mb-4 font-normal mob:font-medium text-[4.5vw] md:text-[1.67vw] leading-[1.4]">
              You reach for a pack of chips, <br />
              a samosa with your tea or <br />
              good ol' fashioned street treats.
            </p>

            <p className="text-black mb-4 font-normal mob:font-medium text-[4.5vw] md:text-[1.67vw] leading-[1.4]">
              But that changes, <br />
              as soon as you accept this challenge.
            </p>

            <p className="text-black mb-4 font-normal mob:font-medium text-[4.5vw] md:text-[1.67vw] leading-[1.4]">
              You get 7 fruits, one for <br />
              each day of the week.
            </p>

            <p className="text-black mb-8 font-normal mob:font-medium text-[4.5vw] md:text-[1.67vw] leading-[1.4]">
              Can you make it through the week <br />
              without caving into cravings?
            </p>

            <p className="font-bold mb-1 text-[4vw] md:text-[1.6vw]">Here comes the</p>
            <div
              className="font-[Recoleta] text-[#ff483d] text-[3.5vw] mob:text-[10vw] font-[800] leading-[1] mt-[10px]"
              style={{ textShadow: '-2px 0px 0 #a00404' }}
            >
              fruit <br /> revolution.
            </div>
            <p className="mt-2 font-[Recoleta] font-normal text-[4vw] mob:text-[5vw] md:text-[1.6vw]">
              Say no to junk.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSplit;
