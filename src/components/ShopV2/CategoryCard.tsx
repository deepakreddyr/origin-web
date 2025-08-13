import { Category } from '@/utilities/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
// import webcat from '/public/assets/images/shop/webcatimg.png'

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
     className="w-[24vw] h-[16vw] mob:w-[40vw] flex flex-col items-center text-center"
    >
      {/* Image */}
      <div className="relative bg-white w-[16vw] h-[10vw] mob:h-[48vw] rounded-[1.2vw] overflow-hidden">
        <Image
          src={cardDetails.website_image || cardDetails.image}
          alt={cardDetails.name || 'product image'}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Category Name */}
      <p className="text-[1.2vw] mob:text-[4vw] pt-2 font-[SofiaPro] font-semibold mt-[0.5vw]">
        {cardDetails.name}
      </p>
    </Link>
  );
};

export default CategoryCard;
