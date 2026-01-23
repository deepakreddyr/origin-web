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
  ripeness_types?: string[]; // KEY PROPERTY TO CHECK
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
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-40 transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
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

// Product pairing data
const PRODUCT_PAIRINGS: Record<number, {
  productName: string;
  pairings: Array<{ name: string; description: string; }>;
}> = {
  283: {
    productName: "Raspberry Imported",
    pairings: [
      { name: "Strawberry", description: "Sweetens the tartness. Works well in salads or fruit bowls." },
      { name: "Spinach", description: "Adds a fresh, leafy contrast. Enhances smoothies effortlessly." },
      { name: "Banana", description: "Rounds off the sharpness with creamy sweetness. Try the pair in parfaits or shakes." }
    ]
  },
  358: {
    productName: "Enoki Mushrooms",
    pairings: [
      { name: "Asparagus", description: "Adds crisp, earthy texture. Works beautifully in stir-fries or soups." },
      { name: "Spring Onion", description: "Gives a mild, fresh bite. Tastes the best in hot pots." },
      { name: "Zucchini", description: "Complements with subtle sweetness. Pairs wonderfully in sautés or bowls." }
    ]
  },
  377: {
    productName: "Hydroponic Butterhead Lettuce",
    pairings: [
      { name: "Cucumber", description: "Adds crunch and coolness. Perfect in salads or wraps." },
      { name: "Tomato", description: "Brings juicy, mild acidity. Enhances sandwiches or bowls." },
      { name: "Carrot", description: "Adds sweetness and color. Ideal in salads or slaws." }
    ]
  },
  84: {
    productName: "Muskmelon Indian",
    pairings: [
      { name: "Cucumber", description: "Enhances freshness and crunch. Adds a crisp touch to salads or juices." },
      { name: "Watermelon", description: "Amplifies the fruity sweetness. Brightens chilled bowls or drinks." },
      { name: "Mint", description: "Adds a fresh herbal lift. Complements fruit salads or drinks effortlessly." }
    ]
  }
};

// Hungry for More Section
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
        <h2 className="text-[2.5vw] mob:text-xl font-[SofiaPro] font-bold text-gray-900 mb-2">
          Hungry for more?
        </h2>
      </div>
      <div className={`grid ${mobile ? "grid-cols-2 gap-3" : "grid-cols-4 gap-[5vw]"}`}>
        {transformedItems.slice(0, mobile ? 4 : 8).map((item) => (
          <ItemCard key={item.id} itemDetails={item} />
        ))}
      </div>
    </div>
  );
};

