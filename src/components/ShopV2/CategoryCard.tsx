import { Category } from '@/utilities/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  cardDetails: Category;
}

const CategoryCard = (props: Props) => {
  const { cardDetails } = props;

  const href = `/shop/${cardDetails.name.replace(/ /g, '-').toLowerCase()}/${cardDetails?.id}/${cardDetails?.sub_categories[0].name
    .replace(/ /g, '-')
    .toLowerCase()}/${cardDetails?.sub_categories[0].id}`;

  return (
    <Link
      replace
      href={href}
      className="w-[16vw] h-[16vw] mob:w-[40vw] flex flex-col items-center text-center"
    >
      {/* Image */}
      <div className="relative w-full h-[16vw] mob:h-[48vw] rounded-[1.67vw] overflow-hidden">
        <Image
          src={cardDetails.website_image || cardDetails.image}
          alt={cardDetails.name || 'product image'}
          fill
          className="object-contain p-[1vw]"
          priority
        />
      </div>

      {/* Category Name */}
      <p className="text-[1.2vw] mob:text-[4vw] font-[SofiaPro] font-semibold mt-[0.5vw]">
        {cardDetails.name}
      </p>
    </Link>
  );
};

export default CategoryCard;
