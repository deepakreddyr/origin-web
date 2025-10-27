import ItemCard from '@/components/shared/ItemCard';
import ProductCardLoader from '@/components/skeletonLoaders/shop/ProductCardLoader';
import React from 'react';
import { useSelector } from 'react-redux';

const CardsWrapper = () => {
  const products = useSelector((state: any) => state.products);
  if (products.isProductListLoading) return <ProductCardLoader />;
  
  return (
    <div className="grid grid-cols-3 md:grid-cols-3 sm:grid-cols-2 mob:grid-cols-2 gap-[1vw] md:gap-[5vw] mob:gap-[5vw]">
    {products.productsList?.map((item: any) => (
      <div key={item.id} className="h-[25vw] w-[20vw]">
        <ItemCard itemDetails={item} />
      </div>
    ))}
  </div>
  );
};

export default CardsWrapper;