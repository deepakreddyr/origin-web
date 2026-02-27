import Image, { StaticImageData } from 'next/image';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import leafImg from '/public/assets/images/about/aboutleaf.webp';
import step1Img from '/public/assets/images/about/aboutimg1.webp';
import step2Img from '/public/assets/images/about/aboutimg2.webp';
import step3Img from '/public/assets/images/about/aboutimg3.webp';
import step4Img from '/public/assets/images/about/aboutimg4.webp';
import step5Img from '/public/assets/images/about/aboutimg5.webp';
import step6Img from '/public/assets/images/about/aboutimg6.webp';
import originOfFreshImg from '/public/assets/images/about/originofFresh.webp';

interface StepIconProps {
  image: StaticImageData;
  alt: string;
}

const StepIcon = ({ image, alt }: StepIconProps) => (
  <div className="relative flex-shrink-0">
    <div className="w-[18vw] h-[18vw] md:w-[8vw] md:h-[8vw] rounded-full border border-black/15 bg-white flex items-center justify-center shadow-sm z-10 relative">
      <div className="relative w-[60%] h-[60%]">
        <Image src={image} alt={alt} fill className="object-contain" />
      </div>
    </div>
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#F6B33E] rounded-full z-10" />
  </div>
);

const OriginOfFresh = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stepsContainerRef,
    offset: ['start 0.6', 'end 0.8']
  });

  // Animate the dashed line's reveal using clip-path to keep the dashes intact
  const clipPath = useTransform(scrollYProgress, [0, 1], ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)']);

  return (
    <section ref={sectionRef} className="w-full bg-[#FAF7F0] relative mob:py-[8vh] overflow-hidden">
      {/* Background Leaves */}
      <div className="relative z-10 w-full mob:px-[6vw]">
        {/* Heading */}
        <h2 className="font-[Recoleta] font-bold text-[6vw] md:text-[3.5vw] text-center mb-[8vh] mob:mb-[6vh] leading-tight text-black sm:hidden">
          Let&apos;s go to the <span className="text-secondary">Origin of Fresh</span>
        </h2>

        {/* Desktop Full Image Section */}
        <div className="hidden sm:block w-full">
          <Image src={originOfFreshImg} alt="Origin of Fresh" className="w-full h-auto" priority />
        </div>

        {/* Steps Container */}
        <div ref={stepsContainerRef} className="relative max-w-[900px] mx-auto sm:hidden">
          {/* ========== DESKTOP Dashed SVG path ========== */}
          <svg
            className="absolute inset-0 w-full h-full z-0 hidden md:block"
            viewBox="0 0 900 1600"
            preserveAspectRatio="none"
            fill="none"
          >
            <motion.path
              d="M 350 60 
                 C 380 140, 580 180, 570 240 
                 S 320 320, 330 400 
                 C 340 480, 580 480, 570 560 
                 S 280 640, 310 720 
                 C 340 800, 560 800, 550 880 
                 S 330 960, 350 1040 
                 C 360 1120, 220 1200, 250 1280"
              stroke="#4B5563"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              opacity="0.4"
              style={{ clipPath }}
              initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            />
          </svg>

          {/* ========== MOBILE Vertical Dashed Line (through icon centers) ========== */}
          <div
            className="absolute left-[9vw] top-[9vw] w-[1px] md:hidden z-0"
            style={{ height: 'calc(100% - 16.66666%)' }}
          >
            <svg className="w-full h-full" preserveAspectRatio="none">
              <motion.line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="#4B5563"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                opacity="0.4"
                style={{
                  clipPath
                }}
                initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
              />
            </svg>
          </div>

          {/* ===== STEPS — wrapped in a grid for mobile uniform height, flex col for desktop ===== */}
          <div className="grid grid-cols-1 auto-rows-[1fr] gap-0 md:flex md:flex-col md:gap-[4vh]">
            {/* ===== STEP 1 — Icon left, text right ===== */}
            <div className="relative flex items-start mob:min-h-[42vw] mob:flex-row mob:gap-[4vw]">
              <div className="md:w-[45%] flex justify-center md:justify-end md:pr-[2vw]">
                <StepIcon image={step1Img} alt="Sourced at the Peak" />
              </div>
              <div className="md:w-[55%] md:pl-[1vw] flex-1">
                <h3 className="font-[Recoleta] font-bold text-[4.5vw] md:text-[1.6vw] mb-1 leading-tight text-black">
                  1. Sourced at the Peak
                </h3>
                <p className="font-[SofiaPro] font-medium text-[3.5vw] md:text-[1.1vw] leading-relaxed text-black mb-1">
                  We work directly with
                </p>
                <p className="font-[Recoleta] font-bold text-secondary text-[8vw] md:text-[2.8vw] leading-none mb-1">
                  10,000+
                </p>
                <p className="font-[SofiaPro] font-medium text-[3.5vw] md:text-[1.1vw] leading-[1.25] text-black max-w-[30vw] mob:max-w-full">
                  farmers, building long-term relationships focused on their growth and your access to
                  peak&nbsp;produce.
                </p>
              </div>
            </div>

            {/* ===== STEP 2 — Icon left on mobile, text-left/icon-right on desktop ===== */}
            <div className="relative flex items-start mob:min-h-[42vw] mob:flex-row mob:gap-[4vw] md:flex-row-reverse">
              <div className="md:w-[45%] md:text-right md:pr-[2vw] flex-1 mob:order-2">
                <h3 className="font-[Recoleta] font-bold text-[4.5vw] md:text-[1.6vw] mb-1 leading-tight text-black">
                  2. Five-Level Quality Check
                </h3>
                <p className="font-[SofiaPro] font-medium text-[3.5vw] md:text-[1.1vw] leading-[1.25] text-black max-w-[30vw] mob:max-w-full md:ml-auto">
                  Every fruit and vegetable passes through five stages of inspection for bruising, marks, condition,
                  and&nbsp;taste.
                </p>
              </div>
              <div className="md:w-[55%] flex justify-center md:justify-start md:pl-[2vw] mob:order-1">
                <StepIcon image={step2Img} alt="Quality Check" />
              </div>
            </div>

            {/* ===== STEP 3 — Icon left, text right ===== */}
            <div className="relative flex items-start mob:min-h-[42vw] mob:flex-row mob:gap-[4vw]">
              <div className="md:w-[55%] flex justify-center md:justify-end md:pr-[2vw]">
                <StepIcon image={step3Img} alt="No Warehousing" />
              </div>
              <div className="md:w-[45%] md:pl-[1vw] flex-1">
                <h3 className="font-[Recoleta] font-bold text-[4.5vw] md:text-[1.6vw] mb-1 leading-tight text-black">
                  3. No Warehousing
                </h3>
                <p className="font-[SofiaPro] font-medium text-[3.5vw] md:text-[1.1vw] leading-[1.25] text-black max-w-[30vw] mob:max-w-full">
                  Produce moves straight from farm to store and is stored under the right conditions. No
                  unnecessary&nbsp;stops.
                </p>
              </div>
            </div>

            {/* ===== STEP 4 — Icon left on mobile, text-left/icon-right on desktop ===== */}
            <div className="relative flex items-start mob:min-h-[42vw] mob:flex-row mob:gap-[4vw] md:flex-row-reverse">
              <div className="md:w-[45%] md:text-right md:pr-[2vw] flex-1 mob:order-2">
                <h3 className="font-[Recoleta] font-bold text-[4.5vw] md:text-[1.6vw] mb-1 leading-tight text-black">
                  4. Packed to Order
                </h3>
                <p className="font-[SofiaPro] font-medium text-[3.5vw] md:text-[1.1vw] leading-[1.25] text-black max-w-[30vw] mob:max-w-full md:ml-auto">
                  When your order comes in, it goes through a last-mile quality check, is stacked mindfully to minimise
                  damage, and dispatched&nbsp;quickly.
                </p>
              </div>
              <div className="md:w-[55%] flex justify-center md:justify-start md:pl-[2vw] mob:order-1">
                <StepIcon image={step4Img} alt="Packed to Order" />
              </div>
            </div>

            {/* ===== STEP 5 — Icon left, text right ===== */}
            <div className="relative flex items-start mob:min-h-[42vw] mob:flex-row mob:gap-[4vw]">
              <div className="md:w-[45%] flex justify-center md:justify-end md:pr-[2vw]">
                <StepIcon image={step5Img} alt="Delivered Fresh" />
              </div>
              <div className="md:w-[45%] md:pl-[1vw] flex-1">
                <h3 className="font-[Recoleta] font-bold text-[4.5vw] md:text-[1.6vw] mb-1 leading-tight text-black">
                  5. Delivered Fresh
                </h3>
                <p className="font-[SofiaPro] font-medium text-[3.5vw] md:text-[1.1vw] leading-[1.25] text-black max-w-[30vw] mob:max-w-full">
                  Handled with care and delivered safely to your&nbsp;door.
                </p>
              </div>
            </div>

            {/* ===== STEP 6 — Icon left on mobile, text-left/icon-right on desktop ===== */}
            <div className="relative flex items-start mob:min-h-[42vw] mob:flex-row mob:gap-[4vw] md:flex-row-reverse">
              <div className="md:w-[45%] md:text-left md:pr-[2vw] flex-1 mob:order-2">
                <h3 className="font-[Recoleta] font-bold text-[4.5vw] md:text-[1.6vw] mb-1 leading-tight text-black">
                  6. We&apos;re There for You
                </h3>
                <p className="font-[SofiaPro] font-medium text-[3.5vw] md:text-[1.1vw] leading-[1.25] text-black max-w-[30vw] mob:max-w-full">
                  Need assistance?
                  <br />
                  Reach out to our customer support team
                  <br />
                  <span className="font-bold text-black">at +91 9900508216.</span>
                </p>
              </div>
              <div className="md:w-[55%] flex justify-center md:justify-start md:pl-[2vw] mob:order-1">
                <StepIcon image={step6Img} alt="Customer Support" />
              </div>
            </div>
          </div>
          {/* end flex col wrapper */}
        </div>
      </div>
    </section>
  );
};

export default OriginOfFresh;
