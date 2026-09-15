import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import CustomHead from '@/components/shared/CustomHead';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import { useEffect } from 'react';
import EventsHeader from '@/components/RevampedEvents/EventsHeader';
import FeaturedEvent from '@/components/RevampedEvents/FeaturedEvent';
import UpcomingEvents from '@/components/RevampedEvents/UpcomingEvents';
interface EventsProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

const EventsPage = ({ mainMenuItems, footerData }: EventsProps) => {
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

    document.querySelectorAll('[data-reveal], [data-reveal="true"]').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <Layout isHeaderSticky={true} mainMenuItems={mainMenuItems} footerData={footerData}>
      <div className="overflow-x-clip max-w-[100vw] relative bg-[#fffdf8]">
        <CustomHead
          title="Events | Origin Fresh"
          description="See Origin Fresh in person. Pop-ups, tastings, and markets around Chennai."
        />

        <EventsHeader />
        <FeaturedEvent />
        <UpcomingEvents />
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
    console.error('Error fetching events page data:', error);
    return {
      props: {
        mainMenuItems: [],
        footerData: {}
      }
    };
  }
};

export default EventsPage;
