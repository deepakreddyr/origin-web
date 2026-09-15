import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import { useEffect, useRef, useState } from 'react';
import * as gtag from '@/utilities/gtag';
import { protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { useDispatch, useSelector } from 'react-redux';
import { setIsShopCategoriesFetched, setShopCategories } from '@/store/slice/shopCategoriesSlice';
import { addressAtom } from '@/features/Address/context/atoms';
import { useAtom } from 'jotai';
import { getAddressAndStoreId } from '@/utilities/utils';
import CustomHead from '@/components/shared/CustomHead';

// Revamped Components
import ShopHeroBanner from '@/components/RevampedShop/ShopHeroBanner';
import PromoBanner from '@/components/RevampedHome/PromoBanner';
import ShopProductCategory from '@/components/RevampedShop/ShopProductCategory';
import ExploreCategories from '@/components/RevampedHome/ExploreCategories';
import WhyChooseOrigin from '@/components/RevampedHome/WhyChooseOrigin';
import ShopSkeleton from '@/components/skeletonLoaders/shop/ShopSkeleton';

interface HomeProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

const ShopPage = (props: HomeProps) => {
  const { mainMenuItems, footerData } = props;
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const getDataFromApi = useGetDataFromApi();
  const [address] = useAtom(addressAtom);
  const lastFetchedRef = useRef({ url: '', storeId: '' });
  const filteredCategories = useSelector((state: any) => state.shopCategories);
  const loginDetails = useSelector((state: any) => state.loginDetails);

  const { categories } = filteredCategories;
  const mainCategoryData = categories?.find((item: any) => item.type === 'main-category')?.data || [];
  const subCategories = categories?.filter((item: any) => item.type !== 'main-category');
  const blendsCategoryData = categories?.find((item: any) => item.type === 'blends-category')?.data || [];

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

    if (apiUrl === lastFetchedRef.current.url && String(currentStoreId) === String(lastFetchedRef.current.storeId)) {
      return;
    }

    lastFetchedRef.current = { url: apiUrl, storeId: String(currentStoreId) };

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

    gtag.event({
      action: 'view_item_list',
      category: 'Navigation',
      label: 'Shop All'
    });
  }, [loginDetails.isLogin, address.defaultAddress?.store_id]);

  // Add scroll-reveal effect for all components once loading finishes
  useEffect(() => {
    if (loading) return;

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

    // Slightly delay to ensure the DOM has painted the LoadedUI elements
    setTimeout(() => {
      document
        .querySelectorAll('[data-reveal], [data-reveal="true"], .animate-fade-in-up')
        .forEach((el) => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, [loading, subCategories]);

  return (
    <Layout mainMenuItems={mainMenuItems} isHeaderSticky={true} footerData={footerData}>
      <CustomHead
        title="Shop Fresh Produce | Origin Fresh"
        description="Browse our wide selection of fresh fruits, vegetables, and kitchen essentials. Handpicked and delivered fresh."
      />
      {loading ? (
        <ShopSkeleton />
      ) : (
        <div className="flex flex-col w-full overflow-hidden">
          <ShopHeroBanner />
          <PromoBanner />

          <section className="section-pad !pb-[7vw] texture-paper">
            <div className="wrap">
              <div data-reveal="true" style={{ maxWidth: '560px', marginBottom: '40px' }}>
                <span className="eyebrow">This Week's Picks</span>
                <h2 className="h-lg">Curated in small batches.</h2>
                <p className="lede">
                  Fruits and vegetables for an elevated palate, hand-picked by our sourcing team, not an algorithm.
                </p>
              </div>

              {subCategories?.map((section: any, index: number) => {
                if (!section.data || section.type !== 'products-recommendation') return null;
                return <ShopProductCategory key={index} title={section.title} data={section.data} />;
              })}
            </div>
          </section>

          <ExploreCategories
            categories={mainCategoryData}
            blendsCategory={blendsCategoryData}
            className="!pt-4 md:!pt-8"
          />

          <WhyChooseOrigin />
        </div>
      )}
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
