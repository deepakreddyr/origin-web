import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import HomeCategorySection from '@/components/home/HomeCategorySection';
import PopularProduce from '@/components/ShopV2/PopularProduce';
import PopularProduceMob from '@/components/ShopV2/PopularProduceMob';
import FeatureProduct from '@/components/ShopV2/FeaturedProduct';
import VideoBanner from '@/components/ShopV2/VideoBanner';
import { useEffect, useRef, useState } from 'react';
import * as gtag from '@/utilities/gtag';
import { protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setIsShopCategoriesFetched, setShopCategories } from '@/store/slice/shopCategoriesSlice';
import { addressAtom } from '@/features/Address/context/atoms';
import { useAtom } from 'jotai';
import { getAddressAndStoreId } from '@/utilities/utils';
import { trackEvent } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';
import MainCategorySkeleton from '@/components/skeletonLoaders/shop/MainCategorySkeleton';
import PopularCarouselSkeleton from '@/components/skeletonLoaders/shop/PopularCarouselSkeleton';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import DownloadAppWrapper from '@/components/downloadApp/DownloadAppWrapper';
import FeatureStrip from '@/components/ShopV2/FeatureStrip';
import WhyOriginBanner from '@/components/ShopV2/WhyOriginBanner';
import { ShopHeroSingle } from '@/components/ShopV2/ShopHero';
import CustomHead from '@/components/shared/CustomHead';
import CategorySection from '@/components/ShopV2/CategorySection';
import ScrollReveal from '@/components/shared/ScrollReveal';

interface HomeProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

