import React from 'react';

interface HarvestStep {
  step: string;
  time: string;
  description: string;
  tag: string;
}

const STEPS: HarvestStep[] = [
  {
    step: '01',
    time: 'Friday 6:00 PM',
    description: 'Box customizer closes. Our partner farmers in Baramati review your crop specifications.',
    tag: 'Crop Lock'
  },
  {
    step: '02',
    time: 'Saturday 5:30 AM',
    description: 'Selective hand picking while dew rests on leaves to preserve crisp cellular turgor.',
    tag: 'Dawn Harvest'
  },
  {
    step: '03',
    time: 'Saturday 4:00 PM',
    description: 'Gentle ozone bath wash, aerated drying, and careful packing in natural wood wool crates.',
    tag: 'Zero Plastic Wrap'
  },
  {
    step: '04',
    time: 'Sunday 7:30 AM',
    description: 'Delivered to your doorstep in insulated electric delivery vans across the metro.',
    tag: 'Chilled Kitchen Drop'
  }
];

interface SubscriptionHarvestSequenceProps {
  className?: string;
}

const SubscriptionHarvestSequence: React.FC<SubscriptionHarvestSequenceProps> = ({ className = '' }) => {
  return (
    <section className={`w-full py-12 lg:py-16 text-left ${className}`}>
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span
            className="text-[#8D4320] font-bold text-[11px] uppercase tracking-[0.14em] block mb-2"
            style={{ fontFamily: 'SofiaPro' }}
          >
            FARM-TO-KITCHEN CYCLE
          </span>
          <h2
            className="text-[#132B1E] font-semibold text-[30px] sm:text-[38px] leading-tight m-0"
            style={{ fontFamily: 'Recoleta' }}
          >
            The 24-Hour Harvesting Sequence
          </h2>
        </div>

        <p
          className="text-[#556057] text-[13.5px] sm:text-[14.5px] max-w-[420px] leading-[22px] m-0"
          style={{ fontFamily: 'SofiaPro' }}
        >
          Unlike supermarket produce kept in nitrogen cold rooms for 2–3 weeks, your box is harvested at dawn
          specifically for your address.
        </p>
      </div>

      {/* 4 Steps Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((s) => (
          <div
            key={s.step}
            className="bg-white rounded-[16px] p-5 sm:p-6 border border-[#EBE8E0] shadow-[0px_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <div>
              {/* Big Number */}
              <span
                className="text-[#96C7A8] font-bold text-[36px] sm:text-[40px] leading-none block mb-2"
                style={{ fontFamily: 'Recoleta' }}
              >
                {s.step}
              </span>

              {/* Time */}
              <h3
                className="text-[#132B1E] font-bold text-[15px] sm:text-[16px] leading-tight mb-2"
                style={{ fontFamily: 'SofiaPro' }}
              >
                {s.time}
              </h3>

              {/* Description */}
              <p
                className="text-[#556057] text-[13px] sm:text-[13.5px] leading-[20px] mb-4"
                style={{ fontFamily: 'SofiaPro' }}
              >
                {s.description}
              </p>
            </div>

            {/* Step Tag */}
            <div className="pt-2">
              <span
                className="text-[#8D4320] font-bold text-[11px] tracking-wider uppercase"
                style={{ fontFamily: 'SofiaPro' }}
              >
                {s.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SubscriptionHarvestSequence;
