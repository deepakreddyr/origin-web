import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import HomeCategorySection from '@/components/home/HomeCategorySection';
import PopularProduce from '@/components/ShopV2/PopularProduce';
import PopularProduceMob from '@/components/ShopV2/PopularProduceMob';
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
import CustomHead from '@/components/shared/CustomHead';
import CategorySection from '@/components/ShopV2/CategorySection';

interface HomeProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}



const featureditemdata = {
  "item": {
    "id": 52,
    "item_code": "EX0023",
    "name": "Iceberg Lettuce",
    "image": "https://mm-devlopment.s3.ap-south-1.amazonaws.com/item-images/7f9809d3-37d6-4250-a7f4-3af0c0c3acae.webp?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX5HSPQTC4X46FOMJ%2F20260130%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20260130T083452Z&X-Amz-SignedHeaders=host&X-Amz-Expires=18000&X-Amz-Signature=b658741b1c2ac1f131144032e724b92908380d52a0de742797b29be78d070df0",
    "multiple_images": [
      "https://mm-devlopment.s3.ap-south-1.amazonaws.com/item-images/7f9809d3-37d6-4250-a7f4-3af0c0c3acae.webp?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX5HSPQTC4X46FOMJ%2F20260130%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20260130T083452Z&X-Amz-SignedHeaders=host&X-Amz-Expires=18000&X-Amz-Signature=b658741b1c2ac1f131144032e724b92908380d52a0de742797b29be78d070df0"
    ],
    "bg_color": "#F9F0DA",
    "navigation": {
      "to": "/api/v5/public/skip-login/items/52"
    },
    "is_greyed": false,
    "is_available": true,
    "is_orderable": false,
    "tag_url": null,
    "multiple_uoms": [
      {
        "variant_id": 310,
        "uom_id": 2,
        "unit": "1 piece",
        "minimum_quantity": 1,
        "maximum_quantity": 99,
        "is_visible": true,
        "is_available": true,
        "is_default": true,
        "price": 89,
        "conversion_text": "300-400g",
        "ripeness_types": null,
        "market_price": 104,
        "stepper_quantity": 1
      }
    ]
  },
  "info": {
    "info": [
      {
        "type": "normal",
        "title": "About the Product",
        "details": [
          {
            "description": "Pale, crunchy, and brutally refreshing. It’s what your greasy burger needs, your blue cheese craves, your mouth remembers."
          }
        ]
      },
      {
        "type": "storage",
        "title": "Storing Information",
        "details": [
          {
            "image": "https://admin.webdev.madrasmandi.in/storage/revamp-demo-images/storage-info/storage-info2.png",
            "title": "5 - 7 days",
            "description": " Keep it wrapped, chilled, and dry"
          }
        ],
        "sub_title": ""
      }
    ]
  },
  "upsell_items": [

  ]
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
  const isMobile = useMediaQuery(768);
  const isTablet = useMediaQuery(1024);
  const filteredCategories = useSelector((state: any) => state.shopCategories);

  // console.log(filteredCategories,"Category");
  const { categories } = filteredCategories;
  const mainCategoryData = categories?.find((item: any) => item.type === 'main-category')?.data || [];
  const subCategories = categories?.filter((item: any) => item.type !== 'main-category');

  // Preload videos for better performance
  useEffect(() => {
    const preloadVideos = () => {
      const mobileVideo = document.createElement('video');
      const desktopVideo = document.createElement('video');

      mobileVideo.src = "https://cdn.originfresh.in/website/Origin_9_16_v1.mp4";
      mobileVideo.preload = "metadata";
      mobileVideo.muted = true;

      desktopVideo.src = "https://cdn.originfresh.in/website/Origin_16_9_v1.mp4";
      desktopVideo.preload = "metadata";
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

    const successHandler = (data: any) => {
      // console.log(data,"DATA");
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

  // const LoadedUI = () => (
  //   <div className="flex flex-col items-center pb-[2vw] mob:pb-[10vw] overflow-hidden">
  //     <div className="w-full relative overflow-hidden m-0 p-0">
  //       {/* <VideoBanner
  //         mobileVideoSrc="https://cdn.originfresh.in/website/Origin_9_16_v1.mp4"
  //         desktopVideoSrc="https://cdn.originfresh.in/website/Origin_16_9_v1.mp4"
  //         autoPlay={true}
  //         muted={true}
  //         loop={true}
  //         controls={false}
  //       /> */}
  //       <ShopHeroSingle />
  //       <FeatureStrip />
  //     </div>

  //     <div className="flex flex-col gap-[6vw] mob:pl-[0vw] w-full items-center">
  //       {/* <CategorySection /> */}
  //       <HomeCategorySection categories={mainCategoryData} loading={loading} title="Shop By Category" />
  //     </div>

  //     {subCategories?.map((section: any, index: number) => {
  //       if (!section.data) return null;

  //       if (section.type === 'products-recommendation') {
  //         return (
  //           <div
  //             key={index}
  //             className="px-[2vw]"
  //           >
  //             {(isMobile || isTablet) ? (
  //               <PopularProduceMob categoryDetail={section} />
  //             ) : (
  //               <PopularProduce categoryDetail={section} />
  //             )}
  //           </div>
  //         );
  //       }
  //       <div className="w-full px-[2vw] mb-[6vw] mob:mb-[10vw]">
  //         <div className="w-full aspect-video overflow-hidden rounded-[20px] mob:rounded-[12px] shadow-sm">
  //           <iframe
  //             className="w-full h-full"
  //             src="https://www.youtube.com/embed/5Sz2FzHGpjo"
  //             title="YouTube video player"
  //             frameBorder="0"
  //             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  //             allowFullScreen
  //           ></iframe>
  //         </div>
  //       </div>
  //       // if (section.type === 'featured-item') {
  //       //   return (
  //       //     <div key={index} className="w-full">
  //       //       <FeatureProduct featuredItem={section.data} />
  //       //     </div>
  //       //   );
  //       // }

  //       return null;
  //     })}
  //     {/* <div className="">
  //       <WhyOriginBanner />
  //     </div> */}

  //     {/* {downloadAppReady && showDownloadApp && (
  //       <DownloadAppWrapper onClose={handleCloseDownloadApp} />
  //     )} */}
  //   </div>
  // );
  const LoadedUI = () => (
    <div className="flex flex-col items-center pb-[2vw] mob:pb-[10vw] mob:pt-[25vw] overflow-hidden">
      <div className="w-full relative overflow-hidden m-0 p-0">
        {/* <ShopHeroSingle />
        <FeatureStrip /> */}
      </div>

      <div className="flex flex-col gap-[6vw] mt-[7vw] mob:pl-[0vw] w-full items-center">
        <HomeCategorySection categories={mainCategoryData} loading={loading} title="Shop By Category" />
      </div>

      <div className="flex flex-col gap-[6vw] mt-[7vw] mob:pl-[0vw] w-full items-center">
        <FeatureProduct featuredItems={[featureditemdata]} />
      </div>

      {subCategories?.map((section: any, index: number) => {
        if (!section.data) return null;

        if (section.type === 'products-recommendation') {
          return (
            <div key={index} className="w-full">
              {(isMobile || isTablet) ? (
                <PopularProduceMob categoryDetail={section} />
              ) : (
                <PopularProduce categoryDetail={section} />
              )}
            </div>
          );
        }
        return null;
      })}


    </div>
  );
  return (
    <Layout mainMenuItems={mainMenuItems} isHeaderSticky={true} footerData={footerData}>
      <CustomHead
        title="Shop Fresh Produce | Origin Fresh"
        description="Browse our wide selection of fresh fruits, vegetables, and kitchen essentials. Handpicked and delivered fresh."
      />
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