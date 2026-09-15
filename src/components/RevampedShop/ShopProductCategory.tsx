import React, { useRef } from 'react';
import ItemCard from '@/components/shared/ItemCard';
import CarouselButtons from '@/components/CarouselButtons';

interface ShopProductCategoryProps {
  title: string;
  data: any[];
}

const ShopProductCategory: React.FC<ShopProductCategoryProps> = ({ title, data }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  if (!data || data.length === 0) return null;

  const handleScroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-[32px] md:mb-[48px] last:mb-0" data-reveal="true">
      <div className="flex items-end justify-between flex-wrap gap-[16px] mb-[24px]">
        <h3 className="h-md m-0">{title}</h3>
        <div className="hidden md:block">
          <CarouselButtons
            leftButtonClass={`poProductsRight-${title.replace(/\s+/g, '-')}`}
            rightButtonClass={`poProductsLeft-${title.replace(/\s+/g, '-')}`}
            leftClick={() => handleScroll('left')}
            rightClick={() => handleScroll('right')}
          />
        </div>
      </div>

      <div
        ref={sliderRef}
        className="flex items-stretch gap-[30px] md:gap-[40px] overflow-x-auto noscrollbar pb-[24px]"
        style={{ marginRight: 'calc(-1 * var(--gutter, 20px))', paddingRight: 'var(--gutter, 20px)' }}
      >
        {data.map((item: any) => (
          <div key={item.id} className="flex-shrink-0 w-[40vw] md:w-[16.67vw]">
            <ItemCard itemDetails={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopProductCategory;
