import React from 'react';
import Image from 'next/image';

interface MangoTestimonialCardProps {
  name: string;
  location: string;
  text: string;
  stars: number;
  avatar: string;
}

const MangoTestimonialCard: React.FC<MangoTestimonialCardProps> = ({ name, location, text, stars, avatar }) => {
  return (
    <div
      className="bg-white rounded-[16px] p-8 md:p-8 flex flex-col h-full min-w-[90vw] md:min-w-0 transition-all duration-300"
      style={{ boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="#F2BB00" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          ))}
        </div>
        <div className="relative w-16 h-12 rounded-full">
          <Image src="/assets/images/recipes/testimonialicon.svg" alt="Quote" fill className="object-contain" />
        </div>
      </div>

      <div className="flex-grow">
        <p
          className="text-[#1A1A1A]"
          style={{
            fontFamily: 'SofiaPro',
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: '24px',
            textAlign: 'center'
          }}
        >
          {text}
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
          <Image src={avatar} alt={name} fill className="object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-[#1a1a1a] font-regular text-[16px]" style={{ fontFamily: 'SofiaPro' }}>
            - {name}
          </span>
          <span className="text-[#666666] text-[14px] font-regular" style={{ fontFamily: 'SofiaPro' }}>
            {location}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MangoTestimonialCard;
