import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import { Blog, Categories, FooterDataType, MainMenuType, Products, Testimonial, UspCardsData } from '@/utilities/types';
import CustomHead from '@/components/shared/CustomHead';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import * as gtag from '@/utilities/gtag';
import { trackEvent } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';
import { protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';

// New Revamped Components
import Ticker from '@/components/RevampedHome/Ticker';
import HeroBanner from '@/components/RevampedHome/HeroBanner';
import OGRecommends from '@/components/RevampedHome/OGRecommends';
import ExploreCategories from '@/components/RevampedHome/ExploreCategories';
import PromoBanner from '@/components/RevampedHome/PromoBanner';
import UpcomingEvent from '@/components/RevampedHome/UpcomingEvent';
import TopPicks from '@/components/RevampedHome/TopPicks';
import OrganicBanner from '@/components/RevampedHome/OrganicBanner';
import WhyChooseOrigin from '@/components/RevampedHome/WhyChooseOrigin';
import ChefRecipes from '@/components/RevampedHome/ChefRecipes';
import ExperienceStores from '@/components/RevampedHome/ExperienceStores';
import UpcomingEventsList from '@/components/RevampedHome/UpcomingEventsList';
import EveLauncher from '@/components/RevampedHome/EveLauncher';
import HomeSkeleton from '@/components/skeletonLoaders/home/HomeSkeleton';

interface HomeProps {
  uspCardsData: UspCardsData;
  categories: Categories;
  products: Products;
  blogs: Blog[];
  testimonials: Testimonial[];
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
  initialHomepageData: any;
}

const Home = ({
  uspCardsData,
  categories,
  products: productsList,
  blogs,
  testimonials,
  mainMenuItems,
  footerData,
  initialHomepageData
}: HomeProps) => {
  const [homepageData, setHomepageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const getDataFromApi = useGetDataFromApi();
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const [address] = useAtom(addressAtom);
  const lastFetchedRef = useRef({ url: '', storeId: '' });

  // Fetch homepage data (same as original)
  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const addressFromLs = getAddressAndStoreId();
    let apiUrl;
    let additionalHeaders = {};

    if (token && addressFromLs) {
      apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getHomepage'];
      additionalHeaders = { 'store-id': addressFromLs.store_id };
    } else {
      apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['getHomepage'];
    }

    const currentStoreId = addressFromLs?.store_id || '';

    if (apiUrl === lastFetchedRef.current.url && String(currentStoreId) === String(lastFetchedRef.current.storeId)) {
      return;
    }

    lastFetchedRef.current = { url: apiUrl, storeId: String(currentStoreId) };

    const successHandler = (data: any) => {
      setHomepageData(data?.data);
      setLoading(false);
    };

    const failureHandler = () => {
      setHomepageData(null);
      setLoading(false);
      setFetchError(true);
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);

    gtag.event({
      action: 'view_home_page',
      category: 'Navigation',
      label: 'Home'
    });
    trackEvent(AnalyticsEvents.HOME);
  }, [loginDetails.isLogin, address.defaultAddress?.store_id]);

  const mainCategoryData = homepageData?.find((item: any) => item.type === 'main-category')?.data || categories || [];
  const blendsCategoryData = homepageData?.find((item: any) => item.type === 'blends-category')?.data;
  const popularProduceData = homepageData?.find((item: any) => item.type === 'products-recommendation') || {
    title: 'Popular Produce',
    data: []
  };
  const heroBannerData = homepageData?.find((item: any) => item.type === 'banner-hero-web')?.data;

  // Add scroll-reveal effect for all components
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document
      .querySelectorAll('[data-reveal], [data-reveal="true"], .animate-fade-in-up')
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [homepageData]);

  return (
    <div className="overflow-x-clip max-w-[100vw] relative bg-[#fffdf8]">
      <Ticker />
      <Layout isHeaderSticky={true} mainMenuItems={mainMenuItems} footerData={footerData} transparentColor="white">
        <CustomHead
          title="Origin Fresh | Fresh Produce Delivered to Your Doorstep"
          description="Shop for the freshest organic fruits, vegetables, and exotic produce at Origin Fresh. Quality guaranteed, delivered straight to your home."
        />

        {loading ? (
          <HomeSkeleton />
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center py-[100px] px-[24px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/svg/somethingwentwrong.svg"
              alt="Something went wrong"
              className="w-[280px] mob:w-[220px] mb-6"
            />
            <p className="text-center text-gray-500 font-SofiaPro text-[16px]">
              Oops! Something went wrong. Please try again later.
            </p>
          </div>
        ) : (
          <>
            <HeroBanner />
            <OGRecommends />
            <ExploreCategories categories={mainCategoryData} blendsCategory={blendsCategoryData} />
            <PromoBanner />
            <UpcomingEvent />
            <TopPicks categoryDetail={popularProduceData} />
            <OrganicBanner />
            <WhyChooseOrigin />
            <ChefRecipes />
            <ExperienceStores />
            <UpcomingEventsList />
          </>
        )}

        {/* <EveLauncher /> */}
      </Layout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
    const originApiData = await response.json();
    const { uspCardsData, categories, products, blogs, testimonials, mainMenuItems, footerData } = originApiData;
    return {
      props: {
        uspCardsData,
        products,
        blogs,
        testimonials,
        mainMenuItems,
        footerData,
        initialHomepageData: null
      }
    };
  } catch (error) {
    console.error('Error fetching USP card data:', error);
    return {
      props: {
        uspCardsData: [],
        categories: [],
        products: [],
        popularBlogs: [],
        testimonials: [],
        mainMenuItems: [],
        footerData: {},
        initialHomepageData: null
      }
    };
  }
};

export default Home;
