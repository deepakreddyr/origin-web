import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import { Blog, Categories, FooterDataType, MainMenuType, Products, Testimonial, UspCardsData } from '@/utilities/types';
import { PopularItemsSlider as PopularProducts, TestimonialsSection, OriginHero } from '@/components/OriginGrids';
import SideBySide from '@/components/SideBySide';
import BeforeBox from '@/components/BeforeBox';
import LinkButton from '@/components/LinkButton/LinkButton';
import { OriginRightArrow } from '@/Icons/OriginIcons';
import PrimaryFeature from '@/components/OriginGrids/PrimaryFeature';
import { UspCard } from '@/components/Cards';
import CustomHead from '@/components/shared/CustomHead';
import { ShopHeroSingle } from '@/components/ShopV2/ShopHero';
import { useEffect, useState } from 'react';
import { protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import HomeCategorySection from '@/components/home/HomeCategorySection';
import PopularProduce from '@/components/ShopV2/PopularProduce';
import PopularProduceMob from '@/components/ShopV2/PopularProduceMob';

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
  const getDataFromApi = useGetDataFromApi();

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

    const successHandler = (data: any) => {
      // console.log(data);
      setHomepageData(data?.data);
      setLoading(false);
    };

    const failureHandler = () => {
      setHomepageData(null);
      setLoading(false);
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  }, [initialHomepageData]);

  const mainCategoryData = homepageData?.find((item: any) => item.type === 'main-category')?.data || categories || [];
  const blendsCategoryData = homepageData?.find((item: any) => item.type === 'blends-category')?.data;
  const popularProduceData = homepageData?.find((item: any) => item.type === 'products-recommendation') || {
    title: 'Popular Produce',
    data: []
  };
  const heroBannerData = homepageData?.find((item: any) => item.type === 'banner-hero-web')?.data;

  return (
    <div className="overflow-x-hidden max-w-full relative">
      <Layout isHeaderSticky={true} mainMenuItems={mainMenuItems} footerData={footerData}>
        <CustomHead
          title="Origin Fresh | Fresh Produce Delivered to Your Doorstep"
          description="Shop for the freshest organic fruits, vegetables, and exotic produce at Origin Fresh. Quality guaranteed, delivered straight to your home."
        />
        {/* <OriginHero /> */}
        <ShopHeroSingle bannerData={heroBannerData} />
        <PrimaryFeature />

        <div className="flex items-center justify-center w-full px-[1vw]">
          <div className="flex items-center justify-between w-[80vw] mob:w-full mob:grid grid-cols-2 mob:gap-[5vw] ">
            {uspCardsData?.map((card) => <UspCard cardData={card} key={card.title} />)}
          </div>
        </div>
        {/* Homepage Category Section */}
        <div className="w-full px-[5vw] mob:mt-[10vw]">
          <HomeCategorySection categories={mainCategoryData} blendsCategory={blendsCategoryData} loading={loading} />
        </div>

        <div className="w-full px-[5vw]">
          {isMobile || isTablet ? (
            <PopularProduceMob categoryDetail={popularProduceData} />
          ) : (
            <PopularProduce categoryDetail={popularProduceData} />
          )}
          {/* <PopularProduce categoryDetail={popularProduceData} /> */}
        </div>
        <BeforeBox mdTopOffset={isMobile ? -90 : 50} mdBottomOffset={isMobile ? 20 : 80}>
          <Container className="relative z-[2]">
            <SideBySide
              variant="normal"
              imageSrc="/assets/images/about/home2.webp"
              imageAlt="commitment"
              imageWidth={424}
              imageHeight={499}
              imageClass="object-cover w-full h-[300px] lg:h-[450px] scale-[1]"
              title={`It’s fresh. Properly fresh.`}
              titleVariant={isMobile ? 'h4' : 'h2'}
              description={`We partner directly with farms across the world and across India. <br/> No middlemen. No dark stores. <br/> Just produce that moves from the farm to you at peak flavour.`}
              // buttonText="Know more"
              buttonVariant="tertiary"
              rootClass="bg-secondary-200"
            />
          </Container>
          <Container maxWidth="lg" className="relative z-[10] !overflow-visible">
            <SideBySide
              variant="parallax"
              parallaxTopImageSrc="/assets/images/parallaxImages/top-2.webp"
              parallaxMainImageSrc="/assets/images/parallaxImages/main-2.webp"
              // parallaxBottomImageSrc="/assets/images/parallaxImages/bottom-1.png"
              parallaxImageAlt="carefully handpicked"
              title={`Grown For <br/> Those Who Never <br/> Compromise `}
              titleVariant={isMobile ? 'h4' : 'h1'}
              titleClass="font-Stinger text-[#231F20] !font-bold !leading-[1.1] "
              description={`Everyone has a right to fresh, authentic flavours. But only a few fight for it. Origin Fresh is for those who do.`}
              // buttonText="Know more"
              buttonVariant="tertiary"
              rootClass="bg-[#FAF7F0] z-1 px-0 md:px-6 items-center mob:!rounded-none pb-12 !overflow-visible"
              reverse
              parallaxImgContainerClass="relative py-5 lg:pt-9 lg:pb-20 !lg:w-[45%] !overflow-visible"
              titleContainerClass="!pl-0 !lg:ps-0 !lg:pe-12 !pr-12"
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
          <Container maxWidth="lg" className="relative z-[50] ">
            <SideBySide
              title={`Join the Cult of Fresh`}
              titleVariant={isMobile ? 'h4' : 'h2'}
              titleClass="text-black"
              description={`Nature takes time. It refuses to be hurried. It carefully crafts every single fruit and vegetable that you find here. This patience is what we worship, and that’s what we share with the world.`}
              buttonText="Know more"
              buttonClick1={() => (window.location.href = '/about')}
              variant="vertical"
              imageSrc="/assets/images/about/home3.webp"
              imageAlt="commitment"
              imageWidth={1047}
              imageHeight={296}
              buttonVariant="tertiary"
              rootClass="bg-primary"
              imageClass="w-full md:max-h-[296px] max-h-[170px] object-fit"
            />
          </Container>

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
          <Container className="px-0 md:px-6 mt-[8vw]">
            <TestimonialsSection testimonials={testimonials} />
          </Container>
          <Box className="h-8 lg:h-[64px]" />
        </BeforeBox>
        {/* <Box className="h-8 lg:h-[52px]" /> */}
        <Container className="mt-[8vw]">
          <Box className="h-16 lg:h-[104px]" />
          <SideBySide
            variant="normal"
            imageSrc="/assets/images/about/mobiledownload.webp"
            imageAlt="commitment"
            imageWidth={424}
            imageHeight={499}
            title={`Download the app on Play Store and App Store.`}
            titleVariant="h5"
            titleClass="text-black md:pe-0"
            titleContainerClass="flex-col lg:block flex items-center text-center md:text-left"
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
            rootClass="bg-primary-100 items-center justify-center pb-0 md:p-5 md:pb-0 flex-col-reverse lg:flex-row"
            imageClass="rounded-none lg:rounded-none md:w-[375px] lg:w-[375px] w-full h-min mt-[50px] md:mt-0 object-contain"
            imageContainerClass="md:flex justify-end mt-auto items-end md:w-auto lg:pe-[90px]"
          />
        </Container>
        <Box className="h-16 lg:h-32" />
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
