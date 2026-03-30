import React from 'react';
import { Product } from '../shared/UOMPopup';
import MangoItemCard from './MangoItemCard';

interface MangoProductHighlightProps {
  products?: Product[];
}

const MangoProductHighlight = ({ products = [] }: MangoProductHighlightProps) => {
  const displayProducts = products.slice(0, 2);

  if (displayProducts.length === 0) return null;

  return (
    <section className="px-12 md:px-[7vw] pb-24 relative z-10 md:pt-[5vw]">
      {/* Align with max-w-2xl from Hero section */}
      <div className="max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayProducts.map((product) => (
          <MangoItemCard key={product.id} itemDetails={product} />
        ))}
      </div>
    </section>
  );
};

export default MangoProductHighlight;
