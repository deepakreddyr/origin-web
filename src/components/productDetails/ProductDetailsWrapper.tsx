import { mainApiUrl, protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ItemCard from '../shared/ItemCard';
import AddItemBtn from '../shared/AddItemBtn/AddItemBtn';
import AboutTheProduct from './AboutTheProduct';
import ProductDetailsPageLoader from '../skeletonLoaders/shop/ProductDetailsPageLoader';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import itemRipenessSvg from '/public/assets/svg/itemRipeness.svg';
import BasketBtn from '../shared/AddItemBtn/BasketBtn';

// --- Interfaces ---

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
  basket?: any;
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
  type?: string;
  multiple_images?: string[];
  tag_url: string | null;
  bg_color: string;
  navigation: { to: string; };
  is_greyed: boolean;
  is_available: boolean;
  is_orderable: boolean;
  multiple_uoms: UOM[];
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

// --- Helper Components ---

const MaxQuantityToast: React.FC<{
  maxQuantity: number | null;
  isVisible: boolean;
  onClose: () => void;
}> = ({ maxQuantity, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible || maxQuantity === null) return null;

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-40 transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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

const HungryForMoreSection: React.FC<{ upsellItems: ProductItem[] }> = ({ upsellItems }) => {
  const mobile = useMediaQuery(768);
  if (!upsellItems || upsellItems.length === 0) return null;

  const transformedItems = upsellItems.map(item => ({
    ...item,
    item_name: item.name,
    multiple_uoms: item.multiple_uoms.map(uom => ({
      ...uom,
      formatted_price: `₹${uom.price}`
    }))
  }));

  return (
    <div className="mob:mt-12">
      <div className="flex items-center justify-between mb-8 mob:mb-6">
        <h2 className="text-[2.5vw] mob:text-xl font-[SofiaPro] font-bold text-gray-900 mb-2">Hungry for more?</h2>
      </div>
      <div className={`grid ${mobile ? "grid-cols-2 gap-3" : "grid-cols-4 gap-[5vw]"}`}>
        {transformedItems.slice(0, mobile ? 4 : 8).map((item) => (
          <ItemCard key={item.id} itemDetails={item} />
        ))}
      </div>
    </div>
  );
};

const BestPairingCollapsed: React.FC<{ productDetails: ProductDetails }> = ({ productDetails }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const productId = productDetails.item.id;
  const pairingData = PRODUCT_PAIRINGS[productId];

  if (!pairingData) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between cursor-pointer py-4 border-t" onClick={() => setIsExpanded(prev => !prev)}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 text-base">Best Pairing</h3>
            <p className="text-sm text-gray-500">Recommended By Chef Rhea, Klaa Kitchen</p>
          </div>
        </div>
        <svg className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
      {isExpanded && (
        <div className="bg-[#FFF9E5] border-t p-4 animate-slideDown">
          <div className="ml-9 space-y-4 text-left">
            {pairingData.pairings.map((pairing, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{pairing.name}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{pairing.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Pairing Data Constants ---
const PRODUCT_PAIRINGS: Record<number, { productName: string; pairings: Array<{ name: string; description: string; }>; }> = {
  283: { productName: "Raspberry Imported", pairings: [{ name: "Strawberry", description: "Sweetens the tartness." }, { name: "Spinach", description: "Adds a fresh contrast." }, { name: "Banana", description: "Rounds off sharpness." }] },
  358: { productName: "Enoki Mushrooms", pairings: [{ name: "Asparagus", description: "Adds crisp texture." }, { name: "Spring Onion", description: "Gives a mild bite." }, { name: "Zucchini", description: "Subtle sweetness." }] },
  377: { productName: "Hydroponic Butterhead Lettuce", pairings: [{ name: "Cucumber", description: "Adds crunch." }, { name: "Tomato", description: "Juicy acidity." }, { name: "Carrot", description: "Sweetness and color." }] },
  84: { productName: "Muskmelon Indian", pairings: [{ name: "Cucumber", description: "Enhances freshness." }, { name: "Watermelon", description: "Amplifies sweetness." }, { name: "Mint", description: "Fresh herbal lift." }] }
};

// --- Main Component ---

const ProductDetailsWrapper = () => {
  const mobile = useMediaQuery(768);
  const router = useRouter();
  const { isReady, query } = router;
  const getDataFromApi = useGetDataFromApi();

  // State
  const [productDetails, setProductDetails] = useState<ProductDetails>({
    item: { id: 0, item_code: '', name: '', image: '', tag_url: null, bg_color: '', navigation: { to: '' }, is_greyed: false, is_available: true, is_orderable: false, multiple_uoms: [] },
    info: { info: [] },
    upsell_items: [],
    combo_items: [],
    isLoading: true
  });
  const [showMaxQuantityToast, setShowMaxQuantityToast] = useState(false);
  const [toastMaxQuantity, setToastMaxQuantity] = useState<number | null>(null);

  // Basket logic states
  const [shouldOpenBasket, setShouldOpenBasket] = useState(false);
  const [basketVariantId, setBasketVariantId] = useState<number | null>(null);

  const handleMaxQuantityExceeded = (maxQty: number) => {
    setToastMaxQuantity(maxQty);
    setShowMaxQuantityToast(true);
  };

  // 1. Fetch Data
  useEffect(() => {
    if (isReady && query.id) {
      const token = localStorage.getItem('user_token');
      const addressFromLs = getAddressAndStoreId();
      let additionalHeaders: Record<string, string> = {};
      let apiUrl: string;

      if (token) {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['searchForProduct'] + `/${query.id}`;
        if (addressFromLs) additionalHeaders = { 'store-id': addressFromLs.store_id };
      } else {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['searchForProduct'] + `/${query.id}`;
      }

      getDataFromApi(apiUrl,
        (data: any) => { if (data?.data) setProductDetails({ ...data.data, isLoading: false }); },
        () => setProductDetails(prev => ({ ...prev, isLoading: false })),
        additionalHeaders
      );
    }
  }, [isReady, query.id]);

  // 2. Detect deep link to open basket
  useEffect(() => {
    if (!productDetails.isLoading && isReady && query.openBasket === 'true' && query.variantId) {
      const varId = parseInt(query.variantId as string);
      if (productDetails.item.type === 'basket') {
        setBasketVariantId(varId);
        const timer = setTimeout(() => setShouldOpenBasket(true), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [productDetails.isLoading, isReady, query.openBasket, query.variantId, productDetails.item.type]);

  // 3. Clean up URL after opening
  useEffect(() => {
    if (shouldOpenBasket && isReady) {
      const { openBasket, variantId, ...restQuery } = router.query;
      router.replace({ pathname: router.pathname, query: restQuery }, undefined, { shallow: true });
    }
  }, [shouldOpenBasket, isReady]);

  const defaultUOM: UOM | undefined = productDetails?.item?.multiple_uoms?.find((uom: UOM) => uom?.is_default === true) || productDetails?.item?.multiple_uoms?.[0];
  const hasRipenessFeature = !!(defaultUOM?.ripeness_types && defaultUOM.ripeness_types.length > 0);
  const buttonTypeToPass = productDetails.item.type === 'basket' ? 'basketbtn' : 'yellowaddtocart';
  const aboutSection = productDetails.info?.info?.find(section => section.type === 'normal' && section.title === 'About the Product');
  const productDescription = aboutSection?.details?.[0]?.description || '';

  // SEO & Schema
  const seoData = {
    title: `${productDetails.item.name || 'Product'} - Buy Online`,
    description: productDescription.substring(0, 160) || `Buy ${productDetails.item.name} online.`,
    image: productDetails.item.image,
    price: defaultUOM?.price || 0,
    currency: 'INR',
    availability: productDetails.item.is_available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    url: typeof window !== 'undefined' ? window.location.href : ''
  };

  if (productDetails.isLoading) return <ProductDetailsPageLoader />;

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta property="og:image" content={seoData.image} />
        <link rel="canonical" href={seoData.url} />
      </Head>

      <div className="mt-[4vw]" style={{ backgroundColor: '#FFF9E5' }}>
        <MaxQuantityToast maxQuantity={toastMaxQuantity} isVisible={showMaxQuantityToast} onClose={() => setShowMaxQuantityToast(false)} />

        <div className="max-w-6xl mx-auto px-8 py-12 mob:px-4 mob:py-6">
          {mobile ? (
            <div className="space-y-8">
              <div className="flex justify-center">
                <div className="relative w-80 h-80 bg-transparent">
                  <Image src={productDetails.item.image} fill alt={productDetails.item.name || "Product"} style={{ objectFit: 'contain' }} priority />
                  {hasRipenessFeature && <div className="absolute bottom-2 right-2 z-10"><Image src={itemRipenessSvg} alt='Ripeness' width={50} height={50} /></div>}
                </div>
              </div>
              <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">{productDetails.item.name}</h1>
                {defaultUOM && (
                  <>
                    <div className="text-2xl font-[SofiaPro] font-bold text-gray-900">₹{defaultUOM.price}</div>
                    <div className="text-gray-500 font-[SofiaPro] text-sm">{defaultUOM.unit}</div>
                  </>
                )}
                <div className='font-[SofiaPro]'>
                  {productDetails.item.type === 'basket' ? (
                    <BasketBtn
                      product={productDetails.item as any}
                      variantId={basketVariantId || defaultUOM?.variant_id || 0}
                      onMaxQuantityExceeded={handleMaxQuantityExceeded}
                      shouldOpenOnMount={shouldOpenBasket}
                      onPopupClose={() => { setShouldOpenBasket(false); setBasketVariantId(null); }}
                    />
                  ) : (
                    <AddItemBtn
                      product={productDetails?.item}
                      varientId={defaultUOM?.variant_id}
                      varientPrice={defaultUOM?.price}
                      stepperQuantity={defaultUOM?.stepper_quantity}
                      buttonType={buttonTypeToPass}
                      onMaxQuantityExceeded={handleMaxQuantityExceeded}
                      hasRipenessFeature={hasRipenessFeature}
                    />
                  )}
                </div>
                {productDescription && <p className="text-gray-700 leading-relaxed text-sm mt-6">{productDescription}</p>}
                <BestPairingCollapsed productDetails={productDetails} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-16 min-h-[550px]">
              <div className="flex-1 flex justify-center">
                <div className="relative w-96 h-96 bg-transparent">
                  <Image src={productDetails.item.image} fill alt={productDetails.item.name} style={{ objectFit: 'contain' }} className="drop-shadow-xl" priority />
                  {hasRipenessFeature && <div className="absolute top-2 right-2 z-0"><Image src={itemRipenessSvg} alt='Ripeness' width={70} height={70} /></div>}
                </div>
              </div>
              <div className="flex-1 max-w-lg space-y-6">
                <div className="text-left">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">{productDetails.item.name}</h1>
                  {defaultUOM && (
                    <>
                      <div className="text-2xl font-bold text-gray-900 mb-1">₹{defaultUOM.price}</div>
                      <div className="text-gray-500 text-sm mb-6">{defaultUOM.unit}</div>
                    </>
                  )}
                </div>
                <div className='font-[SofiaPro] w-full'>
                  {productDetails.item.type === 'basket' ? (
                    <BasketBtn
                      product={productDetails.item as any}
                      variantId={basketVariantId || defaultUOM?.variant_id || 0}
                      onMaxQuantityExceeded={handleMaxQuantityExceeded}
                      shouldOpenOnMount={shouldOpenBasket}
                      onPopupClose={() => { setShouldOpenBasket(false); setBasketVariantId(null); }}
                    />
                  ) : (
                    <AddItemBtn
                      product={productDetails?.item}
                      varientId={defaultUOM?.variant_id}
                      varientPrice={defaultUOM?.price}
                      stepperQuantity={defaultUOM?.stepper_quantity}
                      buttonType="yellowaddtocart"
                      onMaxQuantityExceeded={handleMaxQuantityExceeded}
                      hasRipenessFeature={hasRipenessFeature}
                    />
                  )}
                </div>
                {productDescription && <p className="text-gray-700 leading-relaxed text-left">{productDescription}</p>}
                <BestPairingCollapsed productDetails={productDetails} />
              </div>
            </div>
          )}
          <div className="mt-12 space-y-8"><AboutTheProduct productDetails={productDetails} /></div>
          <HungryForMoreSection upsellItems={productDetails.upsell_items} />
        </div>

        <style jsx>{`
          @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-slideDown { animation: slideDown 0.3s ease-out; }
        `}</style>
      </div>
    </>
  );
};

export default ProductDetailsWrapper;