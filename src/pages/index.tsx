import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import { Blog, Categories, FooterDataType, MainMenuType, Products, Testimonial, UspCardsData } from '@/utilities/types';
import {
  PopularItemsSlider as PopularProducts,
  TestimonialsSection,
  OriginHero,
  StoryTestimonials
} from '@/components/OriginGrids';
import SideBySide from '@/components/SideBySide';
import BeforeBox from '@/components/BeforeBox';
import LinkButton from '@/components/LinkButton/LinkButton';
import { OriginRightArrow } from '@/Icons/OriginIcons';
import JoinCultSection from '@/components/OriginGrids/JoinCultSection';
import PrimaryFeature from '@/components/OriginGrids/PrimaryFeature';
import { UspCard } from '@/components/Cards';
import CustomHead from '@/components/shared/CustomHead';
import { ShopHeroSingle } from '@/components/ShopV2/ShopHero';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import * as gtag from '@/utilities/gtag';
import { trackEvent } from '@/utilities/analytics';
// import { AnalyticsEvents } from '@/utilities/analyticsEvents';
import { trackMixpanelEvent } from '@/utilities/mixpanel';
import { AnalyticsEvents } from '@/utilities/mixpanelEvents';
import { protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import HomeCategorySection from '@/components/home/HomeCategorySection';
import PopularProduce from '@/components/ShopV2/PopularProduce';
import PopularProduceMob from '@/components/ShopV2/PopularProduceMob';
import ScrollUnderline from '@/components/shared/ScrollUnderline';
import ScrollReveal from '@/components/shared/ScrollReveal';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [homepageData, setHomepageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const getDataFromApi = useGetDataFromApi();
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const [address] = useAtom(addressAtom);
  const lastFetchedRef = useRef({ url: '', storeId: '' });

  // Fetch homepage data
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

    // Prevent redundant calls if parameters haven't changed
    if (apiUrl === lastFetchedRef.current.url && String(currentStoreId) === String(lastFetchedRef.current.storeId)) {
      console.log('Skipping redundant homepage call');
      return;
    }

    lastFetchedRef.current = { url: apiUrl, storeId: String(currentStoreId) };

    const successHandler = (data: any) => {
      // console.log(data);
      setHomepageData(data?.data);
      setLoading(false);
    };

    const failureHandler = () => {
      setHomepageData(null);
      setLoading(false);
      setFetchError(true);
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);

    // Track Home Page View
    gtag.event({
      action: 'view_home_page',
      category: 'Navigation',
      label: 'Home'
    });
    //   trackEvent(AnalyticsEvents.HOME);
    // }, [loginDetails.isLogin, address.defaultAddress?.store_id]);

    // Mixpanel event
    trackMixpanelEvent(AnalyticsEvents.HOME);
  }, [loginDetails.isLogin, address.defaultAddress?.store_id, getDataFromApi]);

  const mainCategoryData = homepageData?.find((item: any) => item.type === 'main-category')?.data || categories || [];
  const blendsCategoryData = homepageData?.find((item: any) => item.type === 'blends-category')?.data;
  const popularProduceData = homepageData?.find((item: any) => item.type === 'products-recommendation') || {
    title: 'Popular Produce',
    data: []
  };
  const heroBannerData = homepageData?.find((item: any) => item.type === 'banner-hero-web')?.data;

  return (
    <div className="overflow-x-hidden max-w-full relative">
      <Layout isHeaderSticky={true} mainMenuItems={mainMenuItems} footerData={footerData} transparentColor="white">
        <CustomHead
          title="Origin Fresh | Fresh Produce Delivered to Your Doorstep"
          description="Shop for the freshest organic fruits, vegetables, and exotic produce at Origin Fresh. Quality guaranteed, delivered straight to your home."
        />
        {/* <OriginHero /> */}
        {/* <ShopHeroSingle bannerData={heroBannerData} /> */}
        <ShopHeroSingle videoSrc="https://cdn.originfresh.in/website/banner_1.mp4" />
        <ScrollReveal direction="up" delay={0}>
          <Container maxWidth={false} className="w-full px-[3vw] mob:px-[2vw] py-8 mob:py-4 mt-10 mob:mt-4">
            <PrimaryFeature />
          </Container>
        </ScrollReveal>

        {/* <ScrollReveal direction="up" delay={100}>
          <Container maxWidth={false} className="w-full px-[10vw] mob:px-[4vw] pt-12 pb-4 mob:pb-2">
            <div className="grid grid-cols-2 tabp:grid-cols-4 gap-4 md:gap-2 w-full">
              {uspCardsData?.map((card, index) => {
                // Mapping icons as per your logic
                let icon = card.icon;
                if (index === 0) icon = '/assets/svg/Artboard 46.webp';
                if (index === 1) icon = '/assets/svg/Artboard 47.webp';
                if (index === 2) icon = '/assets/svg/Artboard 48.webp';
                if (index === 3) icon = '/assets/svg/Artboard 49.webp';
                return <UspCard cardData={{ ...card, icon }} key={index} />;
              })}
            </div>
          </Container>
        </ScrollReveal> */}

        {/* Homepage Category Section */}
        {fetchError ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Image
              src="/assets/svg/somethingwentwrong.svg"
              alt="Something went wrong"
              width={280}
              height={280}
              className="w-[280px] mob:w-[220px] mb-6 object-contain"
            />
            <p className="text-center text-gray-500 font-[SofiaPro] text-base mob:text-sm">
              Oops! Something went wrong. Please try again later.
            </p>
          </div >
        ) : (
          <>
            <ScrollReveal direction="up" delay={0}>
              <div className="w-full px-[3vw] mob:mt-[2vw]">
                <HomeCategorySection
                  categories={mainCategoryData}
                  blendsCategory={blendsCategoryData}
                  title="Shop By Category"
                  loading={loading}
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0}>
              <div className="w-full px-[3vw]">
                {isMobile ? (
                  <PopularProduceMob categoryDetail={popularProduceData} />
                ) : (
                  <PopularProduce categoryDetail={popularProduceData} />
                )}
                {/* <PopularProduce categoryDetail={popularProduceData} /> */}
              </div>
            </ScrollReveal>
          </>
        )}

        {/* <BeforeBox mdTopOffset={isMobile ? -90 : 50} mdBottomOffset={isMobile ? 20 : 80}> */}
        <ScrollReveal direction="up" delay={0}>
          <Container maxWidth={false} className="w-full px-[10vw] mob:px-[3vw] relative z-[2]">
            <SideBySide
              variant="normal"
              imageSrc="/assets/images/about/home2.webp"
              imageAlt="commitment"
              imageWidth={424}
              imageHeight={450}
              imageClass="object-cover w-full h-auto md:h-[400px] lg:h-[450px] rounded-[24px] md:rounded-[46px]"
              title={
                <span className="text-black">
                  <span className="text-secondary">It's Fresh.</span> <br />{' '}
                  <ScrollUnderline underlineColor="#E18D1F">Properly&nbsp;Fresh.</ScrollUnderline>
                </span>
              }
              titleVariant={isMobile ? 'h4' : 'h2'}
              description={`We partner directly with farms across the world and across India. <div className="py-3"> No middlemen. No dark stores. </div> Just produce that moves from the farm to you at peak&nbsp;flavour.`}
              // buttonText="Know more"
              buttonVariant="tertiary"
              rootClass="bg-[#fff8d5] items-center !p-6 md:!p-8 lg:!p-12"
              titleClass="!mb-8 md:!mb-10"
              titleContainerClass="!pt-12 md:!py-10"
            />
          </Container>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0}>
          <div className="mt-[5vw]">
            <StoryTestimonials />
          </div>
        </ScrollReveal>

        <div className="bg-[#FEF5E3]">
          <ScrollReveal direction="up" delay={0}>
            <Container maxWidth={false} className="w-full px-[10vw] mob:px-[3vw] relative z-[10] !overflow-visible">
              <SideBySide
                variant="parallax"
                parallaxTopImageSrc="/assets/images/parallaxImages/top-2.webp"
                parallaxMainImageSrc="/assets/images/parallaxImages/main-2.webp"
                // parallaxBottomImageSrc="/assets/images/parallaxImages/bottom-1.png"
                parallaxImageAlt=""
                title={
                  <a className="text-[4vw] mob:text-[10vw]">
                    Grown For <br /> Those Who Never <br />
                    <ScrollUnderline underlineColor="#E18D1F">
                      <span className="text-[#619269]">Compromise </span>
                    </ScrollUnderline>
                  </a>
                }
                titleVariant={isMobile ? 'h4' : 'h1'}
                titleClass="font-[Recoleta] !font-bold !leading-[1.1] "
                description={`Everyone has a right to fresh, authentic <br/ className="mob:hidden"> flavours. But only a few fight for it. Origin&nbsp;Fresh is for those&nbsp;who&nbsp;do.`}
                descriptionClass="md:!text-[1.614vw] !leading-[1.25]"
                // buttonText="Know more"
                buttonVariant="tertiary"
                rootClass="bg-[#FEF5E3] z-1 px-[10vw] mob:px-[3vw] items-center !rounded-none pb-12 !overflow-visible"
                reverse
                parallaxImgContainerClass="relative py-5 lg:pt-9 lg:pb-20 !lg:w-[40%] !overflow-visible"
                titleContainerClass="!pl-0 !lg:ps-0 !lg:pe-12 !pr-12 !lg:w-[55%]"
                parallaxTopImageWidth={600}
                parallaxTopImageHeight={800}
                parallaxMainImageHeight={800}
                parallaxMainImageWidth={600}
                parallaxBottomImageWidth={234}
                parallaxBottomImageHeight={372}
                parallaxTopImgClass="absolute w-[280px] sm:w-[350px] md:w-[450px] lg:h-auto rotate-[15deg] top-[0px] right-[5px] lg:right-[20px] z-0 scale-[1.5] mob:scale-[1.1]"
                parallaxBottomImgClass="absolute w-[154px] sm:w-[234px] md:w-[234px] lg:h-auto rotate-[-15deg] right-[50px] sm:right-[100px] md:right-[200px] lg:right-[-0px] bottom-[-50px] sm:bottom-[-150px] blur-[3px]"
                parallaxMainImgClass="z-[10] relative ml-auto mr-0 lg:mr-[-4vw] scale-[1.2] lg:scale-[1.5] mob:scale-[1.1]"
                parallaxBottomImgContainerClass="z-[1]"
              />
              <Box className="h-8 md:h-0" />
            </Container>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="up" delay={0}>
          <Container maxWidth={false} className="w-full px-[10vw] mob:px-[3vw] relative z-[50] ">
            {/* <SideBySide
              title={`Join The Cult <br/> Of&nbsp;Fresh`}
              titleVariant={isMobile ? 'h4' : 'h2'}
              titleClass="text-black"
              description={`Nature takes time. It refuses to be hurried. It carefully crafts every single fruit and vegetable that you find here. This patience is what we worship, and that's what we share with the&nbsp;world.`}
              buttonText="Know more"
              buttonClick1={() => (window.location.href = '/about')}
              variant="vertical"
              imageSrc="/assets/images/about/home3.webp"
              imageAlt="commitment"
              imageWidth={1047}
              imageHeight={400}
              buttonVariant="tertiary"
              rootClass="bg-primary"
              imageClass="w-full md:max-h-[400px] max-h-[170px] object-fit"
            /> */}
            <JoinCultSection />
          </Container>
        </ScrollReveal>

        {/* <Container maxWidth="lg">
            <SideBySide
              variant="normal"
              imageSrc="/assets/images/distribution.png"
              imageAlt="commitment"
              imageWidth={424}
              imageHeight={499}
              imageClass="object-cover md:min-h-full min-h-full aspect-square md:aspect-auto"
              imageContainerClass="aspect-square lg:aspect-auto max-h-[auto] lg:max-w-full"
              title={`Largest B2B fresh produce distributor`}
              titleVariant={isMobile ? 'h4' : 'h2'}
              description={`Our business is our passion and that is why we leave no stone unturned when it comes to quality and customer service!`}
              buttonText="Get in touch"
              buttonVariant="tertiary"
              rootClass="bg-transparent px-0 md:px-5 items-center"
            />
          </Container> */}

        {/* </BeforeBox> */}
        {/* <Box className="h-8 lg:h-[52px]" /> */}
        <ScrollReveal direction="up" delay={0}>
          <Container maxWidth={false} className="w-full px-[10vw] mob:px-[3vw] bg-[#FFFBEB]">
            <SideBySide
              variant="normal"
              imageSrc="/assets/images/about/mobiledownload.webp"
              imageAlt="Download app"
              imageWidth={800}
              imageHeight={1000}
              quality={100}
              priority
              imageClass="object-contain md:!h-auto md:max-h-[400px] lg:!h-[500px] md:!ml-0 lg:!ml-[6vw]"
              title={`Download <br/> the app on <br/> <span className="text-secondary">App Store</span> <span className="text-secondary">and</span> <br/> <span className="text-secondary">Play Store.</span>`}
              titleVariant="h2"
              titleClass="font-[Recoleta] text-black text-[4vw] md:text-[4vw] mob:text-[9vw] !font-bold !leading-[1.1] mb-8 mob:text-center"
              imageContainerClass="flex justify-center items-center md:!pe-5"
              titleContainerClass="flex flex-col justify-center items-center md:items-start md:!ps-12 lg:!ps-24 md:!pe-0"
              buttonText="Download Origin Fresh"
              buttonVariant="tertiary"
              buttonClick1={() => {
                const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
                if (/android/i.test(userAgent)) {
                  window.open(
                    'https://play.google.com/store/apps/details?id=com.originfresh.user&hl=en_IN&pli=1',
                    '_blank'
                  );
                } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
                  window.open('https://apps.apple.com/in/app/origin-fresh-fruits-veggies/id6505096700', '_blank');
                } else {
                  window.open(
                    'https://play.google.com/store/apps/details?id=com.originfresh.user&hl=en_IN&pli=1',
                    '_blank'
                  );
                }
              }}
              rootClass="bg-[#FFFBEB] items-center py-[5vw] mob:py-[10vw]"
            />
          </Container>
        </ScrollReveal>
      </Layout >
    </div >
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
        // categories,
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
