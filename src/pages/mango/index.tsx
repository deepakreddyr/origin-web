import React from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Layout from '@/components/Layout';
import CustomHead from '@/components/shared/CustomHead';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import MangoHeader from '@/components/Mango/MangoHeader';
import MangoHero from '@/components/Mango/MangoHero';

import MangoProductHighlight from '@/components/Mango/MangoProductHighlight';

import MangoUSP from '@/components/Mango/MangoUSP';
import PopularMangoes from '@/components/Mango/PopularMangoes';
import MangoPulpBanner from '@/components/Mango/MangoPulpBanner';

interface MangoLandingPageProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
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

// Placeholder recipe data (will be replaced with API data)
const mangoRecipes = [
  {
    slug: 'mango-chaat',
    name: 'Spice Up Your Evening With This Delectable Mango Chaat!',
    tag: 'By Mango',
    date: '02 March, 2019'
  },
  {
    slug: 'mango-popsicles',
    name: 'Beat The Heat With Addictive Mango Popsicles',
    tag: 'By Mango',
    date: '10 April, 2019'
  },
  {
    slug: 'mango-cucumber-salsa',
    name: 'This Mango Cucumber Salsa Is The Next Crowd Favourite',
    tag: 'By Mango',
    date: '15 May, 2019'
  }
];

const MangoLandingPage = ({ mainMenuItems, footerData }: MangoLandingPageProps) => {
  return (
    <Layout isHeader={false} mainMenuItems={mainMenuItems} footerData={footerData} isHeaderSticky={true}>
      <CustomHead
        title="Farm Fresh Mangoes | Origin Fresh"
        description="100% carbide-free mangoes, sourced straight from the farmers. Explore our seasonal mango collection."
      />

      <MangoHeader />

      <div
        className="min-h-screen"
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

          <MangoProductHighlight />
        </div>

        {/* ── USP Section (4-icon strip) ── */}
        <MangoUSP />
      </div>
      <div
        className="min-h-screen"
        style={{
          background:
            'linear-gradient(180deg, #FFFFFF 0.48%, #FFD74F 20.19%, #FEDD6D 38.94%, #FFD854 55.29%, #FBCA38 63.22%, #FDD45C 71.27%, #FFEFC4 86.54%, #FFFFFF 100%)'
        }}
      >
        {/* ── Popular Mangoes (Must-try) ── */}
        <PopularMangoes />

        {/* ── Mango Pulp Banner ── */}
        <MangoPulpBanner />

        {/* ── Mangolicious Recipes ── */}
        <section className="py-12 px-6 md:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">Mangolicious Recipes</h2>
              <p className="text-[#666] mt-2">Mango-based dishes that will revolutionise your love for mangoes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mangoRecipes.map((recipe) => (
                <Link
                  key={recipe.slug}
                  href={`/mango/recipes/${recipe.slug}`}
                  className="group block rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video flex items-center justify-center text-6xl group-hover:scale-105 transition-transform overflow-hidden">
                    🥭
                  </div>
                  <div className="p-4">
                    <div className="flex gap-3 text-xs text-[#888] mb-2">
                      <span>{recipe.tag}</span>
                      <span>·</span>
                      <span>{recipe.date}</span>
                    </div>
                    <h3 className="font-semibold text-[#1a1a1a] leading-snug group-hover:underline">{recipe.name}</h3>
                  </div>
                </Link>
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
    const { mainMenuItems, footerData } = originApiData;
    return { props: { mainMenuItems: mainMenuItems || [], footerData: footerData || {} } };
  } catch (error) {
    console.error('Error fetching mango landing page data:', error);
    return { props: { mainMenuItems: [], footerData: {} } };
  }
};

export default MangoLandingPage;
