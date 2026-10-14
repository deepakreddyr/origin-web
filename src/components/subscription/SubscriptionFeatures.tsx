import React from 'react';

interface FeatureItem {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#132B1E"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="9" y1="4" x2="9" y2="10" />
        <line x1="4" y1="17" x2="20" y2="17" />
        <line x1="15" y1="14" x2="15" y2="20" />
      </svg>
    ),
    title: 'Choose Your Plan',
    description:
      'Get exactly what you need: crisp field veggies, orchard fruits, or a balanced blend with kitchen herbs.'
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#132B1E"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Find Your Fit',
    description: 'Carefully weighed volumes tailored for couples (2-3 people) or hearty family cooking (4-5 people).'
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#132B1E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4c-3 4-3 8 0 12 3-4 3-8 0-12z" />
        <path d="M12 16C8 13.5 5 15 4 18c3.5 1.5 7 0 8-2z" />
        <path d="M12 16c4-2.5 7-1 8 2-3.5 1.5-7 0-8-2z" />
      </svg>
    ),
    title: <>Explore Seasonal Gems</>,
    description: 'Discover native cultivars and rare heirloom picks curated automatically as seasons evolve.'
  },
  {
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#132B1E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="7" cy="17" r="3" />
        <circle cx="18.5" cy="17.5" r="2.5" />
        <path d="M10 17h6" />
        <path d="M7 14V6h5l3 8h3v1" />
        <path d="M4 17h-.5a1.5 1.5 0 0 1-1.5-1.5V14h4" />
        <path d="M14 6h2" />
      </svg>
    ),
    title: 'Direct From Soil',
    description: 'Fair trade farmgate pay guarantees sustainable stewardship and non-degraded living compost.'
  }
];

interface SubscriptionFeaturesProps {
  className?: string;
}

const SubscriptionFeatures: React.FC<SubscriptionFeaturesProps> = ({ className = '' }) => {
  return (
    <section
      className={`w-full bg-[#F5F3EE] py-[45px] px-4 sm:px-8 lg:px-[54px] overflow-hidden ${className}`}
      style={{
        opacity: 1,
        transform: 'rotate(0deg)'
      }}
    >
      <div className="w-full max-w-[1332px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] lg:gap-[27px] justify-items-center">
        {features.map((item, index) => (
          <div
            key={index}
            className="w-full max-w-[312.75px] min-h-[247px] bg-[#FFFFFF] rounded-[13.5px] p-[27px] pb-[36px] lg:pb-[58.5px] flex flex-col items-start text-left transition-all duration-200 hover:shadow-md"
            style={{
              width: '100%',
              maxWidth: '312.75px',
              minHeight: '247px',
              borderRadius: '13.5px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0px 1.13px 2.25px 0px rgba(0, 0, 0, 0.05)',
              opacity: 1,
              transform: 'rotate(0deg)'
            }}
          >
            {/* Yellow Circular Icon Badge */}
            <div className="w-[36px] h-[36px] rounded-full bg-[#F5A623] flex items-center justify-center mb-[14px] flex-shrink-0">
              {item.icon}
            </div>

            {/* Card Heading */}
            <h3
              className="text-[#132B1E] font-semibold text-[18px] sm:text-[19px] leading-[1.2] w-full max-w-[258.75px] pt-[4.5px] mb-2"
              style={{
                fontFamily: 'Recoleta',
                fontWeight: 600,
                color: '#132B1E',
                maxWidth: '258.75px'
              }}
            >
              {item.title}
            </h3>

            {/* Card Description */}
            <p
              className="text-[#4F5952] w-full max-w-[258.75px]"
              style={{
                fontFamily: 'SofiaPro',
                fontWeight: 400,
                fontSize: '15.75px',
                lineHeight: '23.63px',
                letterSpacing: '0px',
                color: '#4F5952',
                maxWidth: '258.75px'
              }}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SubscriptionFeatures;
