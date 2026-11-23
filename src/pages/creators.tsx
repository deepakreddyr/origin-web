import React from 'react';
import { GetServerSideProps } from 'next';
import { MotionConfig } from 'framer-motion';
import Layout from '@/components/Layout';
import CustomHead from '@/components/shared/CustomHead';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import CreatorsHero from '@/components/creators/CreatorsHero';
import CreatorMarquee from '@/components/creators/CreatorMarquee';
import CreatorTiers from '@/components/creators/CreatorTiers';
import CreatorBenefits from '@/components/creators/CreatorBenefits';
import CreatorHowItWorks from '@/components/creators/CreatorHowItWorks';
import CreatorGoodies from '@/components/creators/CreatorGoodies';
import CreatorApplyForm from '@/components/creators/CreatorApplyForm';

interface CreatorsPageProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

const CreatorsPage = ({ mainMenuItems, footerData }: CreatorsPageProps) => (
  <Layout isHeaderSticky={true} hideOnScroll mainMenuItems={mainMenuItems} footerData={footerData}>
    <CustomHead
      title="Creators | Origin Fresh"
      description="Join the Origin creator ecosystem. Barter collaborations, affiliate earnings and weekly goodies for nano, micro and macro creators."
    />
    <MotionConfig reducedMotion="user">
      <main className="bg-[#FAF7F0] min-h-screen pt-[128px] md:pt-[100px]">
        <CreatorsHero />
        <CreatorMarquee />
        <CreatorTiers />
        <CreatorBenefits />
        <CreatorHowItWorks />
        <CreatorGoodies />
        <CreatorApplyForm />
      </main>
    </MotionConfig>
  </Layout>
);

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
    const { mainMenuItems, footerData } = await response.json();
    return { props: { mainMenuItems: mainMenuItems || [], footerData: footerData || {} } };
  } catch (error) {
    console.error('Error fetching layout data for creators page:', error);
    return { props: { mainMenuItems: [], footerData: {} } };
  }
};

export default CreatorsPage;
