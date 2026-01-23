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
      setHomepageData(data?.data);
      setLoading(false);
    };

    const failureHandler = () => {
      setHomepageData(null);
      setLoading(false);
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  }, [initialHomepageData]);

  // Extract main-category from homepage data
  const mainCategoryData = (homepageData?.find((item: any) => item.type === 'main-category')?.data) || categories || [];

  return (
    <div className='bg-[#FFF9E5]'>
      <Layout isHeaderSticky={true} mainMenuItems={mainMenuItems} footerData={footerData}>
        <CustomHead
          title="Origin Fresh | Fresh Produce Delivered to Your Doorstep"
          description="Shop for the freshest organic fruits, vegetables, and exotic produce at Origin Fresh. Quality guaranteed, delivered straight to your home."
        />
        {/* <OriginHero /> */}
        <ShopHeroSingle />
        <PrimaryFeature />

        <div className="flex items-center justify-center w-full px-[1vw]">
          <div className="flex items-center justify-between w-[80vw] mob:w-full mob:grid grid-cols-2 mob:gap-[5vw] ">
            {uspCardsData?.map((card) => <UspCard cardData={card} key={card.title} />)}

          </div>
        </div>
        {/* Homepage Category Section */}
        <div className='w-full'>
          <HomeCategorySection categories={mainCategoryData} loading={loading} />
        </div>
        <BeforeBox mdTopOffset={isMobile ? -124 : 100} mdBottomOffset={isMobile ? 110 : 220}>
          <Container className="relative z-[2]">
            <SideBySide
              variant="normal"
              imageSrc="/assets/images/commitment.png"
              imageAlt="commitment"
              imageWidth={424}
              imageHeight={499}
              imageClass="object-cover w-full max-h-[200px] md:max-h-max"
              title={`It’s fresh. Properly fresh.`}
              titleVariant={isMobile ? 'h4' : 'h2'}
              description={`We partner directly with farms across the world and across India.No middlemen. No dark stores.Just produce that moves from the farm to you at peak flavour.`}
              buttonText="Know more"
              buttonVariant="tertiary"
              rootClass="bg-secondary-200"
            />
          </Container>
          <Container maxWidth="lg" className="relative z-[0]">
            <SideBySide
              variant="parallax"
              parallaxTopImageSrc="/assets/images/parallaxImages/top-1.png"
              parallaxMainImageSrc="/assets/images/parallaxImages/main-1.png"
              parallaxBottomImageSrc="/assets/images/parallaxImages/bottom-1.png"
              parallaxImageAlt="carefully handpicked"
              title={`Grown for those who never compromise `}
              titleVariant={isMobile ? 'h4' : 'h1'}
              description={`Everyone has a right to fresh, authentic flavours. But only a few fight for it. Origin Fresh is for those who do.`}
              buttonText="Know more"
              buttonVariant="tertiary"
              rootClass="bg-transparent z-1 px-0 md:px-6 items-center"
              reverse
              parallaxImgContainerClass="relative py-5 lg:pt-9 lg:pb-20"
              parallaxTopImageWidth={276}
              parallaxTopImageHeight={225}
              parallaxMainImageHeight={700}
              parallaxMainImageWidth={500}
              parallaxBottomImageWidth={234}
              parallaxBottomImageHeight={372}
              parallaxTopImgClass="absolute w-[156px] sm:w-[256px] md:w-[276px] lg:h-auto rotate-[-5deg] top-[-84px] md:left-[190px] sm:left-[90px] lg:left-[0] left-0 blur-[2.5px]"
              parallaxBottomImgClass="absolute w-[154px] sm:w-[234px] md:w-[234px] lg:h-auto rotate-[-15deg] right-[50px] sm:right-[100px] md:right-[200px] lg:right-[-0px] bottom-[-50px] sm:bottom-[-150px] blur-[3px]"
              parallaxMainImgClass="z-[1] relative mx-auto"
              parallaxBottomImgContainerClass="z-[1]"
            />
            <Box className="h-16 md:h-0" />
          </Container>
          <Container maxWidth="lg" className="relative ">
            <SideBySide
              title={`Join the Cult of Fresh`}
              titleVariant={isMobile ? 'h4' : 'h2'}
              titleClass="text-black"
              description={`Nature takes time. It refuses to be hurried. It carefully crafts every single fruit and vegetable that you find here. This patience is what we worship, and that’s what we share with the world.`}
              buttonText="Know more"
              variant="vertical"
              imageSrc="/assets/images/smallworld.jpeg"
              imageAlt="commitment"
              imageWidth={1047}
              imageHeight={296}
              buttonVariant="tertiary"
              rootClass="bg-primary"
              imageClass="w-full md:max-h-[296px] max-h-[170px] object-cover"
            />
          </Container>
          <Box className="h-16 lg:h-24" />
          <Container maxWidth="lg">
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
          </Container>
          <Box className="h-16 lg:h-[128px]" />
        </BeforeBox>
        <Box className="h-16  lg:h-[104px]" />
        <Container className="px-0 md:px-6 relative z-0">
          <TestimonialsSection testimonials={testimonials} />
        </Container>
        {/* <Container>
          <Box className="h-16 lg:h-[104px]" />
          <SideBySide
            variant="normal"
            imageSrc="/assets/images/mobiles.png"
            imageAlt="commitment"
            imageWidth={424}
            imageHeight={499}
            title={`Download the App and Get FLAT 15% Off on 1st Order use ${"INSTALL15"}`}
            titleVariant="h5"
            titleClass="text-black md:pe-0"
            titleContainerClass="flex-col lg:block flex items-center text-center md:text-left"
            buttonText="Download Origin"
            buttonVariant="tertiary"
            rootClass="bg-primary-100 items-center justify-center pb-0 md:p-5 md:pb-0 flex-col-reverse lg:flex-row"
            imageClass="rounded-none lg:rounded-none md:w-[375px] lg:w-[375px] w-full h-min mt-[50px] md:mt-0 object-contain"
            imageContainerClass="md:flex justify-end mt-auto items-end md:w-auto lg:pe-[90px]"
          />
        </Container> */}
        {/* <Box className="h-16 lg:h-32" /> */}
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
        categories,
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
