import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
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
import { AnalyticsEvents } from '@/utilities/analyticsEvents';
import { protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import HomeCategorySection from '@/components/home/HomeCategorySection';
import PopularProduce from '@/components/ShopV2/PopularProduce';
import PopularProduceMob from '@/components/ShopV2/PopularProduceMob';
import ScrollUnderline from '@/components/shared/ScrollUnderline';
import ScrollReveal from '@/components/shared/ScrollReveal';
import PremiumImportedProduce from '@/components/home/PremiumImportedProduce';
import InfiniteScroll from 'react-infinite-scroll-component';
import PopularCarouselSkeleton from '@/components/skeletonLoaders/shop/PopularCarouselSkeleton';
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
  const [homepageData, setHomepageData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const baseUrlRef = useRef('');
  const additionalHeadersRef = useRef<any>({});
  const getDataFromApi = useGetDataFromApi();
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const [address] = useAtom(addressAtom);
  const lastFetchedStoreRef = useRef('');

  // Reset and refetch when login or address changes
  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const addressFromLs = getAddressAndStoreId();
    const currentStoreId = String(addressFromLs?.store_id || '');

    if (lastFetchedStoreRef.current === currentStoreId) return;
    lastFetchedStoreRef.current = currentStoreId;

    if (token && addressFromLs) {
      baseUrlRef.current = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getHomepage'];
      additionalHeadersRef.current = { 'store-id': addressFromLs.store_id };
    } else {
      baseUrlRef.current = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['getHomepage'];
      additionalHeadersRef.current = {};
    }

    // Reset pagination state
    setHomepageData([]);
    setPage(1);
    setHasMore(true);
    setFetchError(false);

    // Track Home Page View
    gtag.event({
      action: 'view_home_page',
      category: 'Navigation',
      label: 'Home'
    });
    trackEvent(AnalyticsEvents.HOME);
  }, [loginDetails.isLogin, address.defaultAddress?.store_id]);

  // Fetch page when page number changes
  useEffect(() => {
    if (!baseUrlRef.current) return;

    const apiUrl = `${baseUrlRef.current}?page=${page}`;

    const successHandler = (data: any) => {
      const newSections: any[] = data?.data || [];
      const meta = data?.meta;

      // Use meta.has_more if available, otherwise fall back to empty-array check
      const morePages = meta ? meta.has_more : newSections.length > 0;
      setHasMore(morePages);

      setHomepageData((prev) => (page === 1 ? newSections : [...prev, ...newSections]));
      setLoading(false);
      setIsFetchingMore(false);
    };

    const failureHandler = () => {
      if (page === 1) {
        setFetchError(true);
      }
      setHasMore(false);
      setLoading(false);
      setIsFetchingMore(false);
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeadersRef.current);
  }, [page, getDataFromApi]);

  const fetchNextPage = () => {
    if (hasMore && !loading && !isFetchingMore) {
      setIsFetchingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  const mainCategoryData = homepageData?.find((item: any) => item.type === 'main-category')?.data || categories || [];
  const blendsCategoryData = homepageData?.find((item: any) => item.type === 'blends-category')?.data;
  const popularProduceSections = homepageData?.filter((item: any) => item.type === 'products-recommendation') || [];
  const heroBannerData = homepageData?.find((item: any) => item.type === 'banner-hero-web')?.data;

  const renderPopularProduce = (index: number, alignment: 'left' | 'right') => {
    const sectionData = popularProduceSections[index];

    // If data not yet loaded but there are more pages, show alignment-aware shimmer
    if (!sectionData) {
      if (!hasMore) return null;
      const shimmerAlignClass =
        alignment === 'right'
          ? 'md:ml-[max(6vw,calc(56vw_-_720px))] md:mr-0 md:rounded-none md:rounded-l-[48px] md:border-r-0'
          : 'md:ml-0 md:mr-[max(6vw,calc(56vw_-_720px))] md:rounded-none md:rounded-r-[48px] md:border-l-0';
      return (
        <div
          key={`shimmer-${index}`}
          className={`w-[92vw] mx-auto mt-[5vw] mb-[2vw] md:bg-white md:border md:border-[#EDE6D4] md:rounded-[32px] md:py-12 mob:py-0 mob:bg-transparent mob:border-none mob:rounded-none ${shimmerAlignClass}`}
        >
          <PopularCarouselSkeleton noWrapperStyles />
        </div>
      );
    }

    return (
      <ScrollReveal direction="up" delay={0} key={`popular-produce-${index}`}>
        <div className="w-full mt-[5vw] mb-[2vw]">
          {isMobile ? (
            <PopularProduceMob categoryDetail={sectionData} />
          ) : (
            <PopularProduce categoryDetail={sectionData} alignment={alignment} />
          )}
        </div>
      </ScrollReveal>
    );
  };

  return (
    <div className="overflow-x-hidden max-w-full relative">
      <Layout isHeaderSticky={true} mainMenuItems={mainMenuItems} footerData={footerData} transparentColor="white">
        <CustomHead
          title="Origin Fresh | Fresh Produce Delivered to Your Doorstep"
          description="Shop for the freshest organic fruits, vegetables, and exotic produce at Origin Fresh. Quality guaranteed, delivered straight to your home."
        />
        {/* <ShopHeroSingle bannerData={heroBannerData} /> */}
        <ShopHeroSingle videoSrc="https://cdn.originfresh.in/website/hydroherovideo.mp4" />

        <ScrollReveal direction="up" delay={0}>
          <div className="w-full">
            <PremiumImportedProduce products={popularProduceSections[0]?.data || []} isLoading={loading} />
          </div>
        </ScrollReveal>

        {/* <ScrollReveal direction="up" delay={0}>
          <Container maxWidth={false} className="w-full px-[3vw] mob:px-[2vw] py-8 mob:py-4 mt-10 mob:mt-4">
            <PrimaryFeature />
          </Container>
        </ScrollReveal> */}

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/svg/somethingwentwrong.svg"
              alt="Something went wrong"
              className="w-[280px] mob:w-[220px] mb-6"
            />
            <p className="text-center text-gray-500 font-[SofiaPro] text-base mob:text-sm">
              Oops! Something went wrong. Please try again later.
            </p>
          </div>
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

            {/* 1st Popular Produce Section */}
            {renderPopularProduce(1, 'right')}
          </>
        )}

        {/* <BeforeBox mdTopOffset={isMobile ? -90 : 50} mdBottomOffset={isMobile ? 20 : 80}> */}
        {/* <ScrollReveal direction="up" delay={0}>
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
        </ScrollReveal> */}

        <ScrollReveal direction="up" delay={0}>
          <div className="mt-[5vw]">
            <StoryTestimonials />
          </div>
        </ScrollReveal>

        {/* 2nd Popular Produce Section */}
        {renderPopularProduce(2, 'left')}

        <div className="bg-[#FEF5E3] w-full pt-[8vw] md:pt-[104.63px]">
          <ScrollReveal direction="up" delay={0}>
            <div className="max-w-[1440px] mx-auto w-full px-[3vw] md:pl-[73px] md:pr-[41.85px] relative z-[10] !overflow-visible">
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
                descriptionClass="font-[SofiaPro] !font-[400] md:!text-[1.614vw] !leading-[1.25]"
                // buttonText="Know more"
                buttonVariant="tertiary"
                rootClass="items-center !rounded-none pb-12 !overflow-visible !p-0 bg-transparent"
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
              <div className="h-8 md:h-0" />
            </div>
          </ScrollReveal>
        </div>

        {/* 3rd Popular Produce Section */}
        {renderPopularProduce(3, 'right')}

        {/* Paginated Popular Produce Sections — driven by meta.has_more */}
        <InfiniteScroll
          dataLength={homepageData.length}
          next={fetchNextPage}
          hasMore={hasMore && !loading}
          loader={null}
          scrollThreshold="3000px"
          style={{ overflow: 'visible' }}
        >
          {popularProduceSections.slice(3).map((section: any, idx: number) => {
            const alignment: 'left' | 'right' = idx % 2 === 0 ? 'right' : 'left';
            return (
              <ScrollReveal direction="up" delay={0} key={`popular-produce-paginated-${section.title || idx}`}>
                <div className="w-full mt-[5vw] mb-[2vw]">
                  {isMobile ? (
                    <PopularProduceMob categoryDetail={section} />
                  ) : (
                    <PopularProduce categoryDetail={section} alignment={alignment} />
                  )}
                </div>
              </ScrollReveal>
            );
          })}

          {/* Alignment-aware shimmer — mirrors the next section's left/right position */}
          {isFetchingMore &&
            popularProduceSections.length >= 4 &&
            (() => {
              const nextIdx = popularProduceSections.slice(3).length;
              const nextAlignment = nextIdx % 2 === 0 ? 'right' : 'left';
              const shimmerAlignClass =
                nextAlignment === 'right'
                  ? 'md:ml-[max(6vw,calc(56vw_-_720px))] md:mr-0 md:rounded-none md:rounded-l-[48px] md:border-r-0'
                  : 'md:ml-0 md:mr-[max(6vw,calc(56vw_-_720px))] md:rounded-none md:rounded-r-[48px] md:border-l-0';
              return (
                <div
                  className={`w-[92vw] mx-auto mt-[5vw] mb-[2vw] md:bg-white md:border md:border-[#EDE6D4] md:rounded-[32px] md:py-12 mob:py-0 mob:bg-transparent mob:border-none mob:rounded-none ${shimmerAlignClass}`}
                >
                  <PopularCarouselSkeleton noWrapperStyles />
                </div>
              );
            })()}
        </InfiniteScroll>

        {/* <ScrollReveal direction="up" delay={0}>
          <Container maxWidth={false} className="w-full px-[2vw] mob:px-[3vw] relative z-[50] ">
            <SideBySide
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
            />
            <JoinCultSection />
          </Container>
        </ScrollReveal> */}

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
          <div className="w-full px-[3vw] bg-[#FEF5E3] pt-[8vw] pb-[12vw] md:pt-[5vw] md:pb-[8vw]">
            <div className="max-w-[1440px] mx-auto w-full px-4 md:px-[3vw]">
              <SideBySide
                variant="normal"
                reverse={true}
                imageSrc="/assets/images/about/mobiledownload.webp"
                imageAlt="Download app"
                imageWidth={800}
                imageHeight={1000}
                quality={100}
                priority
                imageClass="object-contain w-full h-auto md:!h-auto md:!max-h-none lg:scale-110 lg:origin-right"
                title={
                  <span className="text-[4vw] mob:text-[10vw]">
                    Download <br /> the app now.
                  </span>
                }
                titleVariant={isMobile ? 'h4' : 'h1'}
                titleClass="order-1 font-[Recoleta] !font-bold !leading-[1.1] text-black mb-6 md:!mb-2 text-center mob:text-center md:text-left align-middle"
                description={`Get exclusive access to special offers, track your orders in real-time, and discover new exotic fruits weekly. Available on iOS and Android.`}
                descriptionClass="order-3 md:order-2 font-[SofiaPro] !font-[400] text-black md:!text-[1.614vw] !leading-[1.25] md:max-w-[647px] mb-12 md:!mt-4 md:!mb-12 text-center mob:text-center md:text-left"
                imageContainerClass="flex justify-center items-center"
                titleContainerClass="flex flex-col justify-center items-center md:items-start md:!ps-0"
                buttonContainerClass="order-2 md:order-3 mb-2 md:mb-0 justify-center md:justify-start w-full md:w-auto"
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
                rootClass="items-center !px-0 !py-0 bg-transparent"
              />
            </div>
          </div>
        </ScrollReveal>
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