// Best Pairing Section
const BestPairingCollapsed: React.FC<{ productDetails: ProductDetails }> = ({ productDetails }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const productId = productDetails.item.id;
  const pairingData = PRODUCT_PAIRINGS[productId];

  if (!pairingData) return null;

  return (
    <div className="mt-8">
      <div
        className="flex items-center justify-between cursor-pointer py-4 border-t"
        onClick={() => setIsExpanded(prev => !prev)}
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">Best Pairing</h3>
            <p className="text-sm text-gray-500">Recommended By Chef Rhea, Klaa Kitchen</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {isExpanded && (
        <div className="bg-[#FFF9E5] border-t p-4 animate-slideDown">
          <div className="ml-9 space-y-4">
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
// Combo Contains Section
const ComboContains: React.FC<{ productDetails: ProductDetails }> = ({ productDetails }) => {
  if (!productDetails.combo_items || productDetails.combo_items.length === 0) return null;

  const defaultUOM = productDetails.item.multiple_uoms?.find(uom => uom.is_default) || productDetails.item.multiple_uoms?.[0];
  const totalItems = productDetails.combo_items.length;

  return (
    <div className="mt-8 bg-[#FAF7F0] rounded-[24px] border border-[#EDE6CC]/50 p-6 mob:p-5">
      <h3 className="font-Stinger font-bold text-2xl mob:text-xl text-[#231F20] mb-5 text-center">
        Combo contains
      </h3>

      <div className="grid grid-cols-[1fr_auto_auto] items-stretch gap-x-4 mb-2">
        {productDetails.combo_items.map((item, index) => {
          const isLast = index === productDetails.combo_items.length - 1;
          const borderClass = isLast ? "" : "border-b border-[#EDE6CC]/30";

          // Parse name for sub-description (e.g., "Arbi (Colocassia Taro)")
          const nameParts = item.item_name.match(/([^(]+)(?:\(([^)]+)\))?/);
          const name = nameParts ? nameParts[1].trim() : item.item_name;
          const subName = nameParts?.[2]?.trim();

          return (
            <React.Fragment key={index}>
              <div className={`py-4 ${borderClass} text-start flex flex-col justify-center`}>
                <p className="font-[SofiaPro] font-bold text-base mob:text-sm text-[#231F20] leading-tight">
                  {name}
                </p>
                {subName && (
                  <p className="font-[SofiaPro] italic text-xs text-[#231F20]/60">
                    {subName}
                  </p>
                )}
              </div>
              <div className={`py-4 ${borderClass} flex items-center justify-center min-w-[3rem]`}>
                <p className="font-[SofiaPro] text-base mob:text-sm text-[#231F20]/70">
                  {item.qty}
                </p>
              </div>
              <div className={`py-4 ${borderClass} flex items-center justify-end min-w-[5rem]`}>
                <p className="font-[SofiaPro] text-base mob:text-sm text-[#231F20]/70">
                  {item.uom}
                </p>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#EDE6CC]">
        <p className="font-[SofiaPro] font-bold text-lg text-[#231F20]">
          Total ({totalItems} items)
        </p>
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
  const storageSection = info?.info?.find(section => section.type === 'storage');
  if (!storageSection || !storageSection.details || storageSection.details.length === 0) return null;

  return (
    <div className="mt-4 w-[443px] mob:w-full bg-white rounded-[16px] border border-[#EDE6CC]/50 p-4 pb-[16px]">
      <h3 className="font-Stinger font-bold text-xl text-[#231F20] mb-4 text-start">
        Storing information
      </h3>
      <div className="flex flex-row overflow-x-auto gap-[12px] no-scrollbar">
        {storageSection.details.map((detail: any, index: number) => (
          <div key={index} className="flex-shrink-0 w-[184px] h-[50px] bg-[#FAF8F1] rounded-[12px] pt-[12px] pr-[32px] pb-[12px] pl-[12px] flex items-center gap-[10px] border border-[#EDE6CC]/20 overflow-hidden">
            <div className="w-6 h-6 relative flex-shrink-0 bg-white rounded-full p-1">
              <Image src={detail.image} alt={detail.title} fill className="object-contain p-1" />
            </div>
            <div className="min-w-0">
              <p className="font-[SofiaPro] font-bold text-[13px] text-[#231F20] leading-tight truncate">
                {detail.title}
              </p>
              <p className="font-[SofiaPro] text-[10px] text-[#231F20]/70 leading-tight truncate">
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
  const nutritionSection = info?.info?.find(section => section.type === 'nutrition');
  if (!nutritionSection || !nutritionSection.details || nutritionSection.details.length === 0) return null;

  return (
    <div className="mt-4 w-[443px] mob:w-full bg-white rounded-[16px] border border-[#EDE6CC]/50 p-4 pb-[16px]">
      <h3 className="font-Stinger font-bold text-xl text-[#231F20] mb-4 text-start">
        Nutrition benefits
      </h3>
      <div className="flex flex-row overflow-x-auto gap-[12px] no-scrollbar">
        {nutritionSection.details.map((detail: any, index: number) => (
          <div key={index} className="flex-shrink-0 w-[184px] h-[50px] bg-[#FAF8F1] rounded-[12px] pt-[12px] pr-[32px] pb-[12px] pl-[12px] flex flex-col justify-center border border-[#EDE6CC]/20 overflow-hidden">
            <p className="font-[SofiaPro] font-bold text-base text-[#231F20] leading-tight truncate">
              {detail.title}
            </p>
            <p className="font-[SofiaPro] text-[9px] text-[#231F20]/70 uppercase tracking-wide truncate">
              {detail.description}
            </p>
          </div>
        ))}
      </div>
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

  const handleMaxQuantityExceeded = (maxQty: number) => {
    setToastMaxQuantity(maxQty);
    setShowMaxQuantityToast(true);
  };

  const getDataFromApi = useGetDataFromApi();
  const router = useRouter();
  const { isReady, query } = router;

  useEffect(() => {
    if (isReady) {
      const token = localStorage.getItem('user_token');
      const addressFromLs = getAddressAndStoreId();
      let additionalHeaders: Record<string, string> = {};

      let apiUrl: string;

      if (token) {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['searchForProduct'] + `/${query.id}`;

        if (addressFromLs) {
          additionalHeaders = {
            'store-id': addressFromLs.store_id
          };
        }
      } else {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['searchForProduct'] + `/${query.id}`;
      }

      const successHandler = (data: any) => {
        if (data?.data) {
          setProductDetails({ ...data.data, isLoading: false });
        }
      };

      const failureHandler = (data: any) => {
        setProductDetails(prev => ({ ...prev, isLoading: false }));
      };

      getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
    }
  }, [isReady]);

  // Find default UOM
  const defaultUOM: UOM | undefined = productDetails?.item?.multiple_uoms?.find((uom: UOM) => uom?.is_default === true) || productDetails?.item?.multiple_uoms?.[0];

  // CHECK FOR RIPENESS FEATURE: Check if the array exists and has content
  const hasRipenessFeature = !!(defaultUOM?.ripeness_types && defaultUOM.ripeness_types.length > 0);

  // Get product description
  const aboutSection = productDetails.info?.info?.find(section => section.type === 'normal' && section.title === 'About the Product');
  const productDescription = aboutSection?.details?.[0]?.description || '';

  // Generate SEO data
  const seoData = {
    title: `${productDetails.item.name || 'Product'} - Buy Online`,
    description: productDescription.substring(0, 160) || `Buy ${productDetails.item.name} online. Fresh and high-quality products delivered to your doorstep.`,
    image: productDetails.item.image,
    price: defaultUOM?.price || 0,
    currency: 'INR',
    availability: productDetails.item.is_available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    url: typeof window !== 'undefined' ? window.location.href : ''
  };

  // JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": seoData.title,
    "image": seoData.image,
    "description": seoData.description,
    "offers": {
      "@type": "Offer",
      "url": seoData.url,
      "priceCurrency": seoData.currency,
      "price": seoData.price,
      "availability": seoData.availability,
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  if (productDetails.isLoading) return <ProductDetailsPageLoader />;

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="title" content={seoData.title} />
        <meta name="description" content={seoData.description} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.image} />
        <meta property="product:price:amount" content={seoData.price.toString()} />
        <meta property="product:price:currency" content={seoData.currency} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={seoData.url} />
        <meta property="twitter:title" content={seoData.title} />
        <meta property="twitter:description" content={seoData.description} />
        <meta property="twitter:image" content={seoData.image} />
        <link rel="canonical" href={seoData.url} />
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="mt-[4vw]" style={{ backgroundColor: '#FFF9E5' }}>
        {/* Max Quantity Toast */}
        <MaxQuantityToast
          maxQuantity={toastMaxQuantity}
          isVisible={showMaxQuantityToast}
          onClose={() => setShowMaxQuantityToast(false)}
        />

        <div className="max-w-6xl mx-auto py-7 mob:px-4 mob:py-6">
          {mobile ? (
            <div className="space-y-8">
              <div className="flex flex-col items-start">
                <div className="relative w-80 h-80 bg-transparent self-center">
                  <Image
                    src={productDetails.item.image}
                    fill
                    alt={productDetails.item.name || "Product"}
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                  {/* --- NEW: Ripeness SVG positioned absolutely --- */}
                  {hasRipenessFeature && (
                    <div className="absolute bottom-2 right-2 z-10">
                      <Image src={itemRipenessSvg} alt='Select ripeness' width={28} height={28} />
                    </div>
                  )}
                  {/* --- END NEW --- */}
                </div>
              </div>
              <div className="text-center space-y-4">
                <h1 className="text-4xl mob:text-[8vw] font-Stinger font-bold text-[#231F20] leading-tight">
                  {productDetails.item.name}
                </h1>

                {/* {defaultUOM && ( */}
                {/* <> */}
                {/* <div className="text-2xl font-[SofiaPro] font-bold text-gray-900">
                      ₹{defaultUOM.price}
                    </div> */}
                {/* Removed the old centralized Image component here */}
                {/* <div className="text-gray-500 font-[SofiaPro] text-sm">{defaultUOM.unit}</div> */}
                {/* </> */}
                {/* )} */}

                <div className='font-[SofiaPro]'>
                  <AddItemBtn
                    product={productDetails?.item}
                    varientId={defaultUOM?.variant_id}
                    varientPrice={defaultUOM?.price}
                    stepperQuantity={defaultUOM?.stepper_quantity}
                    buttonType={'yellowaddtocart'}
                    onMaxQuantityExceeded={handleMaxQuantityExceeded}
                    // 👇 Pass the check result to AddItemBtn for conditional rendering
                    hasRipenessFeature={hasRipenessFeature}
                  />
                </div>

                <div className="w-full text-start space-y-4">
                  <StorageInfo info={productDetails.info} />
                  <NutritionBenefits info={productDetails.info} />
                </div>

                {productDescription && (
                  <p className="text-gray-700 leading-relaxed text-sm mt-6">{productDescription}</p>
                )}

                <BestPairingCollapsed productDetails={productDetails} />
                <ComboContains productDetails={productDetails} />
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-16 min-h-[550px]">
              <div className="flex-1 flex flex-col items-start">
                {/* --- DESKTOP VIEW: Image Container UPDATED for relative positioning --- */}
                <div className="relative w-96 h-96 bg-transparent">
                  <Image
                    src={productDetails.item.image}
                    fill
                    alt={productDetails.item.name || "Product"}
                    style={{ objectFit: 'contain' }}
                    className="drop-shadow-xl"
                    priority
                  />
                  {/* --- NEW: Ripeness SVG positioned absolutely --- */}
                  {hasRipenessFeature && (
                    <div className="absolute top-2 right-2 z-0">
                      <Image src={itemRipenessSvg} alt='Select ripeness' width={70} height={70} />
                    </div>
                  )}
                  {/* --- END NEW --- */}
                </div>
                <div className="w-96 mt-6 space-y-4">
                  <StorageInfo info={productDetails.info} />
                  <NutritionBenefits info={productDetails.info} />
                </div>
              </div>

              <div className="flex-1 max-w-lg space-y-6">
                <div>
                  <h1 className="text-4xl font-Stinger font-bold text-[#231F20] mb-3 leading-tight">
                    {productDetails.item.name}
                  </h1>

                  {defaultUOM && (
                    <>
                      <div className="text-2xl font-bold text-gray-900 mb-1">₹{defaultUOM.price}</div>
                      <div className="text-gray-500 text-sm mb-6">{defaultUOM.unit}</div>
                    </>
                  )}
                </div>

                <AddItemBtn
                  product={productDetails?.item}
                  varientId={defaultUOM?.variant_id}
                  varientPrice={defaultUOM?.price}
                  stepperQuantity={defaultUOM?.stepper_quantity}
                  buttonType={'yellowaddtocart'}
                  onMaxQuantityExceeded={handleMaxQuantityExceeded}
                  // 👇 Pass the check result to AddItemBtn for conditional rendering
                  hasRipenessFeature={hasRipenessFeature}
                />

                {productDescription && (
                  <p className="text-gray-700 leading-relaxed">{productDescription}</p>
                )}

                <BestPairingCollapsed productDetails={productDetails} />
                <ComboContains productDetails={productDetails} />
              </div>
            </div>
          )}

          <div className="mt-12 space-y-8">
            <AboutTheProduct productDetails={productDetails} />
          </div>

          <HungryForMoreSection upsellItems={productDetails.upsell_items} />
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