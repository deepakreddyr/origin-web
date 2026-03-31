import React from 'react';
import { Product } from '../shared/UOMPopup';
import MangoItemCard from './MangoItemCard';
import { useMediaQuery } from '@mui/material';

interface MangoProductHighlightProps {
  products?: Product[];
}

const MangoProductHighlight = ({ products = [] }: MangoProductHighlightProps) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const displayProducts = products.slice(0, 2);

  if (displayProducts.length === 0) return null;

  return (
    <section className="px-4 md:px-[7vw] pb-0 md:pb-24 relative z-10 pt-[220px] md:pt-[5vw]">
      {/* Align with max-w-2xl from Hero section */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
        {displayProducts.map((product) => (
          <MangoItemCard key={product.id} itemDetails={product} isCompact={isMobile} />
        ))}
      </div>
    </section>
  );
};

export default MangoProductHighlight;
