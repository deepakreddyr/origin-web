import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import CustomHead from '@/components/shared/CustomHead';
import { GetServerSideProps } from 'next';

import AboutHeroBanner from '@/components/RevampedAbout/AboutHeroBanner';
import AboutStatement from '@/components/RevampedAbout/AboutStatement';
import AboutFarmers from '@/components/RevampedAbout/AboutFarmers';
import AboutStores from '@/components/RevampedAbout/AboutStores';
import AboutHowItWorks from '@/components/RevampedAbout/AboutHowItWorks';
import AboutValues from '@/components/RevampedAbout/AboutValues';
import AboutWhyChooseUs from '@/components/RevampedAbout/AboutWhyChooseUs';
import AboutClosingBanner from '@/components/RevampedAbout/AboutClosingBanner';

const AboutUsPage = (props: any) => {
  const { mainMenuItems, footerData } = props;

  // Add scroll-reveal effect for all components
  useEffect(() => {
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

    // Slight delay to ensure DOM is painted
    setTimeout(() => {
      document
        .querySelectorAll('[data-reveal], [data-reveal="true"], .animate-fade-in-up')
        .forEach((el) => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <Layout isHeaderSticky={true} mainMenuItems={mainMenuItems} footerData={footerData}>
      <CustomHead
        title="About Us | Origin Fresh"
        description="Learn about our commitment to bringing fresh, high-quality produce to your table. We focus on sustainability and quality."
      />

      <div className="flex flex-col w-full bg-[#fffdf8]">
        <AboutHeroBanner />
        <AboutStatement />
        <AboutFarmers />
        <AboutStores />
        <AboutHowItWorks />
        <AboutValues />
        <AboutWhyChooseUs />
        <AboutClosingBanner />
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
    console.error('Error fetching API data:', error);
    return {
      props: {
        mainMenuItems: [],
        footerData: {}
      }
    };
  }
};

export default AboutUsPage;