const ShopPage = (props: HomeProps) => {
  const { mainMenuItems, footerData } = props;
  const isMobile = useMediaQuery(650);
  const [loading, setLoading] = useState(true);
  const [showDownloadApp, setShowDownloadApp] = useState(false);
  const [downloadAppReady, setDownloadAppReady] = useState(false);
  const [videosPreloaded, setVideosPreloaded] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const getDataFromApi = useGetDataFromApi();
  const [address] = useAtom(addressAtom);
  const lastFetchedRef = useRef({ url: '', storeId: '' });
  const isTablet = useMediaQuery(1024);
  const filteredCategories = useSelector((state: any) => state.shopCategories);
  const loginDetails = useSelector((state: any) => state.loginDetails);

  // console.log(filteredCategories,"Category");
  const { categories } = filteredCategories;
  const mainCategoryData = categories?.find((item: any) => item.type === 'main-category')?.data || [];
  const subCategories = categories?.filter((item: any) => item.type !== 'main-category');
  const featureditemdata = categories?.find((item: any) => item.type === 'featured-item')?.data || [];
  const blendsCategoryData = categories?.find((item: any) => item.type === 'blends-category')?.data || [];
  // Preload videos for better performance
  useEffect(() => {
    const preloadVideos = () => {
      const mobileVideo = document.createElement('video');
      const desktopVideo = document.createElement('video');

      mobileVideo.src = 'https://cdn.originfresh.in/website/Origin_9_16_v1.mp4';
      mobileVideo.preload = 'metadata';
      mobileVideo.muted = true;

      desktopVideo.src = 'https://cdn.originfresh.in/website/Origin_16_9_v1.mp4';
      desktopVideo.preload = 'metadata';
      desktopVideo.muted = true;

      let loadedCount = 0;
      const handleLoad = () => {
        loadedCount++;
        if (loadedCount === 2) {
          setVideosPreloaded(true);
        }
      };

      mobileVideo.addEventListener('loadedmetadata', handleLoad);
      desktopVideo.addEventListener('loadedmetadata', handleLoad);

      // Cleanup
      return () => {
        mobileVideo.removeEventListener('loadedmetadata', handleLoad);
        desktopVideo.removeEventListener('loadedmetadata', handleLoad);
      };
    };

    preloadVideos();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const addressFromLs = getAddressAndStoreId();
    let apiUrl;
    let additionalHeaders = {};

    if (token && addressFromLs) {
      apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getShopDetails'];
      additionalHeaders = { 'store-id': addressFromLs.store_id };
    } else {
      apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['getShopDetails'];
    }

    const currentStoreId = addressFromLs?.store_id || '';

    // Prevent redundant calls if parameters haven't changed
    if (apiUrl === lastFetchedRef.current.url && String(currentStoreId) === String(lastFetchedRef.current.storeId)) {
      // console.log('Skipping redundant shop-all call');
      return;
    }

    lastFetchedRef.current = { url: apiUrl, storeId: String(currentStoreId) };

    const successHandler = (data: any) => {
      // console.log(data, 'DATA');
      dispatch(setShopCategories(data?.data));
      dispatch(setIsShopCategoriesFetched(true));
      setLoading(false);
    };

    const failureHandler = () => {
      dispatch(setShopCategories([]));
      dispatch(setIsShopCategoriesFetched(true));
      setLoading(false);
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);

    // Track Shop All View
    gtag.event({
      action: 'view_item_list',
      category: 'Navigation',
      label: 'Shop All'
    });
  }, [loginDetails.isLogin, address.defaultAddress?.store_id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const userToken = localStorage.getItem('user_token');
        const hasSeenBanner = localStorage.getItem('downloadAppBannerSeen');

        if (!userToken && !hasSeenBanner) {
          setShowDownloadApp(true);
        }

        setDownloadAppReady(true);
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        setDownloadAppReady(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseDownloadApp = () => {
    setShowDownloadApp(false);
    localStorage.setItem('downloadAppBannerSeen', 'true');
  };

  const PageLoader = () => (
    <div className="flex flex-col gap-[6vw] pl-[10.6vw] mob:pl-[4.1vw] relative top-[12vw] mob:top-[32vw] overflow-hidden">
      <MainCategorySkeleton />
      <PopularCarouselSkeleton />
      <div className="pb-[20vw] mob:pb-[40vw]">
        <PopularCarouselSkeleton />
      </div>
    </div>
  );

  const LoadedUI = () => (
    <div className="flex flex-col w-full pb-[2vw] mob:pb-[10vw] pt-[25vw] md:pt-[12vw] lg:pt-[5vw] overflow-hidden">
      <div className="w-full relative overflow-hidden m-0 p-0">
        {/* <ShopHeroSingle />
        <FeatureStrip /> */}
      </div>

      <ScrollReveal direction="up" delay={0} className="w-full">
        <div className="flex flex-col gap-[6vw] mob:pl-[0vw] w-full items-center">
          <HomeCategorySection
            categories={mainCategoryData}
            blendsCategory={blendsCategoryData}
            loading={loading}
            title="Shop By Category"
          />
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={100} className="w-full">
        <div className="flex flex-col gap-[6vw] mt-[7vw] mob:pl-[0vw] w-full items-center">
          <FeatureProduct featuredItems={featureditemdata} />
        </div>
      </ScrollReveal>

      {subCategories?.map((section: any, index: number) => {
        if (!section.data) return null;

        if (section.type === 'products-recommendation') {
          return (
            <ScrollReveal key={index} direction="up" delay={index * 80} className="w-full">
              <div className="w-full">
                {isMobile ? (
                  <PopularProduceMob categoryDetail={section} />
                ) : (
                  <PopularProduce categoryDetail={section} />
                )}
              </div>
            </ScrollReveal>
          );
        }
        return null;
      })}
    </div>
  );
  return (
    <div className="overflow-x-hidden max-w-full relative">
      <Layout mainMenuItems={mainMenuItems} isHeaderSticky={true} footerData={footerData}>
        <CustomHead
          title="Shop Fresh Produce | Origin Fresh"
          description="Browse our wide selection of fresh fruits, vegetables, and kitchen essentials. Handpicked and delivered fresh."
        />
        {loading ? <PageLoader /> : <LoadedUI />}
      </Layout>
    </div>
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

export default ShopPage;
