import { mainApiUrl, protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
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
import sampleimg from '/public/assets/images/shop/samplepdp2.jpg'
import multisampleimg from '/public/assets/images/shop/sampleIMAGE.jpg'
import CategorySection from '@/components/ShopV2/CategorySection'; 

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

const ProductDetailsWrapper: React.FC<ProductDetailsWrapperProps> = ({ 
  initialProductDetails,
  seoData 
}) => {
  const mobile: boolean = useMediaQuery(768);
  const router = useRouter();

  const productDetails = initialProductDetails;
  
  const defaultUOM: UOM = productDetails?.item?.multiple_uoms?.find((uom: UOM) => uom?.is_default === true) || productDetails?.item?.multiple_uoms?.[0];

  const aboutSection = productDetails.info?.info?.find(section => section.type === 'normal' && section.title === 'About the Product');
  const productDescription = aboutSection?.details?.[0]?.description || '';

  const additionalImages = productDetails.item.multiple_images?.slice(0, 2) || [];

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
        <title>{seoData.title}</title>
        <meta name="title" content={seoData.title} />
        <meta name="description" content={seoData.description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="relative">
        <div className="relative w-full min-h-screen">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div className="relative w-full h-full">
              <Image 
                src={sampleimg || productDetails.item.image} 
                alt={productDetails.item.name || "Product background"}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority
                quality={100}
              />
            </div>
          </div>

          {/* Content + Blur Overlay */}
          <div className="relative z-10 w-full h-full flex items-end">
            {/* Blur overlay - extended to cover CategorySection */}
            <div 
              className="absolute bottom-0 left-0 w-full h-[80vh]"
              style={{
                backdropFilter: 'blur(9px)',
                WebkitBackdropFilter: 'blur(9px)',
                background: 'rgba(0, 0, 0, 0.12)',
                maskImage: 'linear-gradient(to top, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, black 85%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 5,
              }}
            />

            {/* Foreground content */}
            <div className="relative w-full px-8 mob:px-4 pb-8 mob:pb-6 z-10">
              <div className="max-w-7xl mx-auto">
                
                {/* Mobile Layout */}
                {mobile ? (
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                        {productDetails.item.name}
                      </h1>
                      
                      {defaultUOM && (
                        <>
                          <div className="text-2xl font-bold text-white mb-1">
                            Rs.{defaultUOM.price}
                          </div>
                          <div className="text-white/80 text-sm mb-4">
                            {defaultUOM.unit}
                          </div>
                        </>
                      )}

                      <div className='max-w-sm mb-4'>
                        <AddItemBtn
                          product={productDetails?.item}
                          varientId={defaultUOM?.variant_id}
                          varientPrice={defaultUOM?.price}
                          stepperQuantity={defaultUOM?.stepper_quantity}
                          buttonType={'yellowaddtocart'}
                        />
                      </div>

                      {productDescription && (
                        <p className="text-white/90 leading-relaxed text-sm mb-4">
                          {productDescription}
                        </p>
                      )}
                    </div>

                    {additionalImages.length > 0 && (
                      <div className="flex gap-3 mb-6">
                        {additionalImages.map((img, index) => (
                          <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden">
                            <Image
                              src={multisampleimg || img}
                              alt={`${productDetails.item.name} ${index + 1}`}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Category Section for Mobile */}
                    <div className="pt-4">
                      <CategorySection />
                    </div>
                  </div>
                ) : (
                  /* Desktop Layout */
                  <div className="space-y-8">
                    <div className="flex justify-between items-start gap-8 mt-[33vw]">
                      {/* Left Side - Product Info */}
                      <div className="flex-shrink-0" style={{ maxWidth: '480px' }}>
                        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                          {productDetails.item.name}
                        </h1>
                        
                        {defaultUOM && (
                          <>
                            <div className="text-4xl font-bold text-white mb-2">
                              Rs.{defaultUOM.price}
                            </div>
                            <div className="text-white/90 text-lg mb-6">
                              {defaultUOM.unit}
                            </div>
                          </>
                        )}

                        <div className='mb-6' style={{ maxWidth: '420px' }}>
                          <AddItemBtn
                            product={productDetails?.item}
                            varientId={defaultUOM?.variant_id}
                            varientPrice={defaultUOM?.price}
                            stepperQuantity={defaultUOM?.stepper_quantity}
                            buttonType={'yellowaddtocart'}
                          />
                        </div>
                      </div>

                      {/* Middle - Description */}
                      <div className="flex-1 max-w-md">
                        {productDescription && (
                          <p className="text-white/95 leading-relaxed text-base">
                            {productDescription}
                          </p>
                        )}
                      </div>

                      {/* Right Side - Additional Images */}
                      <div className="col-span-3 flex gap-4 justify-end">
                        {additionalImages.map((img, index) => (
                          <div key={index} className="relative w-32 h-40 rounded-[1vw] border-[1px] border-[#FFD700] overflow-hidden">
                            <Image
                              src={multisampleimg || img}
                              alt={`${productDetails.item.name} ${index + 1}`}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category Section for Desktop - Below product info */}
                    <div className="">
                      <CategorySection />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
    </>
  );
};

export default ProductDetailsWrapper;