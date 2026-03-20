import React from 'react';
import Image from 'next/image';

const steps = [
  {
    icon: '/assets/svg/subhowitworks1.svg',
    title: 'Order anytime during the week.',
    number: '1'
  },
  {
    icon: '/assets/svg/subhowitworks2.svg',
    title: 'Receive your order on the coming Sunday morning.',
    number: '2'
  },
  {
    icon: '/assets/svg/subhowitworks3.svg',
    title: 'Follow the fruit of the day calendar.',
    number: '3'
  },
  {
    icon: '/assets/svg/subhowitworks4.svg',
    title: 'Begin your war against junk.',
    number: '4'
  }
];

const SubscriptionHowItWorks = () => {
  return (
    <section className="bg-[#FFF7D2] py-14">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Heading */}
        <p
          className="font-[600] text-[3vw] mob:text-[7vw] leading-[1.1] text-center mb-10 uppercase"
          style={{ fontFamily: 'Recoleta' }}
        >
          HOW IT WORKS?
        </p>

        {/* 2×2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[15vw] md:gap-[5vw]">
          {steps.map((step, index) => (
            // Outer wrapper — shifted right to give icon room to hang off left
            <div key={index} className="relative ml-[35px] md:ml-[56px]">
              {/* Orange Card */}
              <div className="bg-[#F2873D] rounded-[20px] md:rounded-[30px] overflow-hidden relative flex items-center justify-center h-[133px] md:h-[208px] pl-10 md:pl-16 pr-4 md:pr-6">
                {/* Large watermark number — perfectly centered */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span
                    className="font-[900] select-none md:pb-[3.5vw] pb-[6.8vw] text-[215px] md:text-[320px]"
                    style={{
                      fontFamily: 'SofiaPro',
                      lineHeight: '1',
                      color: '#FCF2B7'
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Step text */}
                <p
                  className="relative z-10 text-black text-center text-[17px] md:text-[22px]"
                  style={{
                    fontFamily: 'SofiaPro',
                    fontWeight: 400,
                    lineHeight: '1.4',
                    letterSpacing: '0%',
                    maxWidth: '100%'
                  }}
                >
                  {step.title}
                </p>
              </div>

              {/* Circle icon — hangs off the left edge of the card */}
              <div
                className="absolute left-[-35px] md:left-[-56px] top-1/2 -translate-y-1/2 w-[68px] h-[68px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden z-10"
                style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
              >
                <Image src={step.icon} alt={`Step ${step.number}`} fill className="object-cover" sizes="84px" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom paragraph — Full Width */}
      <div className="w-full px-6 mt-16">
        <p
          className="text-center mx-auto text-[16px] md:text-[28px] leading-[21px] md:leading-[1.45] tracking-[0.01em] w-full"
          style={{ fontFamily: 'SofiaPro', fontWeight: 400 }}
        >
          The spirit of this revolution lives in every bite you take. Every berry, every banana brings you
          <br className="hidden md:block" />
          closer to freedom from snacks that your cardiologist&apos;s nightmares are made of. This is not a
          <br className="hidden md:block" />
          test of your faith; rather, it is a taste of truly fresh food that makes you undefeatable.
        </p>
      </div>
    </section>
  );
};

export default SubscriptionHowItWorks;
