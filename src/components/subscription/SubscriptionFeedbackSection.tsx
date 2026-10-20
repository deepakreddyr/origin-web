import React, { useState } from 'react';

interface SubscriptionFeedbackSectionProps {
  className?: string;
  onSubmitFeedback?: (feedback: string) => void;
}

const SubscriptionFeedbackSection: React.FC<SubscriptionFeedbackSectionProps> = ({
  className = '',
  onSubmitFeedback
}) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitFeedback) {
      onSubmitFeedback(feedback);
    }
    setIsSubmitted(true);
  };

  return (
    <section className={`w-full bg-[#FBF9F4] py-12 lg:py-16 px-4 sm:px-6 lg:px-[54px] ${className}`}>
      {/* Main Container (1332px x 488.5px layout, gap: 27px) */}
      <div
        className="w-full max-w-[1332px] mx-auto min-h-[488.5px] mob:min-h-0 flex flex-col justify-start text-left gap-[27px] mob:gap-6"
        style={{
          width: '100%',
          maxWidth: '1332px',
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
      >
        {/* Header Block */}
        <div className="flex flex-col text-left">
          {/* Eyebrow / Tag */}
          <span
            className="text-[#8D4320] font-bold text-[11px] sm:text-[12px] uppercase tracking-[0.14em] mb-2 sm:mb-2.5 block"
            style={{ fontFamily: 'SofiaPro' }}
          >
            SHARE YOUR SHOPPING EXPERIENCE
          </span>

          {/* Heading */}
          <h2
            className="text-[#132B1E] font-semibold text-[45px] mob:text-[26px] mob:leading-[1.15] sm:text-[36px] sm:leading-[1.2] lg:text-[45px] lg:leading-[56.25px] mb-2 sm:mb-3 tracking-tight"
            style={{
              fontFamily: 'Recoleta',
              fontWeight: 600,
              letterSpacing: '-0.68px',
              verticalAlign: 'middle'
            }}
          >
            Help us improve your harvest experience
          </h2>

          {/* Description */}
          <p
            className="text-[#556057] text-[18px] leading-[27px] mob:text-[15px] mob:leading-[22px] max-w-[900px] m-0"
            style={{
              fontFamily: 'SofiaPro',
              fontWeight: 400,
              letterSpacing: '0%',
              verticalAlign: 'middle'
            }}
          >
            Whether you purchased today or decided to explore later, your feedback helps us refine our seasonal
            curation, delivery timing, and product quality.
          </p>
        </div>

        {/* Feedback Card */}
        <div
          className="w-full bg-white rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 lg:p-9 shadow-[0px_2px_12px_rgba(0,0,0,0.03)] border border-[#EBE8E0]/70 flex flex-col justify-between"
          style={{
            borderRadius: '16px'
          }}
        >
          {isSubmitted ? (
            <div className="py-10 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F3EB] text-[#132B1E] flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-[#132B1E] font-semibold text-[22px]" style={{ fontFamily: 'Recoleta' }}>
                Thank you for your feedback!
              </h3>
              <p className="text-[#556057] text-[15px]" style={{ fontFamily: 'SofiaPro' }}>
                Your insights help us bring the freshest harvests to your table.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
              {/* Card Title & Subtitle */}
              <div className="flex flex-col gap-1 text-left">
                <h3
                  className="text-[#132B1E] font-semibold text-[20px] sm:text-[22px] leading-tight m-0"
                  style={{ fontFamily: 'Recoleta' }}
                >
                  Tell us about your visit
                </h3>
                <p className="text-[#556057] text-[14px] sm:text-[15px] m-0" style={{ fontFamily: 'SofiaPro' }}>
                  Bought a basket or still deciding? Tell us what worked well and what we could improve.
                </p>
              </div>

              {/* Textarea */}
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share any other thoughts about the plans, delivery window, or product selection"
                className="w-full min-h-[115px] sm:min-h-[125px] bg-[#F7F5F0] rounded-[12px] p-4 sm:p-5 text-[#132B1E] placeholder-[#8C948D] text-[14px] sm:text-[15px] border border-transparent focus:border-[#E0DAD0] focus:bg-white focus:outline-none transition-all duration-200 resize-none"
                style={{ fontFamily: 'SofiaPro' }}
              />

              {/* Submit Button */}
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="w-full max-w-[280px] h-[44px] rounded-full bg-[#F5A623] hover:bg-[#E0961B] text-[#132B1E] font-semibold text-[14px] flex items-center justify-center transition-colors duration-200 shadow-xs cursor-pointer"
                  style={{ fontFamily: 'SofiaPro' }}
                >
                  Submit feedback
                </button>
              </div>

              {/* Footer Note */}
              <div className="text-left pt-1">
                <span className="text-[#7A837A] text-[12px] sm:text-[13px]" style={{ fontFamily: 'SofiaPro' }}>
                  Thank you for helping us improve Origin Fresh.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionFeedbackSection;
