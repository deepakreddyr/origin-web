import ItemCard from '@/components/shared/ItemCard';
import ProductCardLoader from '@/components/skeletonLoaders/shop/ProductCardLoader';
import React from 'react';
import { useSelector } from 'react-redux';

const CardsWrapper = () => {
  const products = useSelector((state: any) => state.products);

  if (products.isProductListLoading) return <ProductCardLoader />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-[4vw] md:gap-[2vw]">
      {products.productsList?.map((item: any) => (
        <div key={item.id}>
          <ItemCard itemDetails={item} />
        </div>
      ))}
    </div>
  );
};

export default CardsWrapper;
