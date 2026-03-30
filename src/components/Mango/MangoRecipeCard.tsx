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
  return (
    <Link
      href={`/mango/recipes/${slug}`}
      className={`group block bg-white rounded-[16px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 transform hover:-translate-y-1 ${
        isLarge ? 'h-full' : ''
      }`}
    >
      <div className={`relative ${isLarge ? 'h-[360px] md:h-[450px]' : 'h-[160px] md:h-[200px]'}`}>
        <Image
          src={imgSrc}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>
      <div className={`${isLarge ? 'p-6 md:p-8' : 'p-4 md:p-6'}`}>
        <div className="flex items-center gap-4 mb-4">
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
        <p
          className={`${
            isLarge ? 'text-2xl md:text-[28px]' : 'text-lg md:text-[1.2vw]'
          } font-bold text-[#000000] leading-tight group-hover:underline`}
          style={{ fontFamily: 'SofiaPro' }}
        >
          {name}
        </p>
      </div>
    </Link>
  );
};

export default MangoRecipeCard;
