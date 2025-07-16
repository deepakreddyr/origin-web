import { Category } from '@/utilities/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import catimg from '/public/assets/images/shop/catimage.webp';

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
      className="w-[15vw] mob:w-[40vw] mob:h-[48vw] h-[13.48vw] rounded-[1.67vw] overflow-hidden flex flex-col justify-start relative"
    >
      {/* Category Name */}
      <p className="text-[1.528vw] mob:text-[4vw] absolute z-[1] font-[SofiaPro] font-semibold pl-[1.1vw] pt-[1.1vw]">
        {cardDetails.name}
      </p>

      {/* Image */}
      <div className="relative  h-full rounded-br-[1.67vw]">
        <Image
          src={cardDetails.website_image || cardDetails.image}
          // src={catimg}
          alt={cardDetails.name || 'product image'}
          fill
          className="object-contain rounded-br-[1.67vw] p-[1vw]"
          priority
        />
      </div>
    </Link>
  );
};

export default CategoryCard;
