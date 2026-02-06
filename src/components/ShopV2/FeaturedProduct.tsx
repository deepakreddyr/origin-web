import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import AddItemBtn from '@/components/shared/AddItemBtn/AddItemBtn';
import { OriginCircleLeftArrow, OriginCircleRightArrow } from '../../Icons/OriginIcons';

interface UomType {
  variant_id: number;
  name?: string | null;
  uom_id: number;
  unit: string;
  minimum_quantity: number;
  maximum_quantity: number;
  stepper_quantity: number;
  is_visible: boolean;
  is_available: boolean;
  is_default: boolean;
  price: number;
  platform_id?: number;
  formatted_price?: string;
  cart_quantity?: number;
  conversion_text: string;
  is_not_discounted?: boolean;
  ripeness_types?: any;
  cart_ripeness?: any;
  market_price: number;
}

interface FeaturedItemType {
  item: {
    id: number;
    item_code: string;
    name: string;
    image: string;
    multiple_images: string[];
    bg_color: string;
    navigation: {
      to: string;
    };
    is_greyed: boolean;
    is_available: boolean;
    is_orderable: boolean;
    tag_url: string | null;
    multiple_uoms: UomType[];
  };
  info: {
    info: Array<{
      type: string;
      title: string;
      details: Array<{
        description?: string;
        title?: string;
      }>;
      sub_title?: string;
    }>;
  };
  upsell_items: any[];
}

interface FeaturedProductProps {
  featuredItems: FeaturedItemType[];
}

const FeaturedProduct = ({ featuredItems }: FeaturedProductProps) => {
  const itemsArray = React.useMemo(() =>
    Array.isArray(featuredItems) ? featuredItems : (featuredItems ? [featuredItems] : []),
    [featuredItems]
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);

      // Calculate progress percentage for the bar
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(isNaN(progress) ? 0 : progress);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [itemsArray]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (itemsArray.length === 0) return null;

  return (
    <div className="w-full py-12 mob:py-8 overflow-hidden">
      <div className="w-[92vw] md:w-[80vw] mx-auto relative">

        {/* Desktop Side Arrows */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 z-10 group transition-all"
          >
            <OriginCircleLeftArrow className="group-hover:scale-110 w-[3.5vw] h-[3.5vw] hover:bg-primary-100 rounded-full transition-transform" />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 z-10 group transition-all"
          >
            <OriginCircleRightArrow className="group-hover:scale-110 w-[3.5vw] h-[3.5vw] hover:bg-primary-100 rounded-full transition-transform" />
          </button>
        )}

        {/* Main Content */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className="flex gap-10 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-4"
        >
          {itemsArray.map((featuredItem, index) => (
            <div key={featuredItem?.item?.id || index} className="w-full flex-shrink-0 snap-start">
              <FeaturedProductCard featuredItem={featuredItem} />
            </div>
          ))}
        </div>

        {/* Progress Bar (Centered at bottom) */}
        {itemsArray.length > 1 && (
          <div className="w-full flex justify-center mt-12 mob:mt-8">
            <div className="w-64 mob:w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-500 rounded-full transition-all duration-150"
                style={{ width: `${Math.max(15, scrollProgress)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const FeaturedProductCard = ({ featuredItem }: { featuredItem: FeaturedItemType }) => {
  const item = featuredItem?.item;
  const info = featuredItem?.info;

  if (!item) return null;

  const defaultUom = item?.multiple_uoms?.find((uom) => uom.is_default) || item?.multiple_uoms?.[0];

  const aboutProduct = info?.info?.find((section) => section.type === 'normal');
  const description = aboutProduct?.details?.[0]?.description || '';
  const bestFor = aboutProduct?.details?.[1]?.description || '';

  const productForAddBtn = {
    ...item,
    item_name: item.name,
    logo: item.image,
    website_image: item.image,
    availability: item.is_available,
    uom: item.multiple_uoms,
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-20 w-full">
      {/* Left Image Section */}
      <div className="w-full md:w-1/2 relative aspect-square bg-[#F9F7F0] rounded-[60px] mob:rounded-[40px] flex items-center justify-center p-24 mob:p-16 transition-colors hover:bg-[#F3F1E8]">
        <div className="relative w-full h-full">
          <Image
            src={item.image || '/assets/images/shop/testing_img.png'}
            alt={item.name}
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* Right Details Section */}
      <div className="w-full md:w-1/2 flex flex-col items-start text-left">
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#4B7C59] mb-6 leading-tight">
          {item.name}
        </h3>

        <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
          {description}
        </p>

        {bestFor && (
          <div className="mb-12">
            <p className="text-base md:text-lg">
              <span className="font-bold text-gray-900">Best for</span>
              <span className="text-gray-600 ml-2">{bestFor}</span>
            </p>
          </div>
        )}

        <div className="flex items-center justify-between w-full mt-auto">
          {/* Price Section */}
          <div className="flex items-baseline gap-3">
            <span className="text-gray-500 text-xl font-medium">
              {defaultUom?.unit}
            </span>
            <span className="text-xl md:text-xl font-bold text-[#4B7C59]">
              ₹{defaultUom?.price}
            </span>
            {defaultUom?.market_price && defaultUom.market_price > defaultUom.price && (
              <span className="text-xl text-gray-300 line-through font-medium ml-2">
                ₹{defaultUom.market_price}
              </span>
            )}
          </div>

          {/* Button Section */}
          {item.is_available && (
            <div className="flex-shrink-0">
              {item.multiple_uoms?.length > 1 ? (
                <button className="bg-[#FBE363] hover:bg-[#f0d85a] text-gray-900 font-bold px-12 py-5 rounded-full flex items-center gap-4 transition-all text-xl shadow-sm">
                  {item.multiple_uoms.length} Options
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 15l5 5 5-5M7 9l5-5 5 5" /></svg>
                </button>
              ) : (
                <div className="scale-110 origin-right rounded-full overflow-hidden w-[80px] my-4 mob:w-[80px]">
                  <AddItemBtn
                    product={productForAddBtn}
                    varientId={defaultUom?.variant_id}
                    varientPrice={`₹${defaultUom?.price}`}
                    stepperQuantity={defaultUom?.stepper_quantity || 1}
                    buttonType="yellowaddtocart"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;