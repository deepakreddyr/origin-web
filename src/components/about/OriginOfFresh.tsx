import React from 'react';
import { motion } from 'framer-motion';

// ── Icons ──
const TractorIcon = () => (
  <svg
    className="w-5 h-5 text-black"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="5" cy="18" r="3" />
    <circle cx="18" cy="15" r="5" />
    <path d="M8 18h5v-5H9l-1-2h4v-3H9L7 6H3v2h2l1 3H2v2h3" />
    <path d="M13 18v-5" />
  </svg>
);

const SealCheckIcon = () => (
  <svg
    className="w-5 h-5 text-black"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2c-.874 0-1.6.516-1.916 1.258a2 2 0 0 1-2.454 1.173c-.83-.277-1.713.118-2.1.848a2 2 0 0 1-1.905 1.905c-.73.387-1.125 1.27-.848 2.1a2 2 0 0 1-1.173 2.454C1.516 10.4 1 11.126 1 12c0 .874.516 1.6 1.258 1.916a2 2 0 0 1 1.173 2.454c-.277.83.118 1.713.848 2.1a2 2 0 0 1 1.905 1.905c.387.73 1.27 1.125 2.1.848a2 2 0 0 1 2.454 1.173C10.4 22.484 11.126 23 12 23c.874 0 1.6-.516 1.916-1.258a2 2 0 0 1 2.454-1.173c.83.277 1.713-.118 2.1-.848a2 2 0 0 1 1.905-1.905c.73-.387 1.125-1.27.848-2.1a2 2 0 0 1 1.173-2.454a2 2 0 0 1-1.173-2.454c.277-.83-.118-1.713-.848-2.1a2 2 0 0 1-1.905-1.905c-.387-.73-1.27-1.125-2.1-.848a2 2 0 0 1-2.454-1.173C13.6 2.516 12.874 2 12 2z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const PackageIcon = () => (
  <svg
    className="w-5 h-5 text-black"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const FlatBoxIcon = () => (
  <svg
    className="w-5 h-5 text-black"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M12 12h.01M3 12h18" />
  </svg>
);

const TruckIcon = () => (
  <svg
    className="w-5 h-5 text-black"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

// ── Sub-component: StepNode ──
interface StepNodeProps {
  icon: React.ReactNode;
}

const StepNode: React.FC<StepNodeProps> = ({ icon }) => {
  return (
    <div
      className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#FFB600] flex items-center justify-center z-10 relative shrink-0"
      style={{ boxShadow: '0px 3.41px 3.41px 0px rgba(0, 0, 0, 0.25)' }}
    >
      {icon}
    </div>
  );
};

// ── Sub-component: StepContent ──
interface StepContentProps {
  stepNumber: string;
  title: string;
  description: string;
  align?: 'left' | 'right';
}

const StepContent: React.FC<StepContentProps> = ({ stepNumber, title, description, align = 'left' }) => {
  return (
    <div
      className={`flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start text-left'} w-full select-none`}
    >
      <span className="font-[SofiaPro] font-bold text-[11px] md:text-[12px] tracking-widest uppercase mb-1.5 text-[#FFB600]">
        {stepNumber}
      </span>
      <h3 className="font-[Recoleta] font-bold text-[20px] md:text-[23px] text-[#231F20] mb-2 leading-tight">
        {title}
      </h3>
      <p
        className={`font-[SofiaPro] font-regular text-[13.5px] md:text-[14px] text-[#00000099] leading-relaxed max-w-[400px]`}
      >
        {description}
      </p>
    </div>
  );
};

// ── Main Component ──
const OriginOfFresh = () => {
  const steps = [
    {
      icon: <TractorIcon />,
      stepNumber: 'STEP 01',
      title: 'Sourced at the Peak',
      description:
        'We work directly with 10,000+ farmers, building long-term relationships focused on their growth and your access to peak produce.'
    },
    {
      icon: <SealCheckIcon />,
      stepNumber: 'STEP 02',
      title: 'Five-Level Quality Check',
      description:
        'Every fruit and vegetable passes through five stages of inspection for bruising, marks, condition, and taste.'
    },
    {
      icon: <PackageIcon />,
      stepNumber: 'STEP 03',
      title: 'No Warehousing',
      description:
        'Produce moves straight from farm to store and is stored under the right conditions. No unnecessary stops.'
    },
    {
      icon: <FlatBoxIcon />,
      stepNumber: 'STEP 04',
      title: 'Packed to Order',
      description:
        'When your order comes in, it goes through a last-mile quality check, is stacked mindfully and dispatched quickly.'
    },
    {
      icon: <TruckIcon />,
      stepNumber: 'STEP 05',
      title: 'Delivered Fresh',
      description: 'Handled with care and delivered safely to your door within 24 hours of harvest.'
    }
  ];

  return (
    <section className="w-full bg-white py-[10vh] md:py-[12vh] px-[6vw] relative overflow-hidden">
      {/* Title */}
      <div className="max-w-[1280px] mx-auto text-center mb-16 md:mb-20">
        <h2 className="font-[Recoleta] font-bold text-[8.5vw] md:text-[5vw] lg:text-[3.8vw] leading-tight text-[#231F20]">
          Let&apos;s go to the <span className="text-[#137A3F]">Origin of Fresh</span>
        </h2>
      </div>

      {/* ── Desktop Timeline (Alternate Left/Right) ── */}
      <div className="relative max-w-[1000px] mx-auto hidden md:block pb-10">
        {/* Straight Vertical Dotted/Dashed Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-7 bottom-7 w-0 border-l border-dashed border-[#7A7570] opacity-40 z-0" />

        <div className="flex flex-col gap-14">
          {steps.map((step, i) => {
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-[1fr_auto_1fr] items-center w-full relative z-10"
              >
                {/* Left Side */}
                <div className="flex justify-end pr-10">
                  {isLeft && (
                    <StepContent
                      stepNumber={step.stepNumber}
                      title={step.title}
                      description={step.description}
                      align="right"
                    />
                  )}
                </div>

                {/* Center Node */}
                <StepNode icon={step.icon} />

                {/* Right Side */}
                <div className="flex justify-start pl-10">
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

      {/* ── Mobile Timeline (Left Node, Right Content) ── */}
      <div className="relative max-w-[600px] mx-auto md:hidden pl-4 pr-2 pb-6">
        {/* Vertical Dashed Line on Left */}
        <div className="absolute left-[39px] top-6 bottom-6 w-0 border-l border-dashed border-[#7A7570] opacity-40 z-0" />

        <div className="flex flex-col gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
              className="flex items-start gap-6 relative z-10"
            >
              <StepNode icon={step.icon} />
              <div className="pt-1.5 flex-1">
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
