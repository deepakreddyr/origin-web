'use client';
import React, { useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent } from 'framer-motion';
import step1Img from '/public/assets/images/about/aboutimg1.webp';
import step2Img from '/public/assets/images/about/aboutimg2.webp';
import step3Img from '/public/assets/images/about/aboutimg3.webp';
import step4Img from '/public/assets/images/about/aboutimg4.webp';
import step5Img from '/public/assets/images/about/aboutimg5.webp';

// ── Sub-component: StepContent ──
interface StepContentProps {
  stepNumber: string;
  title: string;
  description: string;
  align?: 'left' | 'right';
}

const StepContent: React.FC<StepContentProps> = ({ stepNumber, title, description, align = 'left' }) => {
  const parts = description.split('\n');

  return (
    <div
      className={`flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start text-left'} w-full select-none`}
    >
      <span className="font-[SofiaPro] uppercase text-[#FFB600] mb-1 md:mb-2 font-[400] text-[10px] md:text-[24px] leading-[14px] md:leading-[27.32px]">
        {stepNumber}
      </span>
      <h3
        className={`font-[Recoleta] text-[#231F20] mb-2 md:mb-3 font-[600] text-[15.78px] md:text-[27.32px] leading-[22.09px] md:leading-[38.25px] ${align === 'right' ? 'text-right' : 'text-left'}`}
      >
        {title}
      </h3>
      <p
        className={`font-[SofiaPro] text-[#00000099] max-w-full md:max-w-[800px] font-[400] text-[13.86px] md:text-[24px] leading-[16.92px] md:leading-[29.3px] ${align === 'right' ? 'text-right' : 'text-left'}`}
      >
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && <br className="hidden md:inline" />}
            {index < parts.length - 1 && <span className="inline md:hidden"> </span>}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
};

// ── Sub-component: StepImageNode (replaces the icon circle) ──
interface StepImageNodeProps {
  src: StaticImageData;
  alt: string;
  innerRef?: React.RefObject<HTMLDivElement>;
}

