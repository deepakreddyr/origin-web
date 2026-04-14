import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar } from 'lucide-react';

interface MangoRecipeCardProps {
  slug: string;
  name: string;
  tag: string;
  date: string;
  imgSrc: string;
  isLarge?: boolean;
}

const MangoRecipeCard: React.FC<MangoRecipeCardProps> = ({ slug, name, tag, date, imgSrc, isLarge }) => {
  const mobileCopyMapping: Record<string, { name: string; date: string; tag: string }> = {
    'mango-chaat': { name: 'Zesty Mango Chaat', date: '15 mins', tag: 'Spicy & Sweet' },
    'mango-popsicles': { name: 'Mango Popsicles', date: '4 hours', tag: 'Pure Fruit' },
    'mango-cucumber-salsa': { name: 'Cucumber Salsa', date: '10 mins', tag: 'Refreshing' }
  };

  return (
    <Link
      href={`/mango/recipes/${slug}`}
      className={`group block bg-white rounded-[16px] md:rounded-[16px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 transform hover:-translate-y-1 ${
        isLarge ? 'h-full' : ''
      }`}
    >
      <div className="flex flex-row md:flex-col h-[120px] md:h-full p-3 md:p-0">
        {/* Image Section */}
        <div
          className={`relative flex-shrink-0 ${isLarge ? 'w-[96px] h-[96px] md:w-full md:h-[450px]' : 'w-[96px] h-[96px] md:w-full md:h-[200px]'} rounded-[12px] md:rounded-none overflow-hidden`}
        >
          <Image
            src={imgSrc}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>

        {/* Text Section */}
        <div className={`flex flex-col justify-center flex-1 ml-4 md:ml-0 ${isLarge ? 'md:p-8' : 'md:p-6'}`}>
          {/* Desktop Metadata (Icons) */}
          <div className="hidden md:flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Image src="/assets/images/recipes/recipesavatar.svg" alt="" width={18} height={18} />
              <span className="text-[17px] font-regular text-[#1a1a1a] opacity-90" style={{ fontFamily: 'SofiaPro' }}>
                {tag}
              </span>
            </div>
            <div className="w-[1px] h-3 bg-[#1a1a1a] opacity-20" />
            <div className="flex items-center gap-2">
              <Calendar size={18} stroke="#FFD74F" strokeWidth={2.5} />
              <span className="text-[17px] font-regular text-[#1a1a1a] opacity-90" style={{ fontFamily: 'SofiaPro' }}>
                {date}
              </span>
            </div>
          </div>

          {/* Desktop Name */}
          <p
            className={`hidden md:block ${
              isLarge ? 'md:text-2xl md:text-[28px]' : 'md:text-lg md:text-[1.2vw]'
            } font-bold text-[#000000] leading-tight group-hover:underline`}
            style={{ fontFamily: 'SofiaPro' }}
          >
            {name}
          </p>

          {/* Mobile Name */}
          <p
            className={`block md:hidden text-[18px] font-bold text-[#000000] leading-tight mb-0.5`}
            style={{ fontFamily: 'SofiaPro' }}
          >
            {mobileCopyMapping[slug]?.name || name}
          </p>

          {/* Mobile Metadata (Text only) */}
          <div className="flex md:hidden items-center mb-1.5">
            {/* <span className="text-[12px] font-regular text-[#1a1a1a] opacity-50" style={{ fontFamily: 'SofiaPro' }}>
              {mobileCopyMapping[slug]?.date || date}
            </span> */}
            <span className="text-[#1a1a1a] opacity-50">•</span>
            <span className="text-[15px] font-regular text-[#1a1a1a] opacity-50" style={{ fontFamily: 'SofiaPro' }}>
              {mobileCopyMapping[slug]?.tag || tag}
            </span>
          </div>

          <span
            className="flex md:hidden text-[12px] font-bold text-[#146321] uppercase tracking-wider"
            style={{ fontFamily: 'SofiaPro' }}
          >
            READ RECIPE
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MangoRecipeCard;
