import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import { Categories, FooterDataType, MainMenuType, Products } from '@/utilities/types';
import React, { useEffect } from 'react';
import OrderDetailsWrapper from '@/components/OrderDetails/OrderDetailsWrapper';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
interface layoutProp {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}
const OrderDetailsPage = (props: layoutProp) => {
  const { mainMenuItems, footerData } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const { query, isReady } = router;

  useEffect(() => {
    if (isReady) {
      if (query.type && query.authToken) {
        const authToken = Array.isArray(query.authToken) ? query.authToken[0] : query.authToken;
        localStorage.setItem('user_token', authToken);

        // Construct a new URL with only the `type` parameter (renamed to `appType`)
        const appType = query.type; // Extract `type` from query
        const newQueryString = appType ? `?type=${appType}` : '';
        const newUrl = `${window.location.pathname}${newQueryString}`;

        // Update the URL
        window.history.replaceState(null, '', newUrl);

        // Reload the page
        window.location.reload();
      }
    }
  }, [isReady]);

  return (
    <Layout isHeaderSticky={true} mainMenuItems={mainMenuItems} footerData={footerData}>
      <div className="mob:pt-[12vw]">
        <OrderDetailsWrapper />
      </div>
    </Layout>
  );
};

export default OrderDetailsPage;

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