const StepImageNode: React.FC<StepImageNodeProps> = ({ src, alt, innerRef }) => (
  <motion.div
    ref={innerRef}
    initial={{ opacity: 0, scale: 0.92 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: '-20px' }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="relative z-10 shrink-0 overflow-hidden rounded-[16px] md:rounded-[20px] w-[50px] h-[50px] md:w-[100px] md:h-[100px]"
  >
    <Image src={src} alt={alt} fill className="object-cover object-center" sizes="(max-width: 768px) 50px, 100px" />
  </motion.div>
);

// ── Animated Yellow Dot ──
interface ScrollDotProps {
  containerRef: React.RefObject<HTMLDivElement>;
  lineTop: number;
  lineBottom: number;
}

const ScrollDot: React.FC<ScrollDotProps> = ({ containerRef, lineTop, lineBottom }) => {
  const [containerHeight, setContainerHeight] = React.useState(0);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerHeight(el.offsetHeight);
    const ro = new ResizeObserver(() => setContainerHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center']
  });

  // Target top position based on scroll progress
  // We want the bike to travel a bit PAST the final center so it can park below it
  const maxTravel = containerHeight > 0 ? lineTop + (containerHeight - lineBottom - lineTop) + 50 : containerHeight;

  const targetTop = useTransform(scrollYProgress, [0, 1], [lineTop, maxTravel]);

  // Persistent top position that never goes back up
  const persistentTop = useMotionValue(lineTop);
  const maxTopRef = React.useRef(lineTop);

  // Keep track of lineTop updates from dynamic client measurements
  React.useEffect(() => {
    if (maxTopRef.current < lineTop) {
      maxTopRef.current = lineTop;
      persistentTop.set(lineTop);
    }
  }, [lineTop, persistentTop]);

  useMotionValueEvent(targetTop, 'change', (latest) => {
    if (latest > maxTopRef.current) {
      maxTopRef.current = latest;
      persistentTop.set(latest);
    }
  });

  // Calculate dynamic paths for the bike parking
  const rotateInput = [0, 1];
  const rotateOutput = [90, 90];
  const xInput = [0, 1];
  const xOutput = ['-50%', '-50%'];

  if (containerHeight > 0) {
    const totalDist = containerHeight - lineBottom - lineTop;
    const finalCenter = lineTop + totalDist;

    rotateInput.length = 0;
    rotateOutput.length = 0;
    xInput.length = 0;
    xOutput.length = 0;

    // Build parking rotation & translation array
    // Happens between finalCenter and finalCenter + 50 (closer to the last step)
    rotateInput.push(0, finalCenter, finalCenter + 50);
    rotateOutput.push(90, 90, -35);

    xInput.push(0, finalCenter, finalCenter + 50);
    xOutput.push('-50%', '-50%', '10%'); // Shifts slightly to the right side
  }

  const bikeRotate = useTransform(persistentTop, rotateInput, rotateOutput);
  const bikeX = useTransform(persistentTop, xInput, xOutput);

  return (
    <motion.div
      className="absolute left-1/2 pointer-events-none z-0"
      style={{
        top: persistentTop,
        x: bikeX,
        translateY: '-50%',
        rotate: bikeRotate
      }}
    >
      <Image
        src="/assets/svg/originoffreshbike.svg"
        alt="Origin of Fresh Bike"
        width={72}
        height={44}
        className="object-contain"
      />
    </motion.div>
  );
};
// ── Mobile Timeline Icons ──
const TractorIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#231F20"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
    <path d="M5 17H3v-2.13a.8.8 0 0 1 .53-.75L9 12h5l3 3v2h-2" />
    <path d="M11 12V8h4v4" />
  </svg>
);
const QualityIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#231F20"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2l3.09 1.68 3.52-.39 1.13 3.35 2.87 2.05-1.57 3.17 1.57 3.17-2.87 2.05-1.13 3.35-3.52-.39L12 22l-3.09-1.68-3.52.39-1.13-3.35-2.87-2.05 1.57-3.17-1.57-3.17 2.87-2.05 1.13-3.35 3.52.39L12 2z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const BoxIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#231F20"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);
const OpenBoxIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#231F20"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);
const TruckIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#231F20"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

