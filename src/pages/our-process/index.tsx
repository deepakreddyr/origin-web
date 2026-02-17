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
import Hero from '@/components/about/Hero';
import ProcessLine from '@/components/our-process/ProcessLine';

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
        <ProcessLine
          className="absolute inset-x-0 -top-[5vw] bottom-0 pointer-events-none hidden md:block"
          d="M394 1.5C474.833 35.5 609.38 121.147 621.5 241C635 374.5 569 602 184.5 647.5C-109.449 682.285 -15.4004 1042 237 1042C455 1042 619 1106.5 639 1299C646.552 1502.56 437.601 1558.85 277.5 1605.5C230 1622.5 158 1650.29 113 1681.5C26.5 1741.5 -45.9998 1883.5 130.5 2003C307 2122.5 621 2198.5 636 2279.5"
          width={641}
          height={2280}
          viewBox="0 0 641 2280"
          strokeWidth={3}
        />
        <ProcessLine
          className="absolute inset-x-0 -top-[5vw] bottom-0 pointer-events-none md:hidden"
          d="M110.717 1C226.883 51.1667 472.716 182 416.716 244C346.716 321.5 14.7161 334.5 22.2161 474C29.7161 613.5 37.216 635.5 109.216 682.5C181.216 729.5 767.216 723 416.716 853.5C66.216 984 2.71619 929.5 22.2161 1031C41.716 1132.5 1.71689 1279 390.717 1324C779.717 1369 -44.2847 1422.5 22.2161 1591.5C88.7169 1760.5 3.71793 1798.5 390.717 1913.5C777.716 2028.5 144.716 1970 22.2161 2114C-100.284 2258 345.718 2373 390.717 2431.5C435.716 2490 50.2154 2473.5 22.2161 2636"
          width={529}
          height={2637}
          viewBox="0 0 529 2637"
          strokeWidth={2}
        />
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
