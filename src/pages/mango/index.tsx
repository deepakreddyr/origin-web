import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Layout from '@/components/Layout';
import CustomHead from '@/components/shared/CustomHead';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import MangoHeader from '@/components/Mango/MangoHeader';
import MangoHero from '@/components/Mango/MangoHero';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { protectedUrl, unprotectedUrl } from '@/url';
import { getAddressAndStoreId } from '@/utilities/utils';

import MangoProductHighlight from '@/components/Mango/MangoProductHighlight';

import MangoUSP from '@/components/Mango/MangoUSP';
import PopularMangoes from '@/components/Mango/PopularMangoes';
import MangoPulpBanner from '@/components/Mango/MangoPulpBanner';
import MangoRecipeCard from '@/components/Mango/MangoRecipeCard';
import MangoTestimonialCard from '@/components/Mango/MangoTestimonialCard';

interface MangoLandingPageProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
  mangoRecipes: {
    slug: string;
    name: string;
    tag: string;
    date: string;
    imgSrc: string;
  }[];
  mangoTestimonials: {
    id: number;
    name: string;
    location: string;
    text: string;
    stars: number;
    avatar: string;
  }[];
}

// Placeholder mango products data (will be replaced with API data)
const mangoProducts = [
  {
    slug: 'alphonso',
    name: 'Alphonso',
    description: 'The king of mangoes, rich and creamy.',
    price: 280,
    weight: '1 Kg'
  },
  { slug: 'kesar', name: 'Kesar', description: 'Saffron-hued, aromatic and sweet.', price: 260, weight: '1 Kg' },
  {
    slug: 'dasheri',
    name: 'Dasheri',
    description: 'Thin-skinned, fiberless, delicately sweet.',
    price: 240,
    weight: '1 Kg'
  },
  { slug: 'langra', name: 'Langra', description: 'Tangy-sweet with a greenish skin.', price: 220, weight: '1 Kg' }
];

