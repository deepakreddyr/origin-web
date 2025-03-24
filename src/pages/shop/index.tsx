import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import CategorySection from '@/components/ShopV2/CategorySection';
import PopularProduce from '@/components/ShopV2/PopularProduce';
import BestSellers from '@/components/ShopV2/BestSellers';
import { useEffect, useState } from 'react';
import { protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setIsShopCategoriesFetched, setShopCategories } from '@/store/slice/shopCategoriesSlice';
import { addressAtom } from '@/features/Address/context/atoms';
import { useAtom } from 'jotai';
import { getAddressAndStoreId } from '@/utilities/utils';
import ShopSliderSection from '@/components/ShopV2/ShopSliderSection';
import MainCategorySkeleton from '@/components/skeletonLoaders/shop/MainCategorySkeleton';
import PopularCarouselSkeleton from '@/components/skeletonLoaders/shop/PopularCarouselSkeleton';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import DownloadAppWrapper from '@/components/downloadApp/DownloadAppWrapper';

interface HomeProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}
const ShopPage = (props: HomeProps) => {
  const { mainMenuItems, footerData } = props;
  const mobile = useMediaQuery(600);

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const { query, isReady } = router;
  const getDataFromApi = useGetDataFromApi();
  const [address, setAddress] = useAtom(addressAtom); //

  const filteredCategories = useSelector((state: any) => state.shopCategories);
  const { categories } = filteredCategories;

  const subCategories = categories?.filter((item: any) => item.type !== 'main-category' && item);

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const addressFromLs = getAddressAndStoreId();
    let apiUrl;
    let additionalHeaders = {};
    if (token && addressFromLs) {
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

  const PageLoader = () => {
    return (
      <div className="flex flex-col gap-[6vw] pl-[10.6vw] mob:pl-[4.1vw] relative top-[12vw] mob:top-[32vw] overflow-hidden">
        <MainCategorySkeleton />
        <PopularCarouselSkeleton />
        <div className="pb-[20vw] mob:pb-[40vw]">
          <PopularCarouselSkeleton />
        </div>
      </div>
    );
  };

  const LoadedUI = () => {
    return (
      <div className="flex flex-col items-center pb-[20vw] mob:pb-[45vw] overflow-hidden">
        <div className="flex flex-col gap-[6vw] pl-[10.6vw] mob:pl-[0vw]  relative top-[12vw] mob:top-[32vw] ">
          <div className="">
            <CategorySection />
          </div>
          {subCategories.length > 0 &&
            subCategories.map((category: any) => <PopularProduce categoryDetail={category} />)}
        </div>
      </div>
    );
  };

  // if (mobile) return <DownloadAppWrapper />;
  return (
    <Layout mainMenuItems={mainMenuItems} isHeaderSticky={true} footerData={footerData}>
      {loading ? <PageLoader /> : <LoadedUI />}
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

export default ShopPage;
