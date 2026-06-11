import { mainApiUrl, protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import ItemCard from '../shared/ItemCard';
import AddItemBtn from '../shared/AddItemBtn/AddItemBtn';
import AboutTheProduct from './AboutTheProduct';
import ProductDetailsPageLoader from '../skeletonLoaders/shop/ProductDetailsPageLoader';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import itemRipenessSvg from '/public/assets/svg/itemRipeness.svg';
import PopularProduce from '@/components/ShopV2/PopularProduce';
import Link from 'next/link';
import CustomHead from '../shared/CustomHead';
import { useDispatch, useSelector } from 'react-redux';
import { addNotifiedItem } from '@/store/slice/productsSlice';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { motion, AnimatePresence } from 'framer-motion';
import * as gtag from '@/utilities/gtag';
import { trackEvent } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { setLoginDetails } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';

// Type definitions
interface UOM {
  price: number;
  unit: string;
  uom_id: number;
  variant_id: number;
  is_default: boolean;
  is_available: boolean;
  is_visible: boolean;
  market_price: number;
  minimum_quantity: number;
  maximum_quantity: number;
  stepper_quantity: number;
  conversion_text: string;
  ripeness_types?: string[];
  cart_ripeness?: Array<{ ripeness_type: string; qty: string }>;
  cart_quantity?: number;
  [key: string]: any;
}

interface InfoDetail {
  description: string;
  [key: string]: any;
}

interface InfoSection {
  title: string;
  type: string;
  sub_title?: string;
  details: InfoDetail[];
}

interface ProductItem {
  id: number;
  item_code: string;
  name: string;
  image: string;
  website_image?: string;
  multiple_images?: string[];
  tag_url: string | null;
  bg_color: string;
  navigation: {
    to: string;
  };
  is_greyed: boolean;
  is_available: boolean;
  is_orderable: boolean;
  multiple_uoms: UOM[];
  category_name?: string;
  category_slug?: string;
  public_extra_descriptions?: Array<{
    title: string;
    type: string;
    description: string;
  }>;
  tags?: Array<{
    id: number;
    name: string;
    image?: string | null;
    svg?: string | null;
    bg_colour?: string | null;
    text_colour?: string | null;
  }>;
}

interface ProductInfo {
  info: InfoSection[];
}

interface ProductDetails {
  item: ProductItem;
  info: ProductInfo;
  upsell_items: ProductItem[];
  combo_items: any[];
  isLoading: boolean;
}

// Max Quantity Toast Component
const MaxQuantityToast: React.FC<{
  maxQuantity: number | null;
  isVisible: boolean;
  onClose: () => void;
}> = ({ maxQuantity, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible || maxQuantity === null) return null;

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-40 transition-opacity duration-300 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center bg-black rounded-full shadow-xl h-10 px-4 w-full relative">
        <div className="flex items-center justify-center w-full gap-2">
          <InfoOutlinedIcon sx={{ color: 'yellow' }} />
          <p className="text-[0.70rem] font-semibold text-white text-center leading-tight">
            Maximum quantity of {maxQuantity} reached for this item.
          </p>
        </div>
      </div>
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
          {type === 'error' && <InfoOutlinedIcon sx={{ color: '#fac510', fontSize: '1.2rem' }} />}
          <p className="text-[0.80rem] font-medium text-white text-center leading-tight font-[SofiaPro]">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Combo Contains Section
const ComboContains: React.FC<{ productDetails: ProductDetails }> = ({ productDetails }) => {
  if (!productDetails.combo_items || productDetails.combo_items.length === 0) return null;

  const defaultUOM =
    productDetails.item.multiple_uoms?.find((uom) => uom.is_default) || productDetails.item.multiple_uoms?.[0];
  const totalItems = productDetails.combo_items.length;

  return (
    <div className="mt-8 bg-[#FAF7F0] rounded-[24px] border border-[#EDE6CC]/50 p-6 mob:p-5">
      <h3 className="font-Stinger font-bold text-2xl mob:text-xl text-[#231F20] mb-5 text-center">Combo contains</h3>

      <div className="grid grid-cols-[1fr_auto_auto] items-stretch gap-x-4 mb-2">
        {productDetails.combo_items.map((item, index) => {
          const isLast = index === productDetails.combo_items.length - 1;
          const borderClass = isLast ? '' : 'border-b border-[#EDE6CC]/30';

          // Parse name for sub-description (e.g., "Arbi (Colocassia Taro)")
          const nameParts = item.item_name.match(/([^(]+)(?:\(([^)]+)\))?/);
          const name = nameParts ? nameParts[1].trim() : item.item_name;
          const subName = nameParts?.[2]?.trim();

          return (
            <React.Fragment key={index}>
              <div className={`py-4 ${borderClass} text-start flex flex-col justify-center`}>
                <p className="font-[SofiaPro] font-bold text-base mob:text-sm text-[#231F20] leading-tight">{name}</p>
                {subName && <p className="font-[SofiaPro] italic text-xs text-[#231F20]/60">{subName}</p>}
              </div>
              <div className={`py-4 ${borderClass} flex items-center justify-center min-w-[3rem]`}>
                <p className="font-[SofiaPro] text-base mob:text-sm text-[#231F20]/70">{item.qty}</p>
              </div>
              <div className={`py-4 ${borderClass} flex items-center justify-end min-w-[5rem]`}>
                <p className="font-[SofiaPro] text-base mob:text-sm text-[#231F20]/70">{item.uom}</p>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#EDE6CC]">
        <p className="font-[SofiaPro] font-bold text-lg text-[#231F20]">Total ({totalItems} items)</p>
        <div className="flex items-center gap-4">
          {defaultUOM && (
            <div className="flex items-center gap-2">
              <span className="text-[#231F20] font-bold text-xl">₹{defaultUOM.price}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Storing Information Section
const StorageInfo: React.FC<{ info: ProductInfo }> = ({ info }) => {
  const storageSection = info?.info?.find((section) => section.type === 'storage');
  if (!storageSection || !storageSection.details || storageSection.details.length === 0) return null;

  // Check if any detail has meaningful content (non-empty title, description, or image)
  const hasContent = storageSection.details.some(
    (detail: any) =>
      (detail.title && detail.title.trim()) ||
      (detail.description && detail.description.trim()) ||
      (detail.image && detail.image.trim())
  );
  if (!hasContent) return null;

  return (
    <div className="mt-4 w-[300px] mob:w-full bg-white rounded-[16px] border border-[#EDE6CC]/50 p-4 pb-[16px]">
      <p className="font-[Recoleta] font-semibold text-xl text-[#231F20] mb-6 text-start">Storing information</p>
      <div className="flex flex-row overflow-x-auto gap-[12px] no-scrollbar">
        {storageSection.details
          .filter(
            (detail: any) =>
              (detail.title && detail.title.trim()) ||
              (detail.description && detail.description.trim()) ||
              (detail.image && detail.image.trim())
          )
          .map((detail: any, index: number) => (
            <div
              key={index}
              className="flex-shrink-0 w-max h-[60px] bg-[#FAF8F1] rounded-[12px] pt-[12px] pr-[32px] pb-[12px] pl-[12px] flex items-center gap-[10px] border border-[#EDE6CC]/20 overflow-hidden"
            >
              <div className="w-6 h-6 relative flex-shrink-0 bg-white rounded-full p-1">
                <Image src={detail.image} alt={detail.title} fill className="object-contain p-1" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-[SofiaPro] font-bold text-[13px] text-[#231F20] leading-tight whitespace-nowrap">
                  {detail.title}
                </p>
                <p className="font-[SofiaPro] text-[10px] text-[#231F20]/70 leading-tight whitespace-nowrap mt-0.5">
                  {detail.description}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// Nutrition Benefits Section
const NutritionBenefits: React.FC<{ info: ProductInfo }> = ({ info }) => {
  const nutritionSection = info?.info?.find((section) => section.type === 'nutrition');
  if (!nutritionSection || !nutritionSection.details || nutritionSection.details.length === 0) return null;

  // Check if any detail has meaningful content (non-empty title or description)
  const hasContent = nutritionSection.details.some(
    (detail: any) => (detail.title && detail.title.trim()) || (detail.description && detail.description.trim())
  );
  if (!hasContent) return null;

  return (
    <div className="mt-4 w-[443px] mob:w-full bg-white rounded-[16px] border border-[#EDE6CC]/50 p-4 pb-[16px]">
      <p className="font-[Recoleta] font-semibold text-xl text-[#231F20] mb-6 text-start">Nutrition benefits</p>
      <div className="flex flex-row overflow-x-auto gap-[12px] no-scrollbar">
        {nutritionSection.details
          .filter(
            (detail: any) => (detail.title && detail.title.trim()) || (detail.description && detail.description.trim())
          )
          .map((detail: any, index: number) => (
            <div
              key={index}
              className="flex-shrink-0 w-max h-[60px] bg-[#FAF8F1] rounded-[12px] pt-[12px] pr-[32px] pb-[12px] pl-[12px] flex flex-col justify-center border border-[#EDE6CC]/20 overflow-hidden"
            >
              <p className="font-[SofiaPro] font-bold text-base text-[#231F20] leading-tight whitespace-nowrap">
                {detail.title}
              </p>
              <p className="font-[SofiaPro] text-[9px] text-[#231F20]/70 uppercase tracking-wide whitespace-nowrap mt-0.5">
                {detail.description}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

const ImageGallery: React.FC<{
  mainImage: string;
  multipleImages?: string[];
  productName: string;
  isAvailable: boolean;
  conversionText?: string;
  hasRipenessFeature: boolean;
  isDesktop?: boolean;
  isMangoPage?: boolean;
  tagWithSvg?: any;
}> = ({
  mainImage,
  multipleImages = [],
  productName,
  isAvailable,
  conversionText,
  hasRipenessFeature,
  isDesktop,
  isMangoPage = false,
  tagWithSvg
}) => {
  const images = [mainImage, ...multipleImages].filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 30;
    if (info.offset.x < -threshold && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-full overflow-hidden group">
      <motion.div
        className="flex h-full w-full cursor-grab active:cursor-grabbing touch-pan-y select-none"
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
      >
        {images.map((img, i) => (
          <div key={i} className="min-w-full h-full relative">
            <Image
              src={img}
              fill
              alt={`${productName} image ${i + 1}`}
              style={{ objectFit: 'cover' }}
              priority={i === 0}
              unoptimized
            />
          </div>
        ))}
      </motion.div>

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
          <div className="bg-white px-2.5 py-2 rounded-full flex gap-1.5 shadow-sm border border-gray-100/50 grayscale">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === currentIndex ? 'bg-black w-4 h-1.5' : 'bg-black/20 w-1.5 h-1.5'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Overlays */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
        {tagWithSvg && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-[6px] ${isMangoPage ? 'bg-[#660077B2]' : 'bg-black/30 backdrop-blur-sm'}`}
          >
            <span
              className={`text-white font-[SofiaPro] font-medium leading-none tracking-wide ${isDesktop ? 'text-[14px]' : 'text-[12px]'}`}
            >
              Imported
            </span>
            {tagWithSvg.svg && (
              <div className={`relative ${isDesktop ? 'w-5 h-5' : 'w-4 h-4'}`}>
                <Image
                  src={tagWithSvg.svg || undefined}
                  alt="Imported tag"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            )}
          </div>
        )}
        {conversionText && (
          <div
            className={`font-bold px-3 py-1 font-[SofiaPro] ${isDesktop ? 'text-sm' : 'text-[10px]'} ${
              isMangoPage
                ? 'text-white rounded-full'
                : 'bg-[#008145] flex items-center justify-center text-white text-center rounded-md'
            }`}
          >
            {conversionText}
          </div>
        )}
      </div>
      {hasRipenessFeature && (
        <div className={`absolute bottom-4 right-4 z-10 p-1.5 bg-white rounded-full shadow-lg overflow-hidden`}>
          <Image src={itemRipenessSvg} alt="Select ripeness" width={isDesktop ? 60 : 35} height={isDesktop ? 60 : 35} />
        </div>
      )}
      {!isAvailable && (
        <div className="bg-black-op-50 absolute top-0 w-full py-2 flex justify-center z-20">
          <p className={`${isDesktop ? 'text-lg' : 'text-sm'} font-[SofiaPro] font-semibold text-white`}>
            OUT OF STOCK
          </p>
        </div>
      )}

      {/* Navigation Arrows for Desktop */}
      {images.length > 1 && isDesktop && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white rounded-full shadow-lg border border-gray-100 transition-all duration-300 ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <ChevronLeftIcon sx={{ fontSize: '24px' }} />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1))}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white rounded-full shadow-lg border border-gray-100 transition-all duration-300 ${currentIndex === images.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <ChevronRightIcon sx={{ fontSize: '24px' }} />
          </button>
        </>
      )}
    </div>
  );
};

const ProductDetailsWrapper = () => {
  const mobile = useMediaQuery(768);
  const [productDetails, setProductDetails] = useState<ProductDetails>({
    item: {
      id: 0,
      item_code: '',
      name: '',
      image: '',
      tag_url: null,
      bg_color: '',
      navigation: { to: '' },
      is_greyed: false,
      is_available: true,
      is_orderable: false,
      multiple_uoms: []
    },
    info: { info: [] },
    upsell_items: [],
    combo_items: [],
    isLoading: true
  });

  // Max Quantity Toast State
  const [showMaxQuantityToast, setShowMaxQuantityToast] = useState(false);
  const [toastMaxQuantity, setToastMaxQuantity] = useState<number | null>(null);

  // --- NOTIFY ME STATE ---
  const [showNotifyToast, setShowNotifyToast] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState('');
  const [notifyType, setNotifyType] = useState<'success' | 'error'>('success');
  const [fetchError, setFetchError] = useState(false);
  const dispatch = useDispatch();
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const [address] = useAtom(addressAtom);

  const handleMaxQuantityExceeded = (maxQty: number) => {
    setToastMaxQuantity(maxQty);
    setShowMaxQuantityToast(true);
  };

  const getDataFromApi = useGetDataFromApi();
  const router = useRouter();
  const { isReady, query, pathname } = router;
  const isMangoPage = pathname.startsWith('/mango');

  const renderBreadcrumbs = () => {
    const isMangoPath = pathname.startsWith('/mango');
    const productName = productDetails.item.name;
    const categoryName = productDetails.item.category_name || 'Shop';
    const categorySlug = productDetails.item.category_slug;

    if (isMangoPath) {
      if (pathname.includes('/products/')) {
        return (
          <>
            <Link href="/mango" className="hover:underline">
              Mango
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/mango/products" className="hover:underline">
              Products
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 line-clamp-1">{productName}</span>
          </>
        );
      }
      return (
        <>
          <Link href="/mango" className="hover:underline">
            Mango
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 line-clamp-1">{productName}</span>
        </>
      );
    }

    // Default shop path
    return (
      <>
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="text-gray-300">/</span>
        <Link href={categorySlug ? `/shop/${categorySlug}` : '/shop'} className="hover:underline">
          {categoryName}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 line-clamp-1">{productName}</span>
      </>
    );
  };

  const notifiedItems = useSelector((state: any) => state.products.notifiedItems);
  const isNotified = productDetails.item ? notifiedItems.includes(productDetails.item.id) : false;
  const sendDataToApi = useSendDataToApi();

  const handleNotifyMe = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['notifyMe'];
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const payload = {
      item_id: productDetails.item.id
    };

    const successHandler = (data: any) => {
      setNotifyMsg(data?.message || 'Successfully subscribed to notifications');
      setNotifyType('success');
      setShowNotifyToast(true);
      dispatch(addNotifiedItem(productDetails.item.id));
    };

    const failureHandler = (error: any) => {
      setNotifyMsg(error?.message || 'Not successful. Please try again later.');
      setNotifyType('error');
      setShowNotifyToast(true);
    };

    await sendDataToApi(apiUrl, payload, 'POST', successHandler, failureHandler, additionalHeaders);
  };

  const fetchedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isReady && query.id) {
      const currentId = String(query.id);
      if (fetchedIdRef.current === currentId) {
        return;
      }
      fetchedIdRef.current = currentId;

      const loginState = loginDetails.isLogin;
      const token = localStorage.getItem('user_token');
      const addressFromLs = getAddressAndStoreId();
      const storeId = addressFromLs?.store_id;

      // Check for inconsistent session state: must have both or neither
      if ((token && !storeId) || (!token && storeId)) {
        console.warn('Inconsistent session state detected on PDP. Clearing session.');
        localStorage.clear();
        sessionStorage.clear();
        dispatch(
          setLoginDetails({
            isLogin: false,
            user: null,
            tabType: TabTypeConstant.ENTER_MOBILE_NUMBER,
            isSidebarOpen: false
          })
        );
        // The state change will trigger a re-run of this effect with cleared tokens
        return;
      }

      let additionalHeaders: Record<string, string> = {};
      let apiUrl: string;

      if (token) {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['searchForProduct'] + `/${query.id}`;
        additionalHeaders = {
          'store-id': String(storeId)
        };
      } else {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['searchForProduct'] + `/${query.id}`;
        // if (addressFromLs) {
        //   additionalHeaders = {
        //     'store-id': addressFromLs.store_id
        //   };
        // }
      }

      const successHandler = (data: any) => {
        if (data?.data) {
          setProductDetails({ ...data.data, isLoading: false });

          // Track GA Event: view_item
          const item = data.data.item;
          const defaultUOM = item?.multiple_uoms?.find((uom: any) => uom.is_default) || item?.multiple_uoms?.[0];

          gtag.event({
            action: 'view_item',
            category: 'Ecommerce',
            items: [
              {
                item_id: item?.id,
                item_name: item?.name,
                price: defaultUOM?.price,
                item_category: item?.category_name,
                item_variant: defaultUOM?.variant_name
              }
            ]
          });

          // CleverTap: product_view
          trackEvent(AnalyticsEvents.PRODUCT_VIEW, {
            prid: String(item?.id || ''),
            uom: defaultUOM?.unit || '',
            image: item?.website_image || item?.image || '',
            prqt: defaultUOM?.stepper_quantity || 1,
            product_name: item?.name || '',
            category: item?.category_name || '',
            selling_price: defaultUOM?.market_price || defaultUOM?.price || 0,
            final_price: defaultUOM?.price || 0,
            in_stock: defaultUOM?.is_available ? 'Yes' : 'No'
          });
        }
      };

      const failureHandler = (data: any) => {
        setProductDetails((prev) => ({ ...prev, isLoading: false }));
        setFetchError(true);
      };

      getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, query.id, loginDetails.isLogin, address.defaultAddress?.store_id]);

  // Find default UOM
  const defaultUOM: UOM | undefined =
    productDetails?.item?.multiple_uoms?.find((uom: UOM) => uom?.is_default === true) ||
    productDetails?.item?.multiple_uoms?.[0];

  // CHECK FOR RIPENESS FEATURE: Check if the array exists and has content
  const hasRipenessFeature = !!(defaultUOM?.ripeness_types && defaultUOM.ripeness_types.length > 0);

  // Get product description
  const displayDescription = productDetails.item?.public_extra_descriptions?.find(
    (desc: any) => desc.title === 'info' && desc.type === 'normal'
  )?.description;

  const aboutSection = productDetails.info?.info?.find(
    (section) => section.type === 'normal' && (section.title === 'About the Product' || section.title === 'info')
  );
  const rawDescription = displayDescription || aboutSection?.details?.[0]?.description || '';
  // Treat whitespace-only descriptions as empty
  const productDescription = rawDescription.trim() ? rawDescription : '';

  // SEO Logic
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://origin.com';
  const cleanPath = router.asPath.split('?')[0];
  const currentUrl = `${frontendUrl}${cleanPath}`;

  const seoData = {
    title: `${productDetails.item.name || 'Product'} - Buy Online`,
    description: (
      productDescription ||
      `Buy ${productDetails.item.name} online. Fresh and high-quality products delivered to your doorstep.`
    ).substring(0, 155),
    image:
      (isMangoPage ? productDetails.item.website_image : null) ||
      productDetails.item.image ||
      `${frontendUrl}/assets/logo.svg`,
    price: defaultUOM?.price || 0,
    currency: 'INR',
    availability: productDetails.item.is_available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    url: currentUrl
  };

  // Calculate price validity (1 year from now)
  const priceValidUntil = new Date();
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);

  // JSON-LD: Product
  const productStructuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: seoData.title,
    image: seoData.image,
    description: seoData.description,
    sku: productDetails.item.item_code || productDetails.item.id,
    brand: {
      '@type': 'Brand',
      name: 'Origin Fresh'
    },
    offers: {
      '@type': 'Offer',
      url: seoData.url,
      priceCurrency: seoData.currency,
      price: seoData.price,
      priceValidUntil: priceValidUntil.toISOString().split('T')[0],
      availability: seoData.availability,
      itemCondition: 'https://schema.org/NewCondition'
    }
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: frontendUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: productDetails.item.category_name || 'Shop',
        item: `${frontendUrl}${productDetails.item.category_slug ? `/shop/${productDetails.item.category_slug}` : '/shop'}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: productDetails.item.name,
        item: currentUrl
      }
    ]
  };

  if (productDetails.isLoading) return <ProductDetailsPageLoader />;

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/svg/somethingwentwrong.svg"
          alt="Something went wrong"
          className="w-[300px] mob:w-[220px] mb-6"
        />
        <p className="text-center text-gray-500 font-[SofiaPro] text-base mob:text-sm">
          Oops! Something went wrong. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <CustomHead
        title={seoData.title}
        description={seoData.description}
        canonical={seoData.url}
        ogImage={seoData.image}
        ogType="product"
        ogUrl={seoData.url}
      />
      <Head>
        <meta property="product:price:amount" content={seoData.price.toString()} />
        <meta property="product:price:currency" content={seoData.currency} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
      </Head>

      {/* <div className="mt-[4vw]" style={{ backgroundColor: '#FFF9E5' }}> */}
      <div className="mt-[4vw]">
        {/* Max Quantity Toast */}
        <MaxQuantityToast
          maxQuantity={toastMaxQuantity}
          isVisible={showMaxQuantityToast}
          onClose={() => setShowMaxQuantityToast(false)}
        />
        <NotifyToast
          message={notifyMsg}
          isVisible={showNotifyToast}
          onClose={() => setShowNotifyToast(false)}
          type={notifyType}
        />

        <div className="w-[92vw] md:w-[80vw] mx-auto py-7 mob:px-0 mob:py-6">
          {/* Breadcrumbs for Mobile - APPEARS BEFORE IMAGE */}
          {mobile && (
            <div
              className={`flex items-center gap-2 text-lg font-bold text-[#146321] mb-6 font-[SofiaPro] ${isMangoPage ? 'pt-[10vw]' : ''}`}
            >
              {renderBreadcrumbs()}
            </div>
          )}

          {mobile ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center bg-primary-100 rounded-[24px] overflow-hidden border border-[#EDE6CC]/50">
                <div className="relative w-full aspect-square bg-transparent">
                  <ImageGallery
                    mainImage={(isMangoPage ? productDetails.item.website_image : null) || productDetails.item.image}
                    // multipleImages={productDetails.item.multiple_images}
                    productName={productDetails.item.name}
                    isAvailable={defaultUOM?.is_available && productDetails.item.is_available}
                    conversionText={defaultUOM?.conversion_text}
                    hasRipenessFeature={hasRipenessFeature}
                    isMangoPage={isMangoPage}
                    tagWithSvg={productDetails.item.tags?.find((tag: any) => tag.svg)}
                  />
                </div>

                <div className="w-full px-6 pt-6 pb-2 space-y-2 text-start">
                  <h1 className="text-2xl !font-[SofiaPro] font-bold text-[#231F20] leading-tight">
                    {productDetails.item.name}
                  </h1>
                </div>

                {/* Mobile Price Strip */}
                {defaultUOM && (
                  <div className="w-[calc(100%-3rem)] mt-6 mb-8 bg-[#F8F4E9] rounded-xl p-3 flex items-center justify-between border border-[#F3EEDF]">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{defaultUOM.unit}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-[#231F20]">₹{defaultUOM.price}</span>
                        {defaultUOM.market_price > defaultUOM.price && (
                          <span className="text-sm text-gray-400 line-through">₹{defaultUOM.market_price}</span>
                        )}
                      </div>
                    </div>
                    {/* Action Button: Notify Me OR Add to Cart */}
                    <div
                      className={`${!defaultUOM?.is_available || !productDetails.item.is_available ? 'w-auto' : ''} rounded-full`}
                    >
                      {!defaultUOM?.is_available || !productDetails.item.is_available ? (
                        <button
                          type="button"
                          disabled={isNotified}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isNotified) handleNotifyMe();
                          }}
                          className={`flex items-center justify-center border-[1.5px] font-[SofiaPro] font-bold px-4 py-2 rounded-full transition-colors whitespace-nowrap gap-2 border-[#146321] text-[#146321] ${
                            isNotified ? 'cursor-default' : 'hover:bg-green-50'
                          }`}
                        >
                          {!isNotified && <span className="text-sm">Notify</span>}
                          {isNotified ? (
                            <NotificationsActiveIcon sx={{ fontSize: '1.2rem' }} />
                          ) : (
                            <NotificationsIcon sx={{ fontSize: '1.2rem' }} />
                          )}
                        </button>
                      ) : (
                        <AddItemBtn
                          product={productDetails?.item}
                          varientId={defaultUOM?.variant_id}
                          varientPrice={defaultUOM?.price}
                          stepperQuantity={defaultUOM?.stepper_quantity}
                          buttonType={'yellowaddtocart'}
                          onMaxQuantityExceeded={handleMaxQuantityExceeded}
                          hasRipenessFeature={hasRipenessFeature}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile About Card */}
              {productDescription && (
                <div className="bg-white rounded-[16px] border border-[#EDE6CC]/50 p-5">
                  <h3 className="font-[Recoleta] font-bold text-xl text-[#231F20] mb-3">About</h3>
                  <p className="text-sm text-gray-700 leading-relaxed font-[SofiaPro]">{productDescription}</p>
                </div>
              )}

              <div className="w-full text-start space-y-4">
                <StorageInfo info={productDetails.info} />
                <NutritionBenefits info={productDetails.info} />
              </div>
              <ComboContains productDetails={productDetails} />
            </div>
          ) : (
            // Desktop View
            <div className="space-y-12">
              {/* Top Section Grid */}
              <div className="grid grid-cols-[1fr_1.2fr] gap-12 items-start">
                {/* Left: Product Image Card */}
                <div className="bg-primary-100 rounded-[32px] border border-[#EDE6CC]/50 flex items-center justify-center min-h-[500px] overflow-hidden relative">
                  <div className="relative w-full h-full aspect-square">
                    <ImageGallery
                      mainImage={(isMangoPage ? productDetails.item.website_image : null) || productDetails.item.image}
                      // multipleImages={productDetails.item.multiple_images}
                      productName={productDetails.item.name}
                      isAvailable={defaultUOM?.is_available && productDetails.item.is_available}
                      conversionText={defaultUOM?.conversion_text}
                      hasRipenessFeature={hasRipenessFeature}
                      isDesktop
                      isMangoPage={isMangoPage}
                      tagWithSvg={productDetails.item.tags?.find((tag: any) => tag.svg)}
                    />
                  </div>
                </div>

                {/* Right: Info & Actions */}
                <div className="flex flex-col space-y-8">
                  {/* Breadcrumbs */}
                  <div className="flex items-center gap-2 text-lg font-bold text-[#146321] font-[SofiaPro]">
                    {renderBreadcrumbs()}
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h1 className="text-5xl font-Stinger font-bold text-[#231F20] mb-2 leading-tight">
                      {productDetails.item.name}
                    </h1>
                  </div>

                  {/* Price Strip */}
                  {defaultUOM && (
                    <div className="w-full max-w-md bg-[#FAF9F5] rounded-2xl px-6 py-4 flex items-center justify-between border border-[#F3EEDF]">
                      <div className="flex items-center gap-6">
                        <span className="text-base font-semibold text-gray-900">{defaultUOM.unit}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-[#231F20]">₹{defaultUOM.price}</span>
                          {defaultUOM.market_price > defaultUOM.price && (
                            <span className="text-base text-gray-400 line-through">₹{defaultUOM.market_price}</span>
                          )}
                        </div>
                      </div>
                      <div
                        className={`${!defaultUOM?.is_available || !productDetails.item.is_available ? 'w-auto' : ''} rounded-full`}
                      >
                        {!defaultUOM?.is_available || !productDetails.item.is_available ? (
                          <button
                            type="button"
                            disabled={isNotified}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isNotified) handleNotifyMe();
                            }}
                            className={`flex items-center justify-center border-[1.5px] font-[SofiaPro] font-bold px-4 py-2 rounded-full transition-colors whitespace-nowrap gap-2 border-[#146321] text-[#146321] ${
                              isNotified ? 'cursor-default' : 'hover:bg-green-50'
                            }`}
                          >
                            {!isNotified && <span className="text-sm">Notify</span>}
                            {isNotified ? (
                              <NotificationsActiveIcon sx={{ fontSize: '1.2rem' }} />
                            ) : (
                              <NotificationsIcon sx={{ fontSize: '1.2rem' }} />
                            )}
                          </button>
                        ) : (
                          <AddItemBtn
                            product={productDetails?.item}
                            varientId={defaultUOM?.variant_id}
                            varientPrice={defaultUOM?.price}
                            stepperQuantity={defaultUOM?.stepper_quantity}
                            buttonType={'yellowaddtocart'}
                            onMaxQuantityExceeded={handleMaxQuantityExceeded}
                            hasRipenessFeature={hasRipenessFeature}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* About Card */}
                  {productDescription && (
                    <div className="bg-white rounded-[24px] border border-[#EDE6CC]/50 p-8 w-full">
                      <h3 className="font-Stinger font-bold text-2xl text-[#231F20] mb-4">About</h3>
                      <p className="text-base text-gray-700 leading-relaxed font-[SofiaPro]">{productDescription}</p>
                    </div>
                  )}

                  {/* Combo & Pairing */}
                  <ComboContains productDetails={productDetails} />
                </div>
              </div>

              {/* Secondary Info Grid (Storage, etc. if needed below) */}
              {/* The desktop image shows 'Storing information' as a card. If it was distinct from the Right Col, it would be here. 
                   Based on the image, if 'Storing information' is below 'About', I should put it there. 
                   The prompt image shows 'Storing information' essentially as a separate block.
                   I will put StorageInfo and NutritionBenefits in a row below the main grid. */}

              <div className="flex gap-8 items-start">
                <StorageInfo info={productDetails.info} />
                <NutritionBenefits info={productDetails.info} />
              </div>
            </div>
          )}

          {/* Forgot to Add / Popular Produce */}
          <div className="mt-16">
            {/* <div className="flex items-center justify-between mb-8">
              <h2 className="text-[2.5vw] mob:text-[7vw] font-Stinger font-bold text-[#231F20]">
                Forgot to add?
              </h2>s
            </div> */}
            {/* Use PopularProduce (rebranded) for the list */}
            {productDetails.upsell_items && productDetails.upsell_items.length > 0 && (
              <div className="w-full">
                {/* We reuse the structure by mocking the categoryDetail expected by PopularProduce */}
                <PopularProduce
                  categoryDetail={{
                    title: 'Forgot to add?', // Title handled above
                    data: productDetails.upsell_items
                      .filter((item) => item.multiple_uoms && item.multiple_uoms.length > 0)
                      .map((item) => ({
                        ...item,
                        multiple_uoms: item.multiple_uoms.map((uom) => ({
                          ...uom,
                          formatted_price: `₹${uom.price}`
                        }))
                      }))
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease-out;
          }
        `}</style>
      </div>
    </>
  );
};

export default ProductDetailsWrapper;
