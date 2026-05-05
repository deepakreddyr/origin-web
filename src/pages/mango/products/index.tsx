import React from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import CustomHead from '@/components/shared/CustomHead';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import MangoHeader from '@/components/Mango/MangoHeader';
import MangoItemCard from '@/components/Mango/MangoItemCard';
import ProductCardLoader from '@/components/skeletonLoaders/shop/ProductCardLoader';
import { useDispatch, useSelector } from 'react-redux';
import { setIsProductListLoading, setProductList } from '@/store/slice/productsSlice';
import { Product } from '@/components/shared/UOMPopup';
import { useEffect, useState } from 'react';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import { trackEvent } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';

interface MangoProductsPageProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

const ProductsList = ({ hasError }: { hasError: boolean }) => {
  const products = useSelector((state: any) => state.products);
  // console.log('products', products);

  if (products.isProductListLoading) return <ProductCardLoader />;

  if (
    hasError ||
    (!products.isProductListLoading && (!products.productsList || products.productsList.length === 0) && hasError)
  ) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center px-4 z-10 bg-white">
        <img
          src="/assets/svg/somethingwentwrong.svg"
          alt="Something went wrong"
          className="w-[260px] mob:w-[200px] mb-6"
        />
        <p className="text-center text-gray-500 font-[SofiaPro] text-base mob:text-sm">
          Oops! Something went wrong. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 mob:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-[3.5vw] mob:gap-[5vw] md:gap-x-6 md:gap-y-10 w-full justify-items-center">
      {products.productsList?.map((item: any) => <MangoItemCard key={item.id} itemDetails={item} />)}
    </div>
  );
};

const MangoProductsPage = ({ mainMenuItems, footerData }: MangoProductsPageProps) => {
  const dispatch = useDispatch();
  const getDataFromApi = useGetDataFromApi();
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let apiPath = localStorage.getItem('mango_listing_api_path');
    if (!apiPath) {
      console.warn('[MangoProducts] No listing API path found in LS.');
      setFetchError(true);
      dispatch(setIsProductListLoading(false));
      return;
    }

    const token = localStorage.getItem('user_token');
    // If user is not logged in, ensure we use the public skip-login endpoint
    if (!token && apiPath.includes('/user/')) {
      apiPath = apiPath.replace('/user/', '/public/skip-login/');
    }

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + apiPath;
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    dispatch(setIsProductListLoading(true));

    const successHandler = (data: any) => {
      // console.log('[MangoListing] response:', data);

      const resData = data?.data || [];
      let prodList: any[] = [];

      if (Array.isArray(resData)) {
        // Flatten items from all objects in the data array if it's a category listing
        prodList = resData.reduce((acc: any[], current: any) => {
          if (current.items && Array.isArray(current.items)) {
            return [...acc, ...current.items];
          }
          return acc;
        }, []);

        // If it's a category-based response, set the first category's name
        if (resData.length > 0 && resData[0].name) {
          setCategoryName(resData[0].name);
        }

        // If still empty, maybe the array itself contains the products
        if (prodList.length === 0) {
          prodList = resData;
        }
      } else if (resData.items) {
        // Handle single object in data.data
        prodList = resData.items;
        if (resData.name) {
          setCategoryName(resData.name);
        }
      } else {
        prodList = resData;
      }

      dispatch(setProductList(prodList));
      dispatch(setIsProductListLoading(false));

      // Track Mango Category View
      trackEvent(AnalyticsEvents.CATEGORY_VIEWED, {
        category_name: categoryName || (resData.length > 0 && resData[0].name) || 'Fresh Arrivals'
      });
    };

    const failureHandler = (error: any) => {
      console.error('[MangoListing] error:', error);
      dispatch(setIsProductListLoading(false));
      setFetchError(true);
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  }, [dispatch]);

  return (
    <Layout isHeader={false} mainMenuItems={mainMenuItems} footerData={footerData} isHeaderSticky={true}>
      <CustomHead
        title="All Mangoes – Fresh Arrivals | Origin Fresh"
        description="Explore our full range of farm-fresh, carbide-free mangoes. Order online and get them delivered fresh."
      />

      <MangoHeader />

      <main className="min-h-screen pt-12 md:pt-[80px] bg-[#FFFFFF]">
        {/* ── Products Grid ── */}
        <section className="px-4 mob:px-[4vw] md:px-[8vw] py-10 mob:py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between mob:pb-5 md:pb-10 pt-5">
            <div>
              <h1 className="text-2xl md:text-4xl font-semibold text-[#1a1a1a] mt-1">
                {categoryName ? `${categoryName}` : 'Fresh Arrivals'}
              </h1>
            </div>
          </div>
          <div className="max-w-7xl mx-auto">
            <ProductsList hasError={fetchError} />
          </div>
        </section>
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
    const originApiData = await response.json();
    const { mainMenuItems, footerData } = originApiData;
    return { props: { mainMenuItems: mainMenuItems || [], footerData: footerData || {} } };
  } catch (error) {
    console.error('Error fetching mango products list data:', error);
    return { props: { mainMenuItems: [], footerData: {} } };
  }
};

export default MangoProductsPage;
