import { Category } from '@/utilities/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  cardDetails: Category;
}
const CategoryCard = (props: Props) => {
  const { cardDetails } = props;
  return (
    <Link
      replace
      href={`/shop/${cardDetails.name.replace(/ /g, '-').toLowerCase()}/${cardDetails?.id}/${cardDetails?.sub_categories[0].name
        .replace(/ /g, '-')
        .toLowerCase()}/${cardDetails?.sub_categories[0].id}`}
      className="w-[15vw] mob:w-[40vw] mob:h-[48vw] h-[13.48vw] rounded-[1.67vw]  overflow-hidden"
    >
      <p className="text-[1.528vw] absolute z-[1] font-[SofiaPro] font-semibold pl-[1.1vw] pt-[1.1vw] ">
        {cardDetails.name}
      </p>
      <div className="">
        <div className="w-[15vw]  rounded-br-[1.67vw] h-[13.8vw]  relative  ">
          <Image
            className="rounded-br-[1.67vw] "
            src={cardDetails.image}
            alt={cardDetails.name ? cardDetails.name : 'product image'}
            fill
          />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
