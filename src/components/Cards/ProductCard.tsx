import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import React from 'react';
import Price from '../Price/Price';
import ProductOptions from '../ProductOptions/ProductOptions';
import Weight from '../Weight/Weight';
import AddToCartButton from '../AddToCardButton';
import { Product } from '../../utilities/types';
import classNames from 'classnames';

type ProductCardProps = {
  product: Product;
  className?: string;
};

const ProductCard = ({ product, className }: ProductCardProps) => {
  const {
    name: title,
    weight,
    price,
    image,
    description,
    shortDescription,
    configurableOptions,
    stockStatus
  } = product;
  return (
    <article className={classNames('w-full ', className)}>
      <Image
        src={image}
        alt={title}
        className="block rounded-[10px] md:rounded-3xl w-full md:aspect-[238/223] aspect-[165/150] object-cover"
        width={200}
        height={200}
        priority={true}
      />
      <Typography className="mt-3 md:mt-5 font-medium text-sm md:text-lg" variant="body1">
        {title}
      </Typography>
      <Typography className="mt-1 line-clamp-2 font-semibold text-xs md:text-base" variant="body1">
        {shortDescription}
      </Typography>
      <Box className="flex justify-between items-end gap-2 mt-2 md:mt-4">
        <Box className="flex flex-col">
          <Weight className="mb-[5px] md:mb-0 text-black-op-50 text-sm" weight={weight} variant="body1" />
          <Price classes={{ firstPrice: 'hidden', secondPrice: 'text-sm' }} price={price} />
        </Box>
        <Box className="flex pointer-events-auto">
          {configurableOptions && configurableOptions.length > 1 ? (
            <ProductOptions
              stockStatus={stockStatus}
              label={null}
              product={product}
              firstOption={{ productName: title, image, configurableOptions }}
              classes={{
                outOfStockBtn: 'sm:px-4 sm:py-2 md:px-[16px!important] md:py-[8px!important]',
                dropdownBtn: 'md:px-[16px!important] md:py-[8px!important] lg:px-4 lg:py-2',
                dropdownBtnText: 'md:text-sm',
                dropdownBtnIconOne: 'md:w-3.5',
                outOfStockBtnText: 'md:text-sm'
              }}
            />
          ) : (
            <AddToCartButton
              classes={{
                buttonText: 'text-xs md:text-sm',
                iconOne: 'w-2.5 h-2.5',
                outOfStockBtnTextClass: 'text-xs md:text-sm'
              }}
              product={product}
            />
          )}
        </Box>
      </Box>
    </article>
  );
};

export default ProductCard;
