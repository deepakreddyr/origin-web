import React, { useRef, useEffect } from 'react';
import ItemCard from '../shared/ItemCard';
import CarouselButtons from '../CarouselButtons';

interface TopPicksProps {
  categoryDetail: any;
}

const TopPicks: React.FC<TopPicksProps> = ({ categoryDetail }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollKey = `sliderScrollPosition_${categoryDetail?.title || 'TopPicks'}`;

  const handleScroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const saveScrollPosition = () => {
    if (sliderRef.current) {
      const scrollPosition = sliderRef.current.scrollLeft;
      localStorage.setItem(scrollKey, String(scrollPosition));
    }
  };

  const restoreScrollPosition = () => {
    const savedPosition = localStorage.getItem(scrollKey);
    if (sliderRef.current && savedPosition) {
      sliderRef.current.scrollLeft = parseInt(savedPosition, 10);
    }
  };

  useEffect(() => {
    restoreScrollPosition();
    return () => saveScrollPosition();
  }, []);

  if (!categoryDetail || !categoryDetail.data || categoryDetail.data.length === 0) return null;

  return (
    <section className="section-pad texture-paper">
      <div className="wrap animate-fade-in-up">
        <div className="flex items-end justify-between flex-wrap gap-[16px] mb-[32px]">
          <div>
            <span className="eyebrow">Origin Top Picks</span>
            <h2 className="h-lg m-0">{categoryDetail.title || 'The Cult Of Fresh.'}</h2>
          </div>
          <div className="hidden md:block">
            <CarouselButtons
              leftButtonClass="poProductsRight"
              rightButtonClass="poProductsLeft"
              leftClick={() => handleScroll('left')}
              rightClick={() => handleScroll('right')}
            />
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex items-stretch gap-[30px] md:gap-[40px] overflow-x-auto noscrollbar pb-[24px]"
          style={{ marginRight: 'calc(-1 * var(--gutter))', paddingRight: 'var(--gutter)' }}
          onScroll={saveScrollPosition}
        >
          {categoryDetail.data?.map((item: any) => (
            <div key={item.id} className="flex-shrink-0 w-[40vw] md:w-[16.67vw]">
              <ItemCard itemDetails={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopPicks;
