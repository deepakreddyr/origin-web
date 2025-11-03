import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import CategorySection from '@/components/ShopV2/CategorySection';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { protectedUrl, unprotectedUrl } from '@/url';
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
import ShopHero from '@/components/ShopV2/ShopHero';

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
  item: any;
  info: any;
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

        if (addressFromLs)
          additionalHeaders = {
            'store-id': addressFromLs.store_id
          };
      } else {
        apiUrl =
          process.env.NEXT_PUBLIC_BACKEND_API_URL +
          unprotectedUrl['getCategories'] +
          `/${query.cid}` +
          `/sub-categories/${query.scid}`;
      }
      const { category, cid, subCategory, scid } = query;
      setFilters({
        ...filters,
        category,
        cid,
        scid,
        subCategory
      });
      const successHandler = (data: any) => {
        dispatch(setProductList(data?.items));
        dispatch(setIsProductListLoading(false));
        dispatch(setShopSubCategories(data?.sub_categories));
        dispatch(setIsShopSubCategoriesFetched(false));
        setFeaturedItem(data?.featured_item || null);
      };
      const failureHandler = (data: any) => {};
      getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
    }
  }, [isReady, query]);

  useEffect(() => {
    if (!shopCategories.isCategoriesFetched) {
      const token = localStorage.getItem('user_token');
      const addressFromLs = getAddressAndStoreId();
      let apiUrl;
      let additionalHeaders = {};
      if (token && addressFromLs) {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getShopDetails'];
        additionalHeaders = {
          'store-id': addressFromLs.store_id
        };
      } else {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['getShopDetails'];
      }
      const successHandler = (data: any) => {
        dispatch(setShopCategories(data?.data));
        dispatch(setIsProductListLoading(false));
        dispatch(setIsShopCategoriesFetched(true));
      };
      const failureHandler = (data: any) => {
        dispatch(setIsProductListLoading(false));
      };

      getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
    }
  }, []);

  return (
    <Layout mainMenuItems={mainMenuItems} footerData={footerData} isHeaderSticky={true}>
      {/* Container with overflow-clip instead of overflow-hidden */}
      <div className="overflow-clip">
        <ShopHero />
        <div className="flex flex-col items-center mt-[-25vw] mob:pt-[10vw]">
          <div className="flex flex-col w-[80.7vw] mob:w-full pb-[10vw] relative">
            {filters.category ? (
              <CategoryAndSubCategory filters={filters} setFilters={setFilters} />
            ) : null}
            <div className="mob:px-[4vw]">
              <CardsWrapper />
            </div>
          </div>
          <div className='mb-7'>
            <CategorySection/>
          </div>
        </div>
      </div>
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

export default ShopDetails;