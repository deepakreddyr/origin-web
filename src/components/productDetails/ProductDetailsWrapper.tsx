import { mainApiUrl, protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import StoringInfo from './StoringInfo';
import BreadCrumbNavigation from './BreadCrumbNavigation';
import ItemCard from '../shared/ItemCard';
import AddItemBtn from '../shared/AddItemBtn/AddItemBtn';
import NutritionInfo from './NutritionInfo';
import ItemQuantityAndCta from './ItemQuantityAndCta';
import AboutTheProduct from './AboutTheProduct';
import ForgetItemWrapper from './ForgetItemWrapper';
import ProductDetailsPageLoader from '../skeletonLoaders/shop/ProductDetailsPageLoader';
import backIcon from '/public/assets/icons/backIcon.png';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';

// Updated Type definitions based on actual API response
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
  ripeness_types: any;
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
  multiple_images: string[];
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



// Hungry for More Section Component
const HungryForMoreSection: React.FC<{ upsellItems: ProductItem[] }> = ({ upsellItems }) => {
  const mobile = useMediaQuery(768);

  if (!upsellItems || upsellItems.length === 0) {
    return null;
  }

  // Transform upsell items to match ItemCard expected format
  const transformedItems = upsellItems.map(item => ({
    ...item,
    item_name: item.name, // Map name to item_name for routing
    multiple_uoms: item.multiple_uoms.map(uom => ({
      ...uom,
      formatted_price: `₹${uom.price}` // Add formatted_price for ItemCard
    }))
  }));

  return (
    <div className="mob:mt-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 mob:mb-6">
        <div>
          <h2 className="text-[2.5vw] mob:text-xl font-[SofiaPro] font-bold text-gray-900 mb-2">
            Hungry for more?
          </h2>
        </div>
      </div>

      {/* Products Grid using existing ItemCard */}
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

  const aboutSection = productDetails.info?.info?.find(
    section => section.type === 'normal' && section.title === 'About the Product'
  );

  return (
    <div className="mt-8">
      {/* Toggle Button */}
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
          className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Dropdown Content - Now pushes content below */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#FFF9E5] border-t p-4">
          <div className="ml-9 space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1 text-sm">Coconut</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Enhances its tropical, creamy notes. Try in smoothies or panna cotta.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1 text-sm">Lime or Lemongrass</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Balances the sweetness with a zesty lift. Great in sorbets or drinks.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1 text-sm">Mint or Thai Basil</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Adds a refreshing herbal contrast in salads or garnishes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailsWrapper: React.FC = () => {
  const mobile: boolean = useMediaQuery(768);
  const [productDetails, setProductDetails] = useState<ProductDetails>({
    item: {
      id: 0,
      item_code: '',
      name: '',
      image: '',
      multiple_images: [],
      tag_url: null,
      bg_color: '',
      navigation: {
        to: ''
      },
      is_greyed: false,
      is_available: true,
      is_orderable: false,
      multiple_uoms: []
    },
    info: {
      info: []
    },
    upsell_items: [],
    combo_items: [],
    isLoading: true
  });

  const getDataFromApi = useGetDataFromApi();
  const router = useRouter();
  const { isReady, query } = router;

  useEffect(() => {
    if (isReady) {
      const token: string | null = localStorage.getItem('user_token');
      const addressFromLs = getAddressAndStoreId();
      let additionalHeaders: Record<string, string> = {};

      let apiUrl: string;

      if (token) {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['searchForProduct'] + `/${query.id}`;

        if (addressFromLs)
          additionalHeaders = {
            'store-id': addressFromLs.store_id
          };
      } else {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['searchForProduct'] + `/${query.id}`;
      }

      const successHandler = (data: any) => {
        if (data?.data) setProductDetails({ ...productDetails, ...data.data, isLoading: false });
      };
      const failureHandler = (data: any) => {};
      getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
    }
  }, [isReady]);

  if (productDetails.isLoading) return <ProductDetailsPageLoader />;
  
  // Find default UOM or use first one
  const defaultUOM: UOM = productDetails?.item?.multiple_uoms?.find((uom: UOM) => uom?.is_default === true) || productDetails?.item?.multiple_uoms?.[0];

  // Get About the Product description
  const aboutSection = productDetails.info?.info?.find(section => section.type === 'normal' && section.title === 'About the Product');
  const productDescription = aboutSection?.details?.[0]?.description || '';

  return (
    <div className="mt-[4vw]" style={{ backgroundColor: '#FFF9E5' }}>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-8 py-12 mob:px-4 mob:py-6">
        
        {/* Mobile Layout */}
        {mobile ? (
          <div className="space-y-8">
            {/* Product Image */}
            <div className="flex justify-center">
              <div className="relative w-80 h-80 bg-transparent">
                <Image 
                  src={productDetails.item.image} 
                  fill 
                  alt={productDetails.item.name || "Product"} 
                  style={{ objectFit: 'contain' }} 
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {productDetails.item.name}
              </h1>
              
              {defaultUOM && (
                <>
                  <div className="text-2xl font-[SofiaPro] font-bold text-gray-900">
                    Rs.{defaultUOM.price}
                  </div>
                  <div className="text-gray-500 font-[SofiaPro] text-sm">
                    {defaultUOM.unit}
                  </div>
                </>
              )}

              <div className='font-[SofiaPro]'>
                <AddItemBtn
                  product={productDetails?.item}
                  varientId={defaultUOM?.variant_id}
                  varientPrice={defaultUOM?.price}
                  stepperQuantity={defaultUOM?.stepper_quantity}
                  buttonType={'yellowaddtocart'}
                />
              </div>

              {productDescription && (
                <p className="text-gray-700 leading-relaxed text-sm mt-6">
                  {productDescription}
                </p>
              )}

              <BestPairingCollapsed productDetails={productDetails} />
            </div>
          </div>
        ) : (
          /* Desktop Layout - Horizontal */
          <div className="flex items-center gap-16 min-h-[550px]">
            {/* Left Side - Product Image */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-96 h-96 bg-transparent">
                <Image 
                  src={productDetails.item.image} 
                  fill 
                  alt={productDetails.item.name || "Product"} 
                  style={{ objectFit: 'contain' }} 
                  className="drop-shadow-xl"
                />
              </div>
            </div>

            {/* Right Side - Product Information */}
            <div className="flex-1 max-w-lg space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  {productDetails.item.name}
                </h1>
                
                {defaultUOM && (
                  <>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      Rs.{defaultUOM.price}
                    </div>
                    <div className="text-gray-500 text-sm mb-6">
                      {defaultUOM.unit}
                    </div>
                  </>
                )}
              </div>

              <div className=''>
                <AddItemBtn
                  product={productDetails?.item}
                  varientId={defaultUOM?.variant_id}
                  varientPrice={defaultUOM?.price}
                  stepperQuantity={defaultUOM?.stepper_quantity}
                  buttonType={'yellowaddtocart'}
                />
              </div>

              {productDescription && (
                <p className="text-gray-700 leading-relaxed">
                  {productDescription}
                </p>
              )}

              <BestPairingCollapsed productDetails={productDetails} />
            </div>
          </div>
        )}

        {/* Additional Components */}
        <div className="mt-12 space-y-8">
          <AboutTheProduct productDetails={productDetails} />
        </div>

        {/* Hungry for More Section */}
        <HungryForMoreSection upsellItems={productDetails.upsell_items} />

      </div>

      <style jsx>{`
        .border-l-3 {
          border-left-width: 3px;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProductDetailsWrapper;