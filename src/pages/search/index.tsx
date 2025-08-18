import React, { useState, useEffect, useRef } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import AddItemBtn from '@/components/shared/AddItemBtn/AddItemBtn';
import sampleimg from '/public/assets/images/shop/sampleimg2.png';
import Layout from '@/components/Layout';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import { any } from 'zod';

// Updated Product interface to match your API response
interface HomeProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

interface Product {
  id: number;
  item_code: string;
  name: string;
  image: string;
  multiple_images: string[];
  multiple_uoms: {
    conversion_text: string;
    is_available: boolean;
    is_default: boolean;
    is_visible: boolean;
    market_price: number;
    maximum_quantity: number;
    minimum_quantity: number;
    price: number;
    ripeness_types: any;
    stepper_quantity: number;
    unit: string;
    uom_id: number;
    variant_id: number;
    formatted_price?: string;
  }[];
  bg_color: string;
  is_available: boolean;
  is_greyed: boolean;
  is_orderable: boolean;
  navigation: {
    to: string;
  };
  tag_url: string | null;
}

interface SearchResponse {
  data: Product[];
  totalCount?: number;
  hasMore?: boolean;
}

// UOM Popup Modal Component
const UOMPopup: React.FC<{
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  selectedUOM: any;
  onSelectUOM: (uom: any) => void;
}> = ({ product, isOpen, onClose, selectedUOM, onSelectUOM }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const availableUOMs = product.multiple_uoms?.filter((uom) => uom?.is_available) || [];

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUOMSelect = (uom: any) => {
    onSelectUOM(uom);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-start gap-4 pr-8">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              <Image
                src={product.image || sampleimg}
                alt={product.name}
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-[SofiaPro] font-semibold text-lg text-gray-900 leading-tight">
                {product.name}
              </h3>
            </div>
          </div>
        </div>

        {/* UOM Options */}
        <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
          {availableUOMs.map((uom, index) => {
            const isSelected = selectedUOM?.variant_id === uom.variant_id;
            const hasDiscount = uom.market_price > uom.price && uom.market_price > 0;

            return (
              <div
                key={uom.variant_id}
                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-yellow bg-yellow-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleUOMSelect(uom)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-[SofiaPro] font-semibold text-gray-900 text-lg">
                        {uom.unit}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 bg-grey rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      {hasDiscount ? (
                        <>
                          <span className="text-gray-400 line-through text-sm font-[SofiaPro]">
                            ₹{uom.market_price}
                          </span>
                          <span className="text-black font-[SofiaPro] font-bold text-lg">
                            ₹{uom.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-900 font-[SofiaPro] font-bold text-lg">
                          ₹{uom.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 min-w-[100px]">
                    <AddItemBtn
                      product={product}
                      varientId={uom.variant_id}
                      varientPrice={uom.price}
                      stepperQuantity={uom.stepper_quantity}
                      buttonType="black"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ProductCard component adapted with enhanced debugging and cart sync fix
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const router = useRouter(); 
  const isMobile = useMediaQuery(600);
  const cartItems = useSelector((state: any) => state.cart.items);
  
  const defaultUOM = product.multiple_uoms.find((uom) => uom.is_default) || product.multiple_uoms[0];
  const [selectedUOM, setSelectedUOM] = useState(defaultUOM);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // Debug logging for cart synchronization
  // useEffect(() => {
  //   const cartItemsForThisProduct = cartItems.filter((item: any) => item.id === product.id);
  //   console.log('ProductCard Debug - Search Page:', {
  //     productId: product.id,
  //     productName: product.name,
  //     selectedVariantId: selectedUOM?.variant_id,
  //     cartItemsForProduct: cartItemsForThisProduct.map((item: any) => ({
  //       id: item.id,
  //       variant_id: item.variant_id,
  //       quantity: item.cart_quantity
  //     })),
  //     allCartItems: cartItems.length
  //   });
  // }, [product.id, product.name, selectedUOM?.variant_id, cartItems]);
  
  if (!defaultUOM) return null;

  const hasMultipleUOMs = product.multiple_uoms?.length > 1;
  const availableUOMs = product.multiple_uoms?.filter((uom) => uom?.is_available) || [];

  const handleUOMChange = (uom: any) => {
    console.log('Search ProductCard - UOM changed:', {
      from: selectedUOM?.variant_id,
      to: uom.variant_id,
      unit: uom.unit
    });
    setSelectedUOM(uom);
  };

  const handleCardClick = () => {
    if (selectedUOM.is_available) {
      router.push(`/${product.name.replace(/ /g, '-').toLowerCase()}/${product.id}`);
    }
  };

  const handleUOMButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPopupOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-[1.5rem] shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] overflow-visible flex flex-col h-full hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-300 relative">
        <button
          disabled={!selectedUOM.is_available}
          onClick={handleCardClick}
          className={`text-left w-full flex flex-col h-full ${!selectedUOM.is_available ? 'opacity-50' : ''}`}
        >
          {/* Image Section */}
          <div className="w-full flex-shrink-0 relative overflow-hidden rounded-t-[1.5rem]">
            <div className="overflow-hidden bg-white flex justify-center items-center relative h-[110px] md:h-[170px]">
              <div className="relative w-[85%] h-[85%]">
                <Image
                  src={product.image || sampleimg}
                  alt={product.name || 'product image'}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              
              {!selectedUOM.is_available && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-[SofiaPro] text-sm font-semibold">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content Section with Gradient Background */}
          <div
            className="w-full flex-grow flex flex-col justify-between p-[1.2rem] rounded-b-[1.5rem]"
            style={{
              background: 'linear-gradient(180deg, #fef3c7 0%, #fde047 50%, #facc15 100%)',
              minHeight: '90px',
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
            }}
          >
            {/* Top section - Name */}
            <div className="flex-shrink-0">
              <p className="font-[SofiaPro] font-semibold text-[0.85rem] leading-[1.2] line-clamp-2 text-black">
                {product.name}
              </p>
            </div>

            {/* Bottom section - Price, Unit, and Button */}
            <div className="flex-shrink-0">
              <div className="flex justify-between items-center mb-[0.4rem]">
                <div className="flex items-center gap-[0.3rem]">
                  {selectedUOM.market_price > selectedUOM.price && selectedUOM.market_price > 0 ? (
                    <>
                      <p className="text-gray-400 line-through text-[0.7rem]">
                        ₹{selectedUOM.market_price}
                      </p>
                      <p className="text-black font-semibold text-[0.7rem]">
                        ₹{selectedUOM.price}
                      </p>
                    </>
                  ) : (
                    <p className="text-black font-semibold text-[0.7rem]">
                      ₹{selectedUOM.price}
                    </p>
                  )}
                </div>
                
                {/* UOM Display with Popup Trigger */}
                <div className="relative">
                  {hasMultipleUOMs && availableUOMs.length > 1 ? (
                    <button
                      type="button"
                      onClick={handleUOMButtonClick}
                      className="flex items-center gap-[0.2rem] text-[#737373] text-[0.7rem] hover:text-black transition-colors border border-gray-300 rounded-full px-2 py-1 hover:border-gray-400 bg-white/80"
                    >
                      <span>{selectedUOM.unit}</span>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <p className="text-right text-[#737373] text-[0.7rem]">{selectedUOM.unit}</p>
                  )}
                </div>
              </div>

              <div className="rounded-[1.5rem] overflow-hidden">
                <AddItemBtn
                  product={product}
                  varientId={selectedUOM.variant_id}
                  varientPrice={selectedUOM.price}
                  stepperQuantity={selectedUOM.stepper_quantity}
                  buttonType="black"
                />
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* UOM Popup Modal */}
      {hasMultipleUOMs && availableUOMs.length > 1 && (
        <UOMPopup
          product={product}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          selectedUOM={selectedUOM}
          onSelectUOM={handleUOMChange}
        />
      )}
    </>
  );
};

// LoadingCard component
const LoadingCard: React.FC = () => (
  <div className="bg-white rounded-[1.5rem] shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden animate-pulse flex flex-col h-full">
    <div className="w-full h-[110px] md:h-[170px] bg-gray-200"></div>
    <div className="p-[1.2rem] bg-gradient-to-b from-yellow-100 to-yellow-300 flex-grow flex flex-col justify-between">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  </div>
);

// // Cart Debug Component (temporary - remove in production)
// const CartDebugInfo: React.FC = () => {
//   const cartItems = useSelector((state: any) => state.cart.items);
//   const [showDebug, setShowDebug] = useState(false);

//   // Only show in development
//   if (process.env.NODE_ENV !== 'development') return null;

//   return (
//     <>
//       <button
//         onClick={() => setShowDebug(!showDebug)}
//         className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-2 rounded text-xs z-50"
//       >
//         {showDebug ? 'Hide' : 'Show'} Cart Debug
//       </button>
      
//       {showDebug && (
//         <div className="fixed top-4 right-4 bg-white border border-red-500 p-4 rounded shadow-lg z-50 max-w-sm max-h-96 overflow-auto">
//           <h3 className="font-bold text-sm mb-2">Cart Debug Info ({cartItems.length} items)</h3>
//           <pre className="text-xs text-gray-800">
//             {JSON.stringify(cartItems.map((item: any) => ({
//               id: item.id,
//               name: item.name,
//               variant_id: item.variant_id,
//               unit: item.unit,
//               quantity: item.cart_quantity
//             })), null, 2)}
//           </pre>
//         </div>
//       )}
//     </>
//   );
// };

// Main SearchResults component
const SearchResults = (props: HomeProps) => {
  const router = useRouter();
  const { q: searchQuery } = router.query;
  const isMobile = useMediaQuery(600);
  const { mainMenuItems, footerData } = props;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // API call function
  const searchProducts = async (query: string, pageNum: number = 1): Promise<SearchResponse> => {
    try {
      const headers: any = {
      'Content-Type': 'application/json',
      'delivery-type': 'instant'
    };
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v5/public/skip-login/items?query=${query}`,{
        method: 'GET',
        headers: headers
      });
      const data = await response.json();

      return {
        data: data.data || [],
        totalCount: data.data?.length || 0,
        hasMore: data.hasMore || false
      };
    } catch (error) {
      console.error('Search API error:', error);
      return {
        data: [],
        totalCount: 0,
        hasMore: false
      };
    }
  };

  // Debounced search function
  const debouncedSearch = (query: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (query.trim().length >= 2) {
        handleNewSearch(query);
        router.push(`/search?q=${encodeURIComponent(query)}`, undefined, { shallow: true });
      }
    }, 500);
  };

  // Initial search when component mounts or query changes
  useEffect(() => {
    if (searchQuery && typeof searchQuery === 'string') {
      setCurrentSearchQuery(searchQuery);
      handleNewSearch(searchQuery);
    }
  }, [searchQuery]);

  // Cleanup debounce timeout
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle new search
  const handleNewSearch = async (query: string) => {
    if (!query.trim()) return;
    
    // console.log('Search - Starting new search:', query);
    setLoading(true);
    setProducts([]);
    setPage(1);
    setNoResults(false);
    
    try {
      const response = await searchProducts(query, 1);
      // console.log('Search - Results received:', response.data.length, 'products');
      setProducts(response.data);
      setTotalCount(response.data.length);
      setHasMore(response.hasMore || false);
      setNoResults(response.data.length === 0);
    } catch (error) {
      console.error('Search failed:', error);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle load more
  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const nextPage = page + 1;
    
    try {
      const response = await searchProducts(currentSearchQuery, nextPage);
      setProducts(prev => [...prev, ...response.data]);
      setHasMore(response.hasMore || false);
      setPage(nextPage);
    } catch (error) {
      console.error('Load more failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout mainMenuItems={mainMenuItems} isHeaderSticky={true} footerData={footerData} search={true}>
      <div className="min-h-screen bg-[#FFF9E5]">
        {/* Cart Debug Info (only in development) */}
        {/* <CartDebugInfo /> */}
        
        {/* Search Results */}
        <div className="max-w-[90vw] mx-auto px-[2vw] mob:px-[5vw] py-[3vw] mob:py-[6vw]">
          {/* Results Header */}
          {!loading && !noResults && totalCount > 0 && (
            <div className="mb-[3vw] mob:mb-[6vw]">
              <h2 className="font-[SofiaPro] font-semibold text-[1.5vw] mob:text-[5vw] text-black mb-[0.5vw] mob:mb-[2vw]">
                Search Results
              </h2>
              <p className="font-[SofiaPro] text-[1vw] mob:text-[3.5vw] text-gray-600">
                Found {totalCount} products for "{searchQuery}"
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && products.length === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[2vw] mob:gap-[4vw]">
              {Array.from({ length: 10 }).map((_, index) => (
                <LoadingCard key={index} />
              ))}
            </div>
          )}

          {/* No Results */}
          {noResults && !loading && (
            <div className="text-center py-[8vw] mob:py-[20vw]">
              <div className="text-[4vw] mob:text-[12vw] mb-[2vw] mob:mb-[4vw]">🔍</div>
              <h3 className="font-[SofiaPro] font-semibold text-[1.5vw] mob:text-[5vw] text-black mb-[1vw] mob:mb-[3vw]">
                No products found
              </h3>
              <p className="font-[SofiaPro] text-[1vw] mob:text-[3.5vw] text-gray-600 mb-[3vw] mob:mb-[6vw]">
                Try searching with different keywords or browse our categories
              </p>
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[5vw] mob:gap-[4vw]">
                {products.map((product) => (
                  <ProductCard key={`search-product-${product.id}`} product={product} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-[4vw] mob:mt-[8vw]">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-[SofiaPro] font-semibold px-[4vw] mob:px-[10vw] py-[1.2vw] mob:py-[3.5vw] rounded-full text-[1vw] mob:text-[3.5vw] transition-colors"
                  >
                    {loading ? 'Loading...' : 'Load More Products'}
                  </button>
                </div>
              )}

              {/* Loading More Cards */}
              {loading && products.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[2vw] mob:gap-[4vw] mt-[2vw] mob:mt-[4vw]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <LoadingCard key={`loading-${index}`} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
    const originApiData = await response.json();

    const { mainMenuItems, footerData } = originApiData;
    return {
      props: {
        mainMenuItems,
        footerData
      }
    };
  } catch (error) {
    console.error('Error fetching shop page data:', error);
    return {
      props: {
        mainMenuItems: [],
        footerData: {}
      }
    };
  }
};

export default SearchResults;