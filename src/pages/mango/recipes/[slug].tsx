import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import CustomHead from '@/components/shared/CustomHead';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import MangoHeader from '@/components/Mango/MangoHeader';
import { Calendar } from 'lucide-react';
import { trackEvent } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';
import { useEffect } from 'react';

interface MangoRecipeDetailPageProps {
  slug: string;
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

const recipeMap: Record<
  string,
  {
    title: string;
    tag: string;
    date: string;
    time: string;
    difficulty: string;
    description: string;
    ingredients: string[];
    method: string[];
    imgSrc: string;
    mobileTitle?: string;
  }
> = {
  'mango-chaat': {
    title: 'Spice up your evening with this delectable Mango Chaat!',
    mobileTitle: 'Zesty Mango Chaat',
    tag: 'By Naveen Prasath',
    date: '02 March, 2026',
    time: '10 MINS',
    difficulty: 'EASY',
    description:
      'A quintessential summer snack that balances the sweetness of ripe mangoes with the sharp punch of Indian spices. Perfect for sun-drenched terrace evenings.',
    ingredients: [
      '1 cup firm mango cubes',
      '¼ tsp red chilli powder',
      '¼ tsp roasted cumin powder',
      'Salt to taste',
      'A squeeze of lime',
      'Fresh coriander (optional)'
    ],
    method: [
      'Toss mango cubes with chilli powder, cumin, and salt.',
      'Add lime juice and mix gently.',
      'Garnish with coriander and serve immediately.'
    ],
    imgSrc: '/assets/images/recipes/mango-chaat.jpg'
  },
  'mango-popsicles': {
    title: 'Beat the heat with addictive Mango Popsicles',
    mobileTitle: 'Mango Popsicles',
    tag: 'By Prakash',
    date: '02 March, 2026',
    time: '8 HOURS',
    difficulty: 'EASY',
    description:
      'Cool down this summer with creamy, naturally-sweet mango popsicles. Made with just three ingredients, they are the perfect guilt-free treat.',
    ingredients: [
      '1 cup mango pulp',
      '2 tbsp yogurt or coconut milk',
      'Honey (optional)',
      'Pinch of cardamom or a teaspoon of vanilla extract'
    ],
    method: ['Blend everything.', 'Pour into molds.', 'Freeze 6–8 hours.'],
    imgSrc: '/assets/images/recipes/mango-popsicles.jpg'
  },
  'mango-cucumber-salsa': {
    title: 'This Mango cucumber salsa is your next crowd favourite',
    mobileTitle: 'Cucumber Salsa',
    tag: 'By Deepak',
    date: '02 March, 2026',
    time: '15 MINS',
    difficulty: 'EASY',
    description:
      'A vibrant, refreshing salsa that pairs the tropical sweetness of ripe mangoes with cool cucumber and a hint of crunch.',
    ingredients: [
      '1 cup mango cubes',
      '1 cup cucumber slices',
      '1 tbsp roasted peanuts',
      '1 tbsp chopped mint',
      '--- For dressing ---',
      '1 tsp lime juice',
      '1 tsp honey',
      'Pinch chilli flakes',
      'Salt to taste'
    ],
    method: [
      'Combine mango, cucumber, peanuts, and mint.',
      'Whisk dressing ingredients together.',
      'Toss gently before serving.'
    ],
    imgSrc: '/assets/images/recipes/mango-salsa.jpg'
  }
};

const MangoRecipeDetailPage = ({ slug, mainMenuItems, footerData }: MangoRecipeDetailPageProps) => {
  const recipe = recipeMap[slug];

  useEffect(() => {
    if (recipe) {
      trackEvent(AnalyticsEvents.MANGO_RECIPE_VIEW, {
        recipe_name: recipe.title,
        recipe_slug: slug
      });
    }
  }, [slug, recipe?.title]);

  if (!recipe) return null;

  const otherRecipes = Object.entries(recipeMap)
    .filter(([s]) => s !== slug)
    .map(([s, r]) => ({ slug: s, ...r }));

  return (
    <Layout isHeader={false} mainMenuItems={mainMenuItems} footerData={footerData} isHeaderSticky={true}>
      <CustomHead title={`${recipe.title} | Origin Fresh`} description={recipe.description} />
      <MangoHeader disableSkipLogin={true} />
      <main className="min-h-screen bg-white pb-[50px]">
        {/* Mobile Header Overlap Fix - Only for mobile */}
        <div className="md:hidden h-[60px] bg-[#FFECA6]" />

        {/* Desktop Header Space */}
        <div className="hidden md:block h-[150px]" />

        <div className="max-w-[1440px] mx-auto px-6 md:px-[7.5vw]">
          {/* Top Section: Hero Image & Ingredients side-by-side */}
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-stretch md:mb-5">
            {/* Feature Image Container */}
            <div className="lg:w-[65%] w-screen md:w-full relative aspect-[4/5] md:aspect-auto md:min-h-full md:rounded-[32px] rounded-none overflow-hidden -ml-6 md:ml-0">
              <Image src={recipe.imgSrc} alt={recipe.title} fill className="object-cover" priority />

              {/* Desktop-only top badges */}
              {/* <div className="hidden md:flex absolute top-6 left-6 gap-3">
                <div className="flex items-center gap-2 bg-[#FFF9E5] text-[#1a1a1a] px-4 py-2 rounded-full text-[12px] font-semibold tracking-widest border border-[#F2BB00]/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {recipe.time}
                </div>
                <div className="flex items-center gap-2 bg-[#E1F2E0] text-[#146321] px-4 py-2 rounded-full text-[12px] font-semibold tracking-widest border border-[#146321]/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {recipe.difficulty}
                </div>
              </div> */}

              {/* Mobile-only overlay title and badge */}
              <div className="md:hidden absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end gap-3">
                {/* <div className="flex items-center gap-1.5 bg-[#90D68F] text-[#146321] px-3 py-1 rounded-full w-fit text-[12px] font-semibold border border-white/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {recipe.time}
                </div> */}
                <h1 className="text-white text-[42px] leading-[1.1] font-medium" style={{ fontFamily: 'Recoleta' }}>
                  {recipe.mobileTitle || recipe.title}
                </h1>
              </div>
            </div>

            {/* Desktop Ingredients Box */}
            <div className="hidden lg:flex lg:w-[35%] bg-[#EFEEE3] rounded-[40px] p-10 md:p-7 flex-col">
              <h1
                className="text-3xl md:text-[36px] font-medium text-[#1a1a1a] mb-8"
                style={{ fontFamily: 'fraunces, serif' }}
              >
                Ingredients
              </h1>
              <ul className="space-y-6 flex-grow">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-5">
                    {!ing.startsWith('---') && (
                      <div className="w-[18px] h-[18px] rounded-full border border-[#1a1a1a]/40 flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-[6px] h-[6px] rounded-full bg-[#1a1a1a]/60" />
                      </div>
                    )}
                    <span
                      className={`text-[16px] md:text-[18px] text-[#1a1a1a] ${
                        ing.startsWith('---') ? 'font-bold mt-4 opacity-100' : 'opacity-80'
                      }`}
                      style={{ fontFamily: 'SofiaPro' }}
                    >
                      {ing.startsWith('---') ? ing.replace(/---/g, '').trim() : ing}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lower Content Section */}
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
            {/* Left Column Content */}
            <div className="lg:w-[65%]">
              {/* Desktop Metadata & Title Section */}
              <div className="hidden md:block">
                <span
                  className="text-[58px] leading-[1.45] font-medium text-[#000000] block mb-8"
                  style={{ fontFamily: 'Recoleta' }}
                >
                  {recipe.title.split('Mango').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && <span className="text-[#927F40]">Mango</span>}
                    </React.Fragment>
                  ))}
                </span>

                <p
                  className="text-[18px] text-[#4D4635] opacity-70 leading-relaxed mb-14 max-w-3xl"
                  style={{ fontFamily: 'SofiaPro' }}
                >
                  {recipe.description}
                </p>
              </div>

              {/* Mobile Centered Description */}
              <div className="md:hidden text-center py-10">
                <p className="text-[18px] text-[#000000] opacity-70 leading-relaxed" style={{ fontFamily: 'SofiaPro' }}>
                  {recipe.description}
                </p>
              </div>

              {/* Mobile-only Ingredients Section */}
              <div className="lg:hidden bg-[#EFEEE3] -mx-6 px-6 py-12 mb-5">
                <h2 className="text-[32px] font-medium text-[#000000] mb-8" style={{ fontFamily: 'SofiaPro' }}>
                  Ingredients
                </h2>
                <ul className="space-y-6">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-4">
                      {!ing.startsWith('---') && (
                        <div className="w-[18px] h-[18px] rounded-full border border-[#1a1a1a]/40 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="w-[6px] h-[6px] rounded-full bg-[#1a1a1a]/60" />
                        </div>
                      )}
                      <span
                        className={`text-[18px] text-[#000000] ${
                          ing.startsWith('---') ? 'font-bold mt-4 opacity-100' : 'font-medium opacity-80'
                        }`}
                        style={{ fontFamily: 'SofiaPro' }}
                      >
                        {ing.startsWith('---') ? ing.replace(/---/g, '').trim() : ing}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Combined Method Section Style */}
              <div className="bg-[#EFEEE3] -mx-6 px-6 py-12 md:mx-0 md:px-14 md:rounded-[40px] relative">
                <h2
                  className="text-[32px] md:text-[40px] font-medium text-[#927F40] md:text-[#1a1a1a] pb-5 md:pb-10"
                  style={{ fontFamily: 'Recoleta' }}
                >
                  Method
                </h2>
                <div className="space-y-10 relative z-10">
                  {recipe.method.map((step, i) => (
                    <div key={i} className="flex gap-6 items-center">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FFE381] text-[#1a1a1a] flex items-center justify-center text-[18px] font-semibold">
                        {i + 1}
                      </div>
                      <p
                        className="text-[18px] md:text-[17px] text-[#000000] opacity-80 leading-[1.6]"
                        style={{ fontFamily: 'SofiaPro' }}
                      >
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar (Fresh Picks) */}
            <div className="lg:w-[35%] flex flex-col p md:pt-0">
              <div className="flex flex-col gap-8">
                <h1 className="text-[28px] font-medium text-[#000000]" style={{ fontFamily: 'Recoleta' }}>
                  Fresh Picks For You
                </h1>
                <div className="flex flex-col gap-8">
                  {otherRecipes.map((other) => (
                    <Link key={other.slug} href={`/mango/recipes/${other.slug}`} className="group block">
                      <div className="flex flex-col bg-white rounded-[24px] overflow-hidden transition-all duration-500">
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <Image
                            src={other.imgSrc}
                            alt={other.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-6 bg-[#EFEEE3]">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <Image src="/assets/images/recipes/recipesavatar.svg" alt="" width={18} height={18} />
                              <span
                                className="text-[17px] font-regular text-[#F2BB00]"
                                style={{ fontFamily: 'SofiaPro' }}
                              >
                                {other.tag}
                              </span>
                            </div>
                            <div className="w-[1px] h-3 bg-[#1a1a1a] opacity-20" />
                            <div className="flex items-center gap-2">
                              <Calendar size={18} stroke="#FFD74F" strokeWidth={2.5} />
                              <span
                                className="text-[17px] font-regular text-[#1a1a1a] opacity-90"
                                style={{ fontFamily: 'SofiaPro' }}
                              >
                                {other.date}
                              </span>
                            </div>
                          </div>
                          <span
                            className="text-[17px] md:text-[19px] font-semibold text-[#1a1a1a] leading-tight line-clamp-2 transition-colors"
                            style={{ fontFamily: 'SofiaPro' }}
                          >
                            {other.title}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
    const originApiData = await response.json();
    const { mainMenuItems, footerData } = originApiData;
    return { props: { slug, mainMenuItems: mainMenuItems || [], footerData: footerData || {} } };
  } catch (error) {
    console.error('Error fetching mango recipe data:', error);
    return { props: { slug, mainMenuItems: [], footerData: {} } };
  }
};

export default MangoRecipeDetailPage;
