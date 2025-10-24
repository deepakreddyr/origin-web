import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import CategorySection from '@/components/ShopV2/CategorySection';
import PopularProduce from '@/components/ShopV2/PopularProduce';
import FeatureProduct from '@/components/ShopV2/FeaturedProduct';
import VideoBanner from '@/components/ShopV2/VideoBanner'; 
import { useEffect, useState } from 'react';
import { protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setIsShopCategoriesFetched, setShopCategories } from '@/store/slice/shopCategoriesSlice';
import { addressAtom } from '@/features/Address/context/atoms';
import { useAtom } from 'jotai';
import { getAddressAndStoreId } from '@/utilities/utils';
import MainCategorySkeleton from '@/components/skeletonLoaders/shop/MainCategorySkeleton';
import PopularCarouselSkeleton from '@/components/skeletonLoaders/shop/PopularCarouselSkeleton';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import DownloadAppWrapper from '@/components/downloadApp/DownloadAppWrapper';
import FeatureStrip from '@/components/ShopV2/FeatureStrip';
import WhyOriginBanner from '@/components/ShopV2/WhyOriginBanner';
import { ShopHeroSingle } from '@/components/ShopV2/ShopHero';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import the 3D globe to disable SSR
const GlobeWithMarkers = dynamic(() => import('@/components/Globe/GlobeWithMarkers'), {
  ssr: false,
});

interface HomeProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

const ShopPage = (props: HomeProps) => {
  const { mainMenuItems, footerData } = props;
  const mobile = useMediaQuery(650);
  const [loading, setLoading] = useState(true);
  const [showDownloadApp, setShowDownloadApp] = useState(false);
  const [downloadAppReady, setDownloadAppReady] = useState(false);
  const [videosPreloaded, setVideosPreloaded] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const getDataFromApi = useGetDataFromApi();
  const [address] = useAtom(addressAtom);
  const filteredCategories = useSelector((state: any) => state.shopCategories);
  const { categories } = filteredCategories;
  const subCategories = categories?.filter((item: any) => item.type !== 'main-category');

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

      return () => {
        mobileVideo.removeEventListener('loadedmetadata', handleLoad);
        desktopVideo.removeEventListener('loadedmetadata', handleLoad);
      };
    };

    preloadVideos();
  }, []);

  // Fetch categories
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

    const successHandler = (data: any) => {
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
  }, []);

  // Handle Download App banner
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
    <div className="flex flex-col items-center pb-[2vw] mob:pb-[10vw] overflow-hidden">
      {/* Hero */}
      <ShopHeroSingle />

      {/* First Subcategory */}
      {subCategories?.[0] && (
        <div className="mt-[-60vw]">
          <PopularProduce categoryDetail={subCategories[0]} />
        </div>
      )}

      {/* Categories */}
      <div className="relative z-10">
        <CategorySection />
      </div>

      <div className="flex flex-col items-center justify-center mb-[5vw] bg-[#000000] relative w-full">
        <div className="max-w-7xl mx-auto w-full relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center md:mb-12 z-10 relative"
          >
          </motion.div>
          
          {/* Globe Container with proper height */}
          <div className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center">
            <div className="w-full h-full">
              <GlobeWithMarkers />
            </div>
          </div>
        </div>
      </div>

      {/* Optional Additional Sections */}
      {/* <WhyOriginBanner /> */}
      {/* {downloadAppReady && showDownloadApp && (
        <DownloadAppWrapper onClose={handleCloseDownloadApp} />
      )} */}
    </div>
  );

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
        footerData,
      },
    };
  } catch (error) {
    console.error('Error fetching shop page data:', error);
    return {
      props: {
        mainMenuItems: [],
        footerData: {},
      },
    };
  }
};

export default ShopPage;
