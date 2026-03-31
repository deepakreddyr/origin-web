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
import { useEffect } from 'react';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';

interface MangoProductsPageProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

const ProductsList = () => {
  const products = useSelector((state: any) => state.products);

  if (products.isProductListLoading) return <ProductCardLoader />;

  return (
    <div className="grid grid-cols-2 mob:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mob:gap-2 md:gap-x-6 md:gap-y-10 w-full justify-items-center">
      {products.productsList?.map((item: any) => <MangoItemCard key={item.id} itemDetails={item} isCompact={true} />)}
    </div>
  );
};

const MangoProductsPage = ({ mainMenuItems, footerData }: MangoProductsPageProps) => {
  const dispatch = useDispatch();
  const getDataFromApi = useGetDataFromApi();

  useEffect(() => {
    let apiPath = localStorage.getItem('mango_listing_api_path');
    if (!apiPath) {
      console.warn('[MangoProducts] No listing API path found in LS.');
      // Optionally fallback or handle empty state
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
      console.log('[MangoListing] response:', data);

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

        // If still empty, maybe the array itself contains the products
        if (prodList.length === 0) {
          prodList = resData;
        }
      } else if (resData.items) {
        // Handle single object in data.data
        prodList = resData.items;
      } else {
        prodList = resData;
      }

      dispatch(setProductList(prodList));
      dispatch(setIsProductListLoading(false));
    };

    const failureHandler = (error: any) => {
      console.error('[MangoListing] error:', error);
      dispatch(setIsProductListLoading(false));
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

      <main className="min-h-screen pt-5 md:pt-[60px] bg-[#FFFFFF]">
        {/* ── Products Grid ── */}
        <section className="px-6 md:px-[8vw] py-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between py-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mt-1">Fresh Arrivals</h1>
            </div>
          </div>
          <div className="max-w-7xl mx-auto">
            <ProductsList />
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