const MangoLandingPage = ({ mainMenuItems, footerData, mangoRecipes, mangoTestimonials }: MangoLandingPageProps) => {
  const [mangoHomepageData, setMangoHomepageData] = useState<any[]>([]);
  const getDataFromApi = useGetDataFromApi();

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const addressFromLs = getAddressAndStoreId();

    let apiUrl: string;
    let additionalHeaders: Record<string, string> = {};

    if (token && addressFromLs) {
      apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getMangoHomepage'];
      additionalHeaders = { 'store-id': addressFromLs.store_id };
    } else {
      apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['getMangoHomepage'];
    }

    const successHandler = (data: any) => {
      console.log('[MangoHomepage] API response:', data);
      const resData = data?.data ?? [];
      setMangoHomepageData(resData);

      // Extract Mango category info from the section that has a "View All" navigation
      const listingSection = resData.find((section: any) => section.navigation?.title === 'View All');
      if (listingSection?.navigation?.to) {
        const fullToPath = listingSection.navigation.to;
        localStorage.setItem('mango_listing_api_path', fullToPath);

        const parts = fullToPath.split('/');
        const categoryId = parts[parts.length - 1];
        if (categoryId) {
          localStorage.setItem('mango_parent_category_id', categoryId);
        }
      } else {
        // Fallback to second section if "View All" title is not found (per previous requirements)
        const popularSection = resData[1];
        if (popularSection?.navigation?.to) {
          const fullToPath = popularSection.navigation.to;
          localStorage.setItem('mango_listing_api_path', fullToPath);

          const parts = fullToPath.split('/');
          const categoryId = parts[parts.length - 1];
          if (categoryId) {
            localStorage.setItem('mango_parent_category_id', categoryId);
          }
        }
      }
    };

    const failureHandler = (error: any) => {
      console.error('[MangoHomepage] API error:', error);
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to deduplicate products by ID
  const deduplicate = (items: any[]) => {
    const seen = new Set();
    return items.filter((item) => {
      if (!item || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  // 1st featured-items section → first 2 items for MangoProductHighlight
  const highlightSection = mangoHomepageData[0];
  const highlightItems = (highlightSection?.data ?? [])
    .map((entry: any) => entry.item)
    .filter((item: any) => item && item.multiple_uoms && item.multiple_uoms.length > 0);
  const highlightProducts = deduplicate(highlightItems).slice(0, 2);

  // 2nd featured-items section → all items for PopularMangoes
  const popularSection = mangoHomepageData[1];
  const popularItems = (popularSection?.data ?? [])
    .map((entry: any) => entry.item)
    .filter((item: any) => item && item.multiple_uoms && item.multiple_uoms.length > 0);
  const popularProducts = deduplicate(popularItems);

  return (
    <Layout isHeader={false} mainMenuItems={mainMenuItems} footerData={footerData} isHeaderSticky={true}>
      <CustomHead
        title="Farm Fresh Mangoes | Origin Fresh"
        description="100% carbide-free mangoes, sourced straight from the farmers. Explore our seasonal mango collection."
      />

      <MangoHeader />

      <div
        className=""
        style={{
          background: 'linear-gradient(180deg, #FFD74F 12.84%, #FEDD6D 43.51%, #FFE796 67.31%, #FFFFFF 100%)'
        }}
      >
        {/* ── Hero + Products wrapper so image spans both ── */}
        <div className="relative overflow-visible">
          {/* Big mango hand — spans hero AND product section */}
          <div className="absolute right-0 top-[8vw] w-[52vw] h-[1300px] pointer-events-none z-[10] hidden md:block">
            <Image
              src="/assets/images/mangohero.png"
              alt="Farm Fresh Mangoes"
              fill
              className="object-contain object-right-top"
              priority
            />
          </div>

          <MangoHero />

          <MangoProductHighlight products={highlightProducts} />
        </div>

        {/* ── USP Section (4-icon strip) ── */}
        <MangoUSP />
      </div>

      <div
        className=""
        style={{
          background:
            'linear-gradient(180deg, #FFFFFF 0.48%, #FFD74F 20.19%, #FEDD6D 38.94%, #FFD854 55.29%, #FBCA38 63.22%, #FDD45C 71.27%, #FFEFC4 86.54%, #FFFFFF 100%)'
        }}
      >
        {/* ── Popular Mangoes (Must-try) ── */}
        <PopularMangoes products={popularProducts} />

        {/* ── Mango Pulp Banner ── */}
        <MangoPulpBanner />

        {/* ── Mangolicious Recipes ── */}
        <section className="relative py-10 md:py-14 px-6 md:px-[7vw] overflow-hidden">
          <div className="max-w-[1440px] mx-auto relative z-20">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-3xl md:text-[47px] font-bold text-[#1a1a1a] mb-6" style={{ fontFamily: 'Recoleta' }}>
                Mangolicious Recipes
              </h2>
              <p
                className="text-base md:text-[23px] text-[#000000] opacity-50 font-semibold"
                style={{ fontFamily: 'SofiaPro' }}
              >
                Mango-based dishes that will revolutionise your love for mangoes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
              {/* Large Card - 1st Recipe */}
              <div className="md:col-span-7">
                {mangoRecipes && mangoRecipes[0] && <MangoRecipeCard {...mangoRecipes[0]} isLarge={true} />}
              </div>

              {/* Smaller Cards - 2nd & 3rd Recipes */}
              <div className="md:col-span-5 flex flex-col gap-5 md:gap-6">
                {mangoRecipes && mangoRecipes[1] && <MangoRecipeCard {...mangoRecipes[1]} />}
                {mangoRecipes && mangoRecipes[2] && <MangoRecipeCard {...mangoRecipes[2]} />}
              </div>
            </div>
          </div>
        </section>

        {/* ── Mango Talk (Testimonials) ── */}
        <section className="relative py-16 md:py-24 px-6 md:px-16 overflow-hidden">
          <div className="max-w-[1440px] mx-auto relative z-20">
            <div className="text-center mb-12 md:mb-16">
              <h2
                className="text-4xl md:text-[47px] font-semibold text-[#1a1a1a] mb-6"
                style={{ fontFamily: 'Recoleta' }}
              >
                Mango Talk
              </h2>
              <p
                className="text-lg md:text-[23px] text-[#000000] opacity-50 font-semibold"
                style={{ fontFamily: 'SofiaPro' }}
              >
                Our customers share what they love about our mangoes.
              </p>
            </div>

            <style jsx>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar md:grid md:grid-cols-3 md:pb-0 md:overflow-visible">
              {mangoTestimonials &&
                mangoTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="snap-center">
                    <MangoTestimonialCard {...testimonial} />
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
    const originApiData = await response.json();
    const { mainMenuItems, footerData, mangoRecipes, mangoTestimonials } = originApiData;

    return {
      props: {
        mainMenuItems: mainMenuItems || [],
        footerData: footerData || {},
        mangoRecipes: mangoRecipes || [],
        mangoTestimonials: mangoTestimonials || []
      }
    };
  } catch (error) {
    console.error('Error fetching mango landing page data:', error);
    return { props: { mainMenuItems: [], footerData: {}, mangoRecipes: [] } };
  }
};

export default MangoLandingPage;
