import { mainApiUrl, protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
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
import { GetServerSideProps } from 'next';

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
}

interface ProductDetailsWrapperProps {
  initialProductDetails: ProductDetails;
  seoData: {
    title: string;
    description: string;
    image: string;
    price: number;
    currency: string;
    availability: string;
    url: string;
  };
}

// Product pairing data configuration
const PRODUCT_PAIRINGS: Record<number, {
  productName: string;
  pairings: Array<{
    name: string;
    description: string;
  }>;
}> = {
  283: {
    productName: "Raspberry Imported",
    pairings: [
      {
        name: "Strawberry",
        description: "Sweetens the tartness. Works well in salads or fruit bowls."
      },
      {
        name: "Spinach",
        description: "Adds a fresh, leafy contrast. Enhances smoothies effortlessly."
      },
      {
        name: "Banana",
        description: "Rounds off the sharpness with creamy sweetness. Try the pair in parfaits or shakes."
      }
    ]
  },
  358: {
    productName: "Enoki Mushrooms",
    pairings: [
      {
        name: "Asparagus",
        description: "Adds crisp, earthy texture. Works beautifully in stir-fries or soups."
      },
      {
        name: "Spring Onion",
        description: "Gives a mild, fresh bite. Tastes the best in hot pots."
      },
      {
        name: "Zucchini",
        description: "Complements with subtle sweetness. Pairs wonderfully in sautés or bowls."
      }
    ]
  },
  377: {
    productName: "Hydroponic Butterhead Lettuce",
    pairings: [
      {
        name: "Cucumber",
        description: "Adds crunch and coolness. Perfect in salads or wraps."
      },
      {
        name: "Tomato",
        description: "Brings juicy, mild acidity. Enhances sandwiches or bowls."
      },
      {
        name: "Carrot",
        description: "Adds sweetness and color. Ideal in salads or slaws."
      }
    ]
  },
  84: {
    productName: "Muskmelon Indian",
    pairings: [
      {
        name: "Cucumber",
        description: "Enhances freshness and crunch. Adds a crisp touch to salads or juices."
      },
      {
        name: "Watermelon",
        description: "Amplifies the fruity sweetness. Brightens chilled bowls or drinks."
      },
      {
        name: "Mint",
        description: "Adds a fresh herbal lift. Complements fruit salads or drinks effortlessly."
      }
    ]
  }
};

// Hungry for More Section Component
const HungryForMoreSection: React.FC<{ upsellItems: ProductItem[] }> = ({ upsellItems }) => {
  const mobile = useMediaQuery(768);

  if (!upsellItems || upsellItems.length === 0) {
    return null;
  }

  // Transform upsell items to match ItemCard expected format
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
        <div>
          <h2 className="text-[2.5vw] mob:text-xl font-[SofiaPro] font-bold text-gray-900 mb-2">
            Hungry for more?
          </h2>
        </div>
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
  
  if (!pairingData) {
    return null;
  }

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

      {isExpanded && (
        <div className="bg-[#FFF9E5] border-t p-4 animate-slideDown">
          <div className="ml-9 space-y-4">
            {pairingData.pairings.map((pairing, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{pairing.name}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {pairing.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProductDetailsWrapper: React.FC<ProductDetailsWrapperProps> = ({ 
  initialProductDetails,
  seoData 
}) => {
  const mobile: boolean = useMediaQuery(768);
  const router = useRouter();

  const productDetails = initialProductDetails;
  
  // Find default UOM or use first one
  const defaultUOM: UOM = productDetails?.item?.multiple_uoms?.find((uom: UOM) => uom?.is_default === true) || productDetails?.item?.multiple_uoms?.[0];

  // Get About the Product description
  const aboutSection = productDetails.info?.info?.find(section => section.type === 'normal' && section.title === 'About the Product');
  const productDescription = aboutSection?.details?.[0]?.description || '';

  // Generate JSON-LD structured data for SEO
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

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{seoData.title}</title>
        <meta name="title" content={seoData.title} />
        <meta name="description" content={seoData.description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.image} />
        <meta property="product:price:amount" content={seoData.price.toString()} />
        <meta property="product:price:currency" content={seoData.currency} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={seoData.url} />
        <meta property="twitter:title" content={seoData.title} />
        <meta property="twitter:description" content={seoData.description} />
        <meta property="twitter:image" content={seoData.image} />
        
        {/* Additional SEO tags */}
        <link rel="canonical" href={seoData.url} />
        <meta name="robots" content="index, follow" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

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
                    priority
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
                    priority
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

// Server-Side Props - This runs on the server for every request
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const { req } = context;

  try {
    // Get token from cookies if available
    const token = req.cookies.user_token || null;
    const storeId = req.cookies.store_id || null;

    let apiUrl: string;
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Construct API URL based on authentication
    if (token) {
      apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${protectedUrl['searchForProduct']}/${id}`;
      headers['Authorization'] = `Bearer ${token}`;
      
      if (storeId) {
        headers['store-id'] = storeId;
      }
    } else {
      apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${unprotectedUrl['searchForProduct']}/${id}`;
    }

    // Fetch product data from API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const apiData = await response.json();
    const productData = apiData.data;

    // Extract SEO data
    const defaultUOM = productData.item.multiple_uoms?.find((uom: UOM) => uom.is_default) || productData.item.multiple_uoms?.[0];
    const aboutSection = productData.info?.info?.find((section: InfoSection) => section.type === 'normal' && section.title === 'About the Product');
    const description = aboutSection?.details?.[0]?.description || `Buy ${productData.item.name} online. Fresh and high-quality products delivered to your doorstep.`;

    // Prepare SEO data
    const seoData = {
      title: `${productData.item.name} - Buy Online | Your Store Name`,
      description: description.substring(0, 160), // Meta descriptions should be ~150-160 chars
      image: productData.item.image,
      price: defaultUOM?.price || 0,
      currency: 'INR',
      availability: productData.item.is_available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/product/${id}`,
    };

    return {
      props: {
        initialProductDetails: productData,
        seoData,
      },
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    
    // Return 404 page if product not found
    return {
      notFound: true,
    };
  }
};

export default ProductDetailsWrapper;