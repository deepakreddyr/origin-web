import TermsAndConditions from '@/components/TermsAndConditions/TermsAndConditions';
import React from 'react';
import Head from 'next/head';
import CustomHead from '@/components/shared/CustomHead';

const TermsAndConditionsPage = () => {
  return (
    <>
      <CustomHead
        title="Terms and Conditions | Origin Fresh"
        description="Read the Terms and Conditions of Origin Fresh to understand your rights and our policies."
        canonical="https://originfresh.in/terms-and-conditions"
      />
      <Head>
        <script type="application/ld+json">
          {`{
                "@context": "https://schema.org/",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://originfresh.in/"
              },{
                "@type": "ListItem",
                "position": 2,
                "name": "About us",
                "item": "https://originfresh.in/about-us"
              }]
              }`}
        </script>
      </Head>
      <TermsAndConditions />{' '}
    </>
  );
};

export default TermsAndConditionsPage;

// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { useAtom } from 'jotai';
// import { addressAtom } from '@/features/Address/context/atoms';
// import Layout from '@/components/Layout';
// import { GetServerSideProps } from 'next';
// import { FooterDataType, MainMenuType } from '@/utilities/types';
// import CustomHead from '@/components/shared/CustomHead';
// import SubscriptionHero from '@/components/subscription/SubscriptionHero';
// import SubscriptionSplit from '@/components/subscription/SubscriptionSplit';
// import SubscriptionChallenge from '@/components/subscription/SubscriptionChallenge';
// import SubscriptionHowItWorks from '@/components/subscription/SubscriptionHowItWorks';
// import SubscriptionTestimonials from '@/components/subscription/SubscriptionTestimonials';
// import SubscriptionCta from '@/components/subscription/SubscriptionCta';
// import SubscriptionHeader from '@/components/subscription/SubscriptionHeader';
// import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
// import { protectedUrl, unprotectedUrl } from '@/url';

// interface SubscriptionPageProps {
//   mainMenuItems: MainMenuType[];
//   footerData: FooterDataType;
// }

// const SubscriptionPage = ({ mainMenuItems, footerData }: SubscriptionPageProps) => {
//   const [subscriptionItem, setSubscriptionItem] = useState<any>(null);
//   const [comboItems, setComboItems] = useState<any[]>([]);
//   const [maxQty, setMaxQty] = useState<number>(10);
//   const getDataFromApi = useGetDataFromApi();
//   const loginDetails = useSelector((state: any) => state.loginDetails);
//   const [address] = useAtom(addressAtom);

//   useEffect(() => {
//     const userToken = localStorage.getItem('user_token');
//     const isLoggedIn = !!userToken;

//     const url = isLoggedIn ? protectedUrl.getSubscriptionItems : unprotectedUrl.getSubscriptionItems;

//     getDataFromApi(
//       url,
//       (data: any) => {
//         setSubscriptionItem(data?.data?.item || null);
//         setComboItems(data?.data?.combo_items || []);
//         setMaxQty(data?.max_qty || 10);
//       },
//       (error: any) => {
//         console.error('Failed to fetch subscription items:', error);
//       },
//       {}
//     );
//   }, [loginDetails.isLogin, address.defaultAddress?.store_id]);

//   return (
//     <Layout isHeader={false} isHeaderSticky={true} mainMenuItems={mainMenuItems} footerData={footerData}>
//       <CustomHead
//         title="Subscription Challenge | Origin Fresh"
//         description="Join the fruit revolution. 7 days, 7 fruits, zero junk. Accept the challenge today!"
//       />

//       <main className="bg-[#FAF7F0] min-h-screen pt-[64px] md:pt-[100px]">
//         <SubscriptionHeader item={subscriptionItem} maxQty={maxQty} />
//         <SubscriptionHero />
//         <SubscriptionSplit />
//         <SubscriptionChallenge item={subscriptionItem} comboItems={comboItems} maxQty={maxQty} />
//         <SubscriptionHowItWorks />
//         <SubscriptionTestimonials />
//         <SubscriptionCta item={subscriptionItem} maxQty={maxQty} />
//       </main>
//     </Layout>
//   );
// };

// export const getServerSideProps: GetServerSideProps = async () => {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
//     const originApiData = await response.json();
//     const { mainMenuItems, footerData } = originApiData;

//     return {
//       props: {
//         mainMenuItems: mainMenuItems || [],
//         footerData: footerData || {}
//       }
//     };
//   } catch (error) {
//     console.error('Error fetching layout data for subscription page:', error);
//     return {
//       props: {
//         mainMenuItems: [],
//         footerData: {}
//       }
//     };
//   }
// };

// export default SubscriptionPage;