// ── Main Component ──
const OriginOfFresh = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const firstNodeRef = useRef<HTMLDivElement>(null);
  const lastNodeRef = useRef<HTMLDivElement>(null);

  const [lineTop, setLineTop] = React.useState(50);
  const [lineBottom, setLineBottom] = React.useState(90);

  React.useEffect(() => {
    const measure = () => {
      const timelineEl = timelineRef.current;
      const firstEl = firstNodeRef.current;
      const lastEl = lastNodeRef.current;
      if (timelineEl && firstEl && lastEl) {
        const timelineRect = timelineEl.getBoundingClientRect();
        const firstRect = firstEl.getBoundingClientRect();
        const lastRect = lastEl.getBoundingClientRect();

        const topOffset = firstRect.top + firstRect.height / 2 - timelineRect.top;
        const bottomOffset = timelineRect.bottom - (lastRect.top + lastRect.height / 2);

        setLineTop(topOffset);
        setLineBottom(bottomOffset);
      }
    };

    // Measure initially and on load/resize events
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);

    // Fallback timer to ensure layout has settled
    const timer = setTimeout(measure, 100);

    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
      clearTimeout(timer);
    };
  }, []);

  const steps = [
    {
      stepNumber: 'STEP 01',
      title: 'Sourced at the Peak',
      description:
        'We work directly with 10,000+\nfarmers, building long-term\nrelationships focused on their growth\nand youraccess to peak produce.',
      image: step1Img,
      icon: <TractorIcon />
    },
    {
      stepNumber: 'STEP 02',
      title: 'Five-Level Quality Check',
      description:
        'Every fruit and vegetable passes\nthrough five stages of inspection for\nbruising, marks, condition, and taste.',
      image: step2Img,
      icon: <QualityIcon />
    },
    {
      stepNumber: 'STEP 03',
      title: 'No Warehousing',
      description:
        'Produce moves straight from farm to\nstore and is stored under the right\nconditions. No unnecessary stops.',
      image: step3Img,
      icon: <BoxIcon />
    },
    {
      stepNumber: 'STEP 04',
      title: 'Packed to Order',
      description:
        'When your order comes in, it goes through\na last-mile quality check, is stacked\nmindfully and dispatched quickly.',
      image: step4Img,
      icon: <OpenBoxIcon />
    },
    {
      stepNumber: 'STEP 05',
      title: 'Delivered Fresh',
      description: 'Handled with care and delivered safely\nto your door within 24 hours of harvest.',
      image: step5Img,
      icon: <TruckIcon />
    }
  ];

  return (
    <section className="w-full bg-white pt-[10vw] md:pt-[1vw] px-0 md:px-[6vw] relative overflow-hidden">
      {/* Title */}
      <div className="max-w-[1280px] mx-auto text-center mb-10 md:mb-20">
        <h2 className="font-[Recoleta] font-bold text-[26px] md:text-[5vw] lg:text-[3.8vw] leading-[1.2] text-[#231F20]">
          Let&apos;s go to the <span className="text-[#137A3F]">Origin of Fresh</span>
        </h2>
      </div>

      {/* ── Desktop Timeline ── */}
      <div ref={timelineRef} className="relative w-full mx-auto hidden md:block pb-10">
        {/* Black dashed vertical line — spans first-to-last image center */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-0"
          style={{
            width: '2.8px',
            borderLeft: '2.8px dashed #000000',
            top: `${lineTop}px`,
            bottom: `${lineBottom}px`
          }}
        />

        {/* Animated yellow dot */}
        <ScrollDot
          containerRef={timelineRef as React.RefObject<HTMLDivElement>}
          lineTop={lineTop}
          lineBottom={lineBottom}
        />

        <div className="grid grid-cols-1 gap-16 auto-rows-fr">
          {steps.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-[1fr_auto_1fr] items-center w-full relative z-10"
              >
                {/* Left — text if even, empty if odd */}
                <div className="flex justify-end pr-[105px]">
                  {isLeft && (
                    <StepContent
                      stepNumber={step.stepNumber}
                      title={step.title}
                      description={step.description}
                      align="right"
                    />
                  )}
                </div>

                {/* Center — image replaces icon */}
                <StepImageNode
                  innerRef={i === 0 ? firstNodeRef : i === steps.length - 1 ? lastNodeRef : undefined}
                  src={step.image}
                  alt={step.title}
                />

                {/* Right — text if odd, empty if even */}
                <div className="flex justify-start pl-[105px]">
                  {!isLeft && (
                    <StepContent
                      stepNumber={step.stepNumber}
                      title={step.title}
                      description={step.description}
                      align="left"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile Timeline ── */}
      <div
        className="relative w-full max-w-[589.11px] mx-auto md:hidden pb-10"
        style={{ paddingLeft: '10.52px', paddingRight: '10.52px' }}
      >
        {/* Black dashed line */}
        <div
          className="absolute top-8 bottom-12 z-0"
          style={{ left: 'calc(10.52px + 25px)', width: '1px', borderLeft: '1px dashed #000000' }}
        />

        <div className="flex flex-col gap-10 relative z-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
              className="flex flex-row items-center gap-12 md:gap-5"
            >
              {/* Image Timeline Node */}
              <StepImageNode src={step.image} alt={step.title} />
              {/* Text */}
              <div>
                <StepContent
                  stepNumber={step.stepNumber}
                  title={step.title}
                  description={step.description}
                  align="left"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OriginOfFresh;
