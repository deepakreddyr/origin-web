import ItemCard from '@/components/shared/ItemCard';
import ProductCardLoader from '@/components/skeletonLoaders/shop/ProductCardLoader';
import React from 'react';
import { useSelector } from 'react-redux';

const CardsWrapper = (props: any) => {
  const products = useSelector((state: any) => state.products);

  if (products.isProductListLoading) return <ProductCardLoader />;
  return (
    <div className="grid grid-cols-4 mob:items-center mob:grid-cols-2 gap-[1vw] mob:gap-[3.2vw]">
      {products.productsList?.map((item: any) => (
        <div className="pl-[1.8vw] pb-[4vw] ">
          <ItemCard itemDetails={item} key={item.id} />
        </div>
      ))}
    </div>
  );
};

export default CardsWrapper;
