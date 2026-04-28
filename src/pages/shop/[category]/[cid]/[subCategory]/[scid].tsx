import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import ProductsFilterSlider from '@/components/Shop/ProductsFilterSlider';
import FiltersHeaderSection from '@/components/Shop/FiltersHeaderSection';
import { Categories, FooterDataType, MainMenuType, Products } from '@/utilities/types';
import { Box, Typography } from '@mui/material';
import CategorySection from '@/components/ShopV2/CategorySection';
import PopularProduce from '@/components/ShopV2/PopularProduce';
import BestSellers from '@/components/ShopV2/BestSellers';
import { header, request } from '@/utilities/request';
import { axiosFetch } from '@/utilities/hooks/useAxiosFetch';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import * as gtag from '@/utilities/gtag';
import { trackEvent } from '@/utilities/analytics';
// import { AnalyticsEvents } from '@/utilities/analyticsEvents';
import { trackMixpanelEvent } from '@/utilities/mixpanel';
import { AnalyticsEvents } from '@/utilities/mixpanelEvents';
import { protectedUrl, unprotectedUrl } from '@/url';
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import { getAddressAndStoreId } from '@/utilities/utils';
import CategoryAndSubCategory from '@/components/ShopV2/CategoryAndSubCategory/CategoryAndSubCategory';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsShopCategoriesFetched,
  setIsShopSubCategoriesFetched,
  setShopCategories,
  setShopSubCategories
} from '@/store/slice/shopCategoriesSlice';
import CardsWrapper from '@/components/ShopV2/shopDetails/CardsWrapper';
import { setIsProductListLoading, setProductList } from '@/store/slice/productsSlice';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import DownloadAppWrapper from '@/components/downloadApp/DownloadAppWrapper';
import ShopHero from '@/components/ShopV2/ShopHero';
import FeatureStrip from '@/components/ShopV2/FeatureStrip';
import FeaturedProduct from '@/components/ShopV2/FeaturedProduct';
import WhyOriginAndTestimonial from '@/components/ShopV2/WhyOriginAndTestimonial';
import CustomHead from '@/components/shared/CustomHead';

interface HomeProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

interface FiltersType {
  category: any;
  cid: any;
  scid: any;
  subCategory: any;
}

interface FeaturedItemType {
  item: {
    id: number;
    item_code: string;
    name: string;
    image: string;
    multiple_images: string[];
    bg_color: string;
    navigation: {
      to: string;
    };
    is_greyed: boolean;
    is_available: boolean;
    is_orderable: boolean;
    tag_url: string | null;
    multiple_uoms: Array<{
      variant_id: number;
      name: string | null;
      uom_id: number;
      unit: string;
      minimum_quantity: number;
      maximum_quantity: number;
      stepper_quantity: number;
      is_visible: boolean;
      is_available: boolean;
      is_default: boolean;
      price: number;
      platform_id: number;
      formatted_price: string;
      cart_quantity: number;
      conversion_text: string;
      is_not_discounted: boolean;
      ripeness_types: any;
      cart_ripeness: any;
      market_price: number;
    }>;
  };
  info: {
    info: Array<{
      type: string;
      title: string;
      details: Array<{
        description?: string;
        title?: string;
      }>;
      sub_title?: string;
    }>;
  };
  upsell_items: any[];
}

