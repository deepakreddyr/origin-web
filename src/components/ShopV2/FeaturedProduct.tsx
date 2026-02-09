import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import AddItemBtn from '@/components/shared/AddItemBtn/AddItemBtn';
import { OriginCircleLeftArrow, OriginCircleRightArrow } from '../../Icons/OriginIcons';
import { useDispatch, useSelector } from 'react-redux';
import { addNotifiedItem } from '@/store/slice/productsSlice';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { protectedUrl } from '@/url';
import { getAddressAndStoreId } from '@/utilities/utils';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
// --------------------------------------------------------
// NOTIFY TOAST COMPONENT
// --------------------------------------------------------
const NotifyToast: React.FC<{
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type: 'success' | 'error';
}> = ({ message, isVisible, onClose, type }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed z-[100] left-1/2 bottom-10 transform -translate-x-1/2 w-[90%] max-w-sm transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center bg-black rounded-full shadow-2xl h-12 px-6 w-full relative">
        <div className="flex items-center justify-center w-full gap-3">
          {type === 'error' && <InfoOutlinedIcon sx={{ color: '#FFDD00', fontSize: '1.2rem' }} />}
          <p className="text-[0.80rem] font-medium text-white text-center font-[SofiaPro] leading-tight">{message}</p>
        </div>
      </div>
    </div>
  );
};

const FeaturedProductCard = ({ featuredItem }: { featuredItem: FeaturedItemType }) => {
  const [showNotifyToast, setShowNotifyToast] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState('');
  const [notifyType, setNotifyType] = useState<'success' | 'error'>('success');
  const dispatch = useDispatch();
  const sendDataToApi = useSendDataToApi();
  const notifiedItems = useSelector((state: any) => state.products.notifiedItems);

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
            {defaultUom?.market_price && defaultUom.market_price > defaultUom.price && (
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
                className={`flex items-center justify-center border-[1.5px] font-[SofiaPro] font-bold px-8 py-4 rounded-full transition-colors whitespace-nowrap gap-2 ${
                  isNotified
                    ? 'border-gray-400 text-gray-400 bg-gray-50 cursor-default'
                    : 'border-[#146321] text-[#146321] hover:bg-green-50'
                }`}
              >
                <span className="text-xl">{isNotified ? 'Notified' : 'Notify Me'}</span>
                <NotificationsNoneOutlinedIcon sx={{ fontSize: '1.8rem', strokeWidth: 1 }} />
              </button>
            ) : item.multiple_uoms?.length > 1 ? (
              <button className="bg-[#FBE363] hover:bg-[#f0d85a] text-gray-900 font-bold px-12 py-5 rounded-full flex items-center gap-4 transition-all text-xl shadow-sm">
                {item.multiple_uoms.length} Options
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                </svg>
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
        </div>
      </div>
      <NotifyToast
        message={notifyMsg}
        isVisible={showNotifyToast}
        onClose={() => setShowNotifyToast(false)}
        type={notifyType}
      />
    </div>
  );
};

export default FeaturedProduct;
