import ItemCard from '@/components/shared/ItemCard';
import ProductCardLoader from '@/components/skeletonLoaders/shop/ProductCardLoader';
import React from 'react';
import { useSelector } from 'react-redux';

const CardsWrapper = () => {
  const products = useSelector((state: any) => state.products);
  if (products.isProductListLoading) return <ProductCardLoader />;

  return (
    <div
  className="
    grid
    grid-cols-2
    md:grid-cols-3
    lg:grid-cols-3
    gap-[3vw]
    md:gap-[2vw]
    lg:gap-[3vw]
    w-full
    px-[3vw]
    md:px-[2vw]
    lg:px-[1vw]
  "
>
  {products.productsList?.map((item: any) => (
    <div
      key={item.id}
      className="aspect-[0.85] md:aspect-[0.8] w-full lg:h-[23vw] lg:px-7"
    >
      <ItemCard itemDetails={item} />
    </div>
  ))}
</div>

  );
};

export default CardsWrapper;