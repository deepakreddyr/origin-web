import React from 'react';
import Image from 'next/image';

const testimonials = [
  {
    text: (
      <>
        Won the challenge only
        <br />
        at the third attempt. Kept
        <br />
        trying it, but on the bright
        <br />
        side, I got to taste so
        <br />
        many different fruits.
      </>
    ),
    author: '~ Manisha'
  },
  {
    text: (
      <>
        The first week was not easy.
        <br />
        The 4 o clock craving started
        <br />
        kicking in big, but the mix of
        <br />
        fruits is what kept me going
        <br />
        through this.
      </>
    ),
    author: '~ Roshan'
  },
  {
    text: (
      <>
        Too easy. Anyway I try to live a<br />
        healthier life than everyone else.
        <br />
        Here, I just got one new fruit
        <br />
        everyday which simplified my
        <br />
        decision process. Have been
        <br />
        acing this since day 1.
      </>
    ),
    author: '~ Ramya'
  }
];

const SubscriptionTestimonials = () => {
  return (
    <section className="bg-[#F9E27D] py-16 min-h-[509px] flex flex-col justify-center">
      <div className="max-w-[1200px] mx-auto px-6">
        <h3
          className="font-[800] text-[2.5rem] leading-[1.1] text-center mb-12 uppercase"
          style={{ fontFamily: 'Recoleta' }}
        >
          TESTIMONIALS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[34px]">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-[#FFF7D2] border-[2px] border-[#EA8E4F] rounded-[24px] p-8 pb-6 relative flex flex-col justify-between min-h-[220px]"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 w-7 h-7">
                <Image src="/assets/svg/subquote.svg" alt="Quote" width={30} height={30} className="object-contain" />
              </div>

              {/* Content */}
              <div className="mt-8">
                <p
                  className="text-[1.1rem] md:text-[1.3rem] leading-[1.2] text-black mb-6 font-[500] text-center lg:whitespace-nowrap"
                  style={{ fontFamily: 'SofiaPro' }}
                >
                  {t.text}
                </p>
              </div>

              {/* Author */}
              <p className="text-right font-[600] text-[1.1rem] tracking-tight" style={{ fontFamily: 'SofiaPro' }}>
                {t.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionTestimonials;
