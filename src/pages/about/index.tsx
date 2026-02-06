import Commitment from '@/components/about/Commitment';
import FarmDetails from '@/components/about/FarmDetails';
import Handpicked from '@/components/about/Handpicked';
import Hero from '@/components/about/Hero';
import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import CategorySection from '@/components/ShopV2/CategorySection';
import { getAddressAndStoreId } from '@/utilities/utils';
import { protectedUrl, unprotectedUrl } from '@/url';
import { setIsShopCategoriesFetched, setShopCategories } from '@/store/slice/shopCategoriesSlice';
import { useDispatch } from 'react-redux';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import CustomHead from '@/components/shared/CustomHead';

const AboutUsPage = (props: any) => {
  const { mainMenuItems, footerData } = props;
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const getDataFromApi = useGetDataFromApi();

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const addressFromLs = getAddressAndStoreId();
    let apiUrl;
    let additionalHeaders = {};
    if (token) {
      apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getShopDetails'];
      if (addressFromLs)
        additionalHeaders = {
          'store-id': addressFromLs.store_id
        };
    } else {
      apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['getShopDetails'];
    }
    const successHandler = (data: any) => {
      dispatch(setShopCategories(data?.data));
      dispatch(setIsShopCategoriesFetched(true));
      setLoading(false);
    };
    const failureHandler = (data: any) => {
      dispatch(setShopCategories([]));
      dispatch(setIsShopCategoriesFetched(true));
      setLoading(false);
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  }, []);

  return (
    <Layout isHeaderSticky={false} mainMenuItems={mainMenuItems} footerData={footerData}>
      <CustomHead
        title="About Us | Origin Fresh"
        description="Learn about our commitment to bringing fresh, high-quality produce to your table. We focus on sustainability and quality."
      />
      <div className="">
        <Hero />
        <Commitment />
        <Handpicked />
        {/* <FarmDetails /> */}
        {/* <div className="px-[10vw] pb-[10vw] mob:px-[4vw] mob:pt-[8vw] ">{!loading && <CategorySection />}</div> */}
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
    console.error('Error fetching USP card data:', error);
    return {
      props: {
        mainMenuItems: [],
        footerData: {}
      }
    };
  }
};
export default AboutUsPage;