const ShopDetails = (props: HomeProps) => {
  const mobile = useMediaQuery(600);

  const [filters, setFilters] = useState<FiltersType>({
    category: null,
    cid: null,
    scid: null,
    subCategory: null
  });

  const [featuredItem, setFeaturedItem] = useState<FeaturedItemType | null>(null);

  const { mainMenuItems, footerData } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const { query, isReady } = router;
  const getDataFromApi = useGetDataFromApi();
  const shopCategories = useSelector((state: any) => state.shopCategories);
  const products = useSelector((state: any) => state.products);
  // console.log(products, "PRODUCTS")

  useEffect(() => {
    if (isReady) {
      const token = localStorage.getItem('user_token');
      const addressFromLs = getAddressAndStoreId();
      let additionalHeaders = {};

      let apiUrl;

      if (token && addressFromLs) {
        apiUrl =
          process.env.NEXT_PUBLIC_BACKEND_API_URL +
          protectedUrl['getCategories'] +
          `/${query.cid}` +
          `/sub-categories/${query.scid}`;
      } else {
        apiUrl =
          process.env.NEXT_PUBLIC_BACKEND_API_URL +
          unprotectedUrl['getCategories'] +
          `/${query.cid}` +
          `/sub-categories/${query.scid}`;
      }

      const storeId = localStorage.getItem('store-id');
      if (storeId && storeId !== 'null') {
        additionalHeaders = {
          'store-id': storeId
        };
      }
      const { category, cid, subCategory, scid } = query;
      setFilters({
        ...filters,
        category,
        cid,
        scid,
        subCategory
      });
      dispatch(setProductList([]));
      dispatch(setIsProductListLoading(true));
      const successHandler = (data: any) => {
        dispatch(setProductList(data?.items));
        dispatch(setIsProductListLoading(false));

        dispatch(setShopSubCategories(data?.sub_categories));
        dispatch(setIsShopSubCategoriesFetched(false));
        setFeaturedItem(data?.featured_item || null);
      };
      const failureHandler = (data: any) => {
        dispatch(setIsProductListLoading(false));
      };
      getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);

      // Track Category View
      gtag.event({
        action: 'view_item_list',
        category: 'Navigation',
        label: `${query.category} - ${query.subCategory}`,
        items: [] // Optionally pass items once fetched
      });

      // CleverTap events
      // trackEvent(AnalyticsEvents.CATEGORY_VIEWED, {
      //   category_name: String(query.category || '')
      // });
      // trackEvent(AnalyticsEvents.SUB_CATEGORY_VIEWED, {
      //   sub_category_name: String(query.subCategory || '')
      // });
      if (query.category) {
        trackMixpanelEvent(AnalyticsEvents.CATEGORY_VIEWED, {
          category_name: String(query.category)
        });
      }

      if (query.subCategory && query.subCategory !== 'all-items' && query.subCategory !== 'All-Items') {
        trackMixpanelEvent(AnalyticsEvents.SUB_CATEGORY_VIEWED, {
          sub_category_name: String(query.subCategory)
        });
      }
    }
  }, [isReady, query, dispatch, filters, getDataFromApi]);

  useEffect(() => {
    if (!shopCategories.isCategoriesFetched) {
      const token = localStorage.getItem('user_token');
      const addressFromLs = getAddressAndStoreId();
      let apiUrl;
      let additionalHeaders = {};
      if (token && addressFromLs) {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getShopDetails'];
      } else {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['getShopDetails'];
      }

      const storeId = localStorage.getItem('store-id');
      if (storeId && storeId !== 'null') {
        additionalHeaders = {
          'store-id': storeId
        };
      }
      const successHandler = (data: any) => {
        // console.log(data,"data")
        dispatch(setShopCategories(data?.data));
        dispatch(setIsProductListLoading(false));
        dispatch(setIsShopCategoriesFetched(true));
      };
      const failureHandler = (data: any) => {
        dispatch(setIsProductListLoading(false));
      };

      getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
    }
  }, [dispatch, getDataFromApi, shopCategories.isCategoriesFetched]);

  return (
    <Layout mainMenuItems={mainMenuItems} footerData={footerData} isHeaderSticky={true}>
      <CustomHead
        title={`${query.category} | Origin Fresh`}
        description={`Explore our wide range of ${query.category} at Origin Fresh. Quality and freshness guaranteed.`}
      />
      {/* <ShopHero /> */}
      {/* <FeatureStrip /> */}
      <div className="flex flex-col items-center justify-center mob:pt-[25vw] mt-[7vw]">
        <div className="flex flex-col gap-[2.2vw] w-[80.7vw] mob:w-full  mob:px-[4vw] pb-[10vw] relative ">
          {filters.category ? <CategoryAndSubCategory filters={filters} setFilters={setFilters} /> : null}
          {/* {featuredItem && <FeaturedProduct featuredItem={featuredItem} />} */}
          <CardsWrapper />
        </div>
      </div>
      {/* <div className='mob:mb-[2vw]'>
        <CategorySection />
      </div> */}
      {/* <div className="flex flex-col gap-[2.2vw] w-[80.7vw] pt-[2.5vw] mob:w-full mob:px-[4vw] pb-[3vw] relative mx-auto">
        <WhyOriginAndTestimonial category={filters.category} />
      </div> */}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // console.log("hello");
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

export default ShopDetails;
