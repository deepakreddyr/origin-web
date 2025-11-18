import CatItemCard from "@/components/shared/CatItemCard";
import ProductCardLoader from "@/components/skeletonLoaders/shop/ProductCardLoader";
import React from "react";
import { useSelector } from "react-redux";

const CardsWrapper = () => {
  const products = useSelector((state: any) => state.products);

  if (products.isProductListLoading) return <ProductCardLoader />;

  return (
    <div
      className="
        grid 
        grid-cols-2 sm:grid-cols-3
        gap-4 sm:gap-5 lg:gap-6
        w-full
        px-3 sm:px-6 lg:px-8
        pb-6
      "
    >
      {products.productsList?.map((item: any) => (
        <div
          key={item.id}
          className="w-full rounded-[1rem] flex flex-col"
        >
          <CatItemCard itemDetails={item} />
        </div>
      ))}
    </div>
  );
};

export default CardsWrapper;
