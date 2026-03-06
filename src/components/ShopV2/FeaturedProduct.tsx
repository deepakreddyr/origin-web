import React, { useState, useRef, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import Image from 'next/image';
import AddItemBtn from '@/components/shared/AddItemBtn/AddItemBtn';
import { OriginCircleLeftArrow, OriginCircleRightArrow } from '../../Icons/OriginIcons';
import { useDispatch, useSelector } from 'react-redux';
import { addNotifiedItem } from '@/store/slice/productsSlice';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { protectedUrl } from '@/url';
import { getAddressAndStoreId } from '@/utilities/utils';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { UOMPopup, NotifyToast, MaxQuantityToast, Product, UOM } from '../shared/UOMPopup';

interface FeaturedItemType {
  item: Product;
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
  const itemsArray = React.useMemo(
    () => (Array.isArray(featuredItems) ? featuredItems : featuredItems ? [featuredItems] : []),
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
        behavior: 'smooth'
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
// Local NotifyToast removed in favor of shared component

const FeaturedProductCard = ({ featuredItem }: { featuredItem: FeaturedItemType }) => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [showNotifyToast, setShowNotifyToast] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState('');
  const [notifyType, setNotifyType] = useState<'success' | 'error'>('success');
  const dispatch = useDispatch();
  const sendDataToApi = useSendDataToApi();
  const notifiedItems = useSelector((state: any) => state.products.notifiedItems);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showMaxQuantityToast, setShowMaxQuantityToast] = useState(false);
  const [toastMaxQuantity, setToastMaxQuantity] = useState<number | null>(null);

  const item = featuredItem?.item;
  const info = featuredItem?.info;
  if (!item) return null;

  const defaultUom = item?.multiple_uoms?.find((uom) => uom.is_default) || item?.multiple_uoms?.[0];

  const aboutProduct = info?.info?.find((section) => section.type === 'normal');
  const description = aboutProduct?.details?.[0]?.description || '';
  const bestFor = aboutProduct?.details?.[1]?.description || '';

  const isNotified = item ? notifiedItems.includes(item.id) : false;

  const handleNotifyMe = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['notifyMe'];
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const payload = {
      item_id: item.id
    };

    const successHandler = (data: any) => {
      setNotifyMsg(data?.message || 'Successfully subscribed to notifications');
      setNotifyType('success');
      setShowNotifyToast(true);
      dispatch(addNotifiedItem(item.id));
    };

    const failureHandler = (error: any) => {
      setNotifyMsg(error?.message || 'Not successful. Please try again later.');
      setNotifyType('error');
      setShowNotifyToast(true);
    };

    await sendDataToApi(apiUrl, payload, 'POST', successHandler, failureHandler, additionalHeaders);
  };

  const productForAddBtn = {
    ...item,
    item_name: item.name,
    logo: item.image,
    website_image: item.image,
    availability: item.is_available,
    uom: item.multiple_uoms
  };

  const hasMultipleUOMs = item.multiple_uoms?.length > 1;
  const hasRipenessOptions = item.multiple_uoms?.some((uom) => uom.ripeness_types && uom.ripeness_types.length > 0);
  const requiresSelection = hasMultipleUOMs || hasRipenessOptions;

  const totalOptionsCount = item.multiple_uoms?.reduce((acc, uom) => {
    return acc + (uom.ripeness_types?.length || 1);
  }, 0);

  const handleMaxQuantityExceeded = (maxQty: number) => {
    setToastMaxQuantity(maxQty);
    setShowMaxQuantityToast(true);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-20 w-full">
      {/* Left Image Section */}
      <div className="w-full md:w-1/2 relative aspect-square bg-[#F9F7F0] rounded-[60px] mob:rounded-[40px] flex items-center justify-center p-16 mob:p-8 transition-colors hover:bg-[#F3F1E8]">
        <div className="relative w-full h-full">
          <Image
            src={item.image || '/assets/images/shop/testing_img.png'}
            alt={item.name}
            fill
            priority
            className="object-contain"
          />
        </div>
        {defaultUom?.conversion_text && (
          <div className="absolute top-8 right-8 text-[#146321] text-lg font-bold px-2 py-0.5 rounded-full z-10 font-[SofiaPro]">
            {defaultUom.conversion_text}
          </div>
        )}
      </div>

      {/* Right Details Section */}
      <div className="w-full md:w-1/2 flex flex-col items-start text-left">
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#4B7C59] mb-6 leading-tight">{item.name}</h3>

        <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">{description}</p>

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
            <span className="text-gray-500 text-xl font-medium">{defaultUom?.unit}</span>
            <span className="text-xl md:text-xl font-bold text-[#4B7C59]">₹{defaultUom?.price}</span>
            {defaultUom?.market_price > 0 && defaultUom.market_price > defaultUom.price && (
              <span className="text-xl text-gray-300 line-through font-medium ml-2">₹{defaultUom.market_price}</span>
            )}
          </div>

          {/* Button Section */}
          <div className="flex-shrink-0">
            {!item.is_available ? (
              <button
                type="button"
                disabled={isNotified}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isNotified) handleNotifyMe();
                }}
                className={`flex items-center justify-center border-[1.5px] font-[SofiaPro] font-bold h-[2.5vw] mob:h-[8.5vw] px-[1.5vw] mob:px-[3vw] rounded-full transition-colors whitespace-nowrap gap-2 border-[#146321] text-[#146321] ${
                  isNotified ? 'cursor-default' : 'hover:bg-green-50'
                }`}
              >
                {!isNotified && <span className="text-[.97vw] mob:text-[3.2vw]">Notify Me</span>}
                {isNotified ? (
                  <NotificationsActiveIcon sx={{ fontSize: isMobile ? '4vw' : '1.2vw' }} />
                ) : (
                  <NotificationsIcon sx={{ fontSize: isMobile ? '4vw' : '1.2vw' }} />
                )}
              </button>
            ) : requiresSelection ? (
              <button
                onClick={() => setIsPopupOpen(true)}
                className="bg-primary text-black font-bold h-[2.5vw] mob:h-[8.5vw] px-[1.5vw] mob:px-[3vw] rounded-full flex items-center justify-center gap-1 transition-all text-[.97vw] mob:text-[3.2vw]"
              >
                Add
                <KeyboardArrowDownIcon sx={{ fontSize: isMobile ? '4vw' : '1.2vw' }} />
              </button>
            ) : (
              <div className="w-[80px] mob:w-auto flex justify-end">
                <AddItemBtn
                  product={productForAddBtn}
                  varientId={defaultUom?.variant_id}
                  varientPrice={`₹${defaultUom?.price}`}
                  stepperQuantity={defaultUom?.stepper_quantity || 1}
                  buttonType="white"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <NotifyToast
        message={notifyMsg}
        isVisible={showNotifyToast}
        onClose={() => setShowNotifyToast(false)}
        type={notifyType}
      />
      <MaxQuantityToast
        maxQuantity={toastMaxQuantity}
        isVisible={showMaxQuantityToast}
        onClose={() => setShowMaxQuantityToast(false)}
        itemName={item.name}
      />
      {requiresSelection && (
        <UOMPopup
          product={item}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSelectionMade={() => {}} // We don't need local selection state here like in ItemCard as AddItemBtn handles cart
        />
      )}
    </div>
  );
};

export default FeaturedProduct;
