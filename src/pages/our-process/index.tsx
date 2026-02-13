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
import HowItWorksCard from '@/components/HowItWorksCard/HowItWorksCard';
import Image from 'next/image';
import Hero from '@/components/about/Hero';

const OurProcessPage = (props: any) => {
  const { mainMenuItems, footerData, howItWorks } = props;
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
    <Layout isHeaderSticky={true} mainMenuItems={mainMenuItems} footerData={footerData}>
      <CustomHead
        title="About Us | Origin Fresh"
        description="Learn about our commitment to bringing fresh, high-quality produce to your table. We focus on sustainability and quality."
      />
      <Hero />
      <div className="container mx-auto px-4 py-10 md:py-20 flex flex-col gap-10 md:gap-20 mt-[5vw] relative">
        <div className="absolute inset-x-0 -top-[5vw] bottom-0 pointer-events-none hidden md:block">
          <Image
            src="/assets/images/howitworks.svg"
            alt=""
            width={641}
            height={2280}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute inset-x-0 -top-[5vw] bottom-0 pointer-events-none md:hidden">
          <Image
            src="/assets/images/howitworksMob.svg"
            alt=""
            width={529}
            height={2637}
            className="w-full h-full object-contain"
          />
        </div>
        {howItWorks?.list?.map((item: any, index: number) => (
          <div key={index} className="relative z-10">
            <HowItWorksCard {...item} index={index + 1} reversed={index % 2 !== 0} />
          </div>
        ))}
      </div>
    </Layout>
  );
};
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
    const originApiData = await response.json();
    const { mainMenuItems, footerData, howItWorks } = originApiData;
    return {
      props: {
        mainMenuItems,
        footerData,
        howItWorks
      }
    };
  } catch (error) {
    console.error('Error fetching USP card data:', error);
    return {
      props: {
        mainMenuItems: [],
        footerData: {},
        howItWorks: { list: [] }
      }
    };
  }
};
export default OurProcessPage;
