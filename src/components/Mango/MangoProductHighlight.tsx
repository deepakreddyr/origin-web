import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../shared/UOMPopup';
import MangoItemCard from './MangoItemCard';
import MangoItemSkeleton from './MangoItemSkeleton';
import { useMediaQuery } from '@mui/material';

interface MangoProductHighlightProps {
  products?: Product[];
  isLoading?: boolean;
}

const MangoProductHighlight = ({ products = [], isLoading = false }: MangoProductHighlightProps) => {
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const isMobile = useMediaQuery('(max-width:600px)');
  const displayProducts = products.slice(0, 2);
  const isLogin = loginDetails?.isLogin;
  const topPadding = isLogin ? 'pt-[190px]' : 'pt-[290px]';

  if (isLoading) {
    return (
      <section className={`md:px-[7vw] pb-0 md:pb-24 relative z-10 ${topPadding} md:pt-[5vw]`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:flex md:flex-wrap justify-start gap-3 md:gap-8 lg:gap-10 px-4">
          {[1, 2].map((i) => (
            <div key={i} className="w-full md:w-[300px] flex-shrink-0">
              <MangoItemSkeleton />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (displayProducts.length === 0) return null;

  return (
    <section className={`md:px-[7vw] pb-0 md:pb-24 relative z-10 ${topPadding} md:pt-[5vw]`}>
      {/* Align with max-w-2xl from Hero section */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:flex md:flex-wrap justify-start gap-3 md:gap-8 lg:gap-10 px-4">
        {displayProducts.map((product) => (
          <div key={product.id} className="w-full md:w-[300px] flex-shrink-0">
            <MangoItemCard itemDetails={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MangoProductHighlight;
