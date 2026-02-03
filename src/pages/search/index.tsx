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
// --- ASSUMED IMPORT FOR THE ITEMCARD COMPONENT ---
// Please adjust this path to where your ItemCard is actually located.
import ItemCard from '@/components/shared/ItemCard';
import OriginButton from '@/components/OriginButton/OriginButton';
import notifymeSvg from '/public/assets/svg/notifyme.svg';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { protectedUrl } from '@/url';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
// --- END ASSUMED IMPORT ---

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
    ripeness_types: string[];
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

// Helper function to find the default ripeness or null (kept for UOMPopup)
const getDefaultRipeness = (uom: any): string | null => {
  return uom?.ripeness_types?.length > 0 ? uom.ripeness_types[0] : null;
};


// UOM Popup Modal Component (KEPT AS IT IS USED LOCALLY)
const UOMPopup: React.FC<{
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  selectedUOM: any;
  selectedRipeness: string | null;
  onSelectUOM: (uom: any) => void;
  onSelectRipeness: (ripeness: string | null) => void;
}> = ({ product, isOpen, onClose, selectedUOM, selectedRipeness, onSelectUOM, onSelectRipeness }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const availableUOMs = product.multiple_uoms?.filter((uom) => uom?.is_available) || [];

  const [modalUOM, setModalUOM] = useState(selectedUOM);
  const [modalRipeness, setModalRipeness] = useState(selectedRipeness);

  const cartItems = useSelector((state: any) => state.cart.items);

  useEffect(() => {
    if (isOpen) {
      setModalUOM(selectedUOM);
      setModalRipeness(selectedRipeness);
    }
  }, [isOpen, selectedUOM, selectedRipeness]);

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

  if (!isOpen || availableUOMs.length === 0) return null;

  const handleUOMSelect = (uom: any) => {
    setModalUOM(uom);
    setModalRipeness(uom.ripeness_types?.length > 0 ? uom.ripeness_types[0] : null);
  };

  const handleDone = () => {
    if (modalUOM && (!modalUOM.ripeness_types || modalRipeness !== undefined)) {
      onSelectUOM(modalUOM);
      onSelectRipeness(modalRipeness);
    }
    onClose();
  }

  const hasRipenessTypes = modalUOM?.ripeness_types?.length > 0;

  const currentCartItem = cartItems.find(
    (item: any) =>
      item.variant_id === modalUOM?.variant_id &&
      item.selected_ripeness_type === modalRipeness
  );

  const itemQuantity = currentCartItem?.cart_quantity || 0;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-100">
          <button
            onClick={handleDone}
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
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {/* UOM List */}
          <h4 className="font-semibold text-gray-700 text-base mb-2">Select Unit of Measurement</h4>
          <div className="flex flex-wrap gap-2">
            {availableUOMs.map((uom) => (
              <button
                key={uom.variant_id}
                className={`border-2 rounded-full px-4 py-2 text-sm transition-all ${modalUOM?.variant_id === uom.variant_id
                  ? 'border-yellow bg-yellow-100 text-black font-bold'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                onClick={() => handleUOMSelect(uom)}
              >
                {uom.unit} - ₹{uom.price}
              </button>
            ))}
          </div>

          {/* Ripeness Options */}
          {modalUOM && hasRipenessTypes && (
            <div className="pt-4 border-t mt-4">
              <h4 className="font-semibold text-gray-700 text-base mb-2">Select Ripeness</h4>
              <div className="flex flex-wrap gap-2">
                {modalUOM.ripeness_types.map((ripeness: string) => (
                  <button
                    key={ripeness}
                    className={`border-2 rounded-full px-4 py-2 text-sm capitalize transition-all ${modalRipeness === ripeness
                      ? 'border-green-500 bg-green-100 text-green-800 font-bold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    onClick={() => setModalRipeness(ripeness)}
                  >
                    {ripeness.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action/Add to Cart area for the currently selected UOM/Ripeness */}
          {modalUOM && (!hasRipenessTypes || modalRipeness !== null) && (
            <div className="pt-6 border-t mt-6">
              <h4 className="font-semibold text-gray-700 mb-3">
                Current Selection: {modalUOM.unit}
                {modalRipeness && ` (${modalRipeness.replace('_', ' ')})`}
              </h4>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-black font-bold text-xl">₹{modalUOM.price}</span>
                  {modalUOM.market_price > modalUOM.price && (
                    <span className="text-gray-400 line-through text-md">₹{modalUOM.market_price}</span>
                  )}
                </div>

                <div className="ml-4 min-w-[120px]">
                  <AddItemBtn
                    product={product}
                    varientId={modalUOM.variant_id}
                    varientPrice={modalUOM.price}
                    stepperQuantity={modalUOM.stepper_quantity}
                    buttonType="black"
                    selectedRipenessType={modalRipeness}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={handleDone}
              className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-xl hover:bg-yellow-600 transition-colors"
            >
              Done and Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Request Item Modal component
const RequestItemModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialValue: string;
}> = ({ isOpen, onClose, initialValue }) => {
  const [itemName, setItemName] = useState(initialValue);
  const [lastSubmittedName, setLastSubmittedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isPendingPostLogin, setIsPendingPostLogin] = useState(false);

  const isLogin = useSelector((state: any) => state.loginDetails.isLogin);
  const dispatch = useDispatch();
  const sendDataToApi = useSendDataToApi();

  useEffect(() => {
    if (isOpen) {
      setItemName(initialValue);
      setLastSubmittedName("");
      setSuccess(false);
      setIsPendingPostLogin(false);
    }
  }, [isOpen, initialValue]);

  const submitRequest = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['requestItems'];
    const payload = { item_name: itemName };

    const successHandler = () => {
      setSuccess(true);
      setLastSubmittedName(itemName);
      setIsPendingPostLogin(false);
      setTimeout(() => {
        onClose();
      }, 2000);
    };

    const failureHandler = (error: any) => {
      console.error("Request Item API error:", error);
      setIsPendingPostLogin(false);
    };

    setLoading(true);
    await sendDataToApi(apiUrl, payload, 'POST', successHandler, failureHandler, {});
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && isLogin && isPendingPostLogin && !loading && !success) {
      submitRequest();
    }
  }, [isLogin, isPendingPostLogin, isOpen]);

  const handleSubmit = async () => {
    if (!itemName.trim() || itemName === lastSubmittedName) return;

    if (!isLogin) {
      setIsPendingPostLogin(true);
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
      dispatch(setIsSidebarOpen(true));
      return;
    }

    await submitRequest();
  };

  if (!isOpen) return null;

  const isButtonDisabled = !itemName.trim() || loading || itemName === lastSubmittedName;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-md relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center space-y-4">
          <h3 className="font-[SofiaPro] font-bold text-2xl text-black">Help us stock better</h3>

          {success ? (
            <div className="py-8">
              <div className="text-green-500 text-5xl mb-4 text-center flex justify-center">✓</div>
              <p className="font-[SofiaPro] text-gray-600">Your request has been submitted!</p>
            </div>
          ) : (
            <>
              <p className="font-[SofiaPro] text-gray-600">
                Share more about the product you’re looking for.
              </p>
              <div className="pt-2 text-start">
                <label className="text-sm font-semibold text-gray-500 mb-1 block">Item Name</label>
                <input
                  type="text"
                  maxLength={50}
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-yellow-400 outline-none transition-all font-[SofiaPro] text-black"
                  placeholder="e.g. Alphonso Mangoes"
                />
                <span className="text-[10px] text-gray-400 mt-1 block text-right">
                  {itemName.length}/50 characters
                </span>
              </div>
              <OriginButton
                variant={isButtonDisabled && isLogin ? "disabled" : "primary"}
                buttonText={
                  loading
                    ? "Submitting..."
                    : !isLogin
                      ? "Login to request for an item"
                      : (itemName === lastSubmittedName && lastSubmittedName !== "")
                        ? "Request Submitted"
                        : "Submit Request"
                }
                handleClick={handleSubmit}
                className="w-full mt-4 !h-14 flex justify-center items-center"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// LoadingCard component (KEPT)
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
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // API call function
  const searchProducts = async (query: string, pageNum: number = 1): Promise<SearchResponse> => {
    try {
      const userToken = localStorage.getItem("user_token"); // check token in localStorage

      // base headers
      const headers: any = {
        "Content-Type": "application/json",
        "Delivery-Type": "instant",
      };

      let apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v5/public/skip-login/items?query=${query}`;

      if (userToken) {
        apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v5/user/items?query=${query}`;
        headers["Authorization"] = `Bearer ${userToken}`;
        headers['MM-Device-Type'] = 'web';
        headers['MM-Build-Version'] = '1.0.1';
      }

      const response = await fetch(apiUrl, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      return {
        data: data.data || [],
        totalCount: data.data?.length || 0,
        hasMore: data.hasMore || false,
      };
    } catch (error) {
      console.error("Search API error:", error);
      return {
        data: [],
        totalCount: 0,
        hasMore: false,
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
      } else if (query.trim().length < 2) {
        // Clear the URL query parameter when search text is less than 2 characters
        router.push('/search', undefined, { shallow: true });
        setProducts([]);
        setNoResults(false);
        setTotalCount(0);
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

    setLoading(true);
    setProducts([]);
    setPage(1);
    setNoResults(false);

    try {
      const response = await searchProducts(query, 1);
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
    <Layout mainMenuItems={mainMenuItems} isHeaderSticky={true} footerData={footerData} search={true} useTopPadding={true}>
      {/* <div className="min-h-screen bg-[#FFF9E5]"> */}
      <div className="min-h-screen">
        {/* Search Results */}
        <div className="max-w-[90vw] mx-auto px-[2vw] py-[3vw] mob:py-[6vw]">
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
            <div className="flex flex-col items-center justify-center py-[8vw] mob:py-[20vw] text-center w-full mx-auto">
              <div className="mb-[2vw] mob:mb-[4vw]">
                <Image src={notifymeSvg} alt="Notify Me" width={200} height={200} className="w-[20vw] mob:w-[80vw] h-auto" />
              </div>
              <p className="font-[SofiaPro] font-semibold text-[1.5vw] mob:text-[4.47vw] text-black mb-[1vw] mob:mb-[3vw]">
                Sorry, looks like we don’t have {searchQuery}!
              </p>
              <p className="font-[SofiaPro] text-[1vw] mob:text-[3.5vw] text-gray-600 mb-[3vw] mob:mb-[6vw]">
                Request the product, and we’ll work on bringing it in.
              </p>
              <OriginButton
                buttonText="Request Item"
                handleClick={() => setIsRequestModalOpen(true)}
                className="px-10 py-3 flex justify-center font-[SofiaPro] font-bold items-center"
              />
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[5vw] mob:gap-[4vw]">
                {products.map((product) => (
                  // *** CRITICAL CHANGE: Using ItemCard with the expected prop name ***
                  <ItemCard key={`search-product-${product.id}`} itemDetails={product} />
                  // ********************************************************************
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
        <RequestItemModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          initialValue={typeof searchQuery === 'string' ? searchQuery : ''}
        />
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