import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import CustomHead from '@/components/shared/CustomHead';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import MangoHeader from '@/components/Mango/MangoHeader';

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
  }
> = {
  'mango-chaat': {
    title: 'Spice up your evening with this delectable Mango Chaat!',
    tag: 'By Memo',
    date: '02 March, 2026',
    time: '10 MINS',
    difficulty: 'EASY',
    description:
      'A quintessential summer snack that balances the sweetness of ripe mangoes with the sharp punch of Indian spices. Perfect for sun-drenched terrace evenings.',
    ingredients: [
      '1 cup firm mango cubes',
      '1/4 teaspoon red chilli powder',
      '1/4 teaspoon roasted cumin powder',
      'Salt to taste',
      'A squeeze of lime',
      'Fresh coriander (optional)'
    ],
    method: [
      'Toss firm mango cubes with chilli powder, roasted cumin powder, and salt in a large ceramic mixing bowl.',
      'Add fresh lime juice and mix gently to ensure the spices coat each cube without mashing the fruit.',
      'Garnish with a handful of fresh coriander and serve immediately while the mangoes are chilled.'
    ],
    imgSrc: '/assets/images/recipes/mango-chaat.jpg'
  },
  'mango-popsicles': {
    title: 'Beat The Heat With Addictive Mango Popsicles',
    tag: 'By Memo',
    date: '02 March, 2026',
    time: '4 HOURS',
    difficulty: 'MODERATE',
    description:
      'Cool down this summer with creamy, naturally-sweet mango popsicles. Made with just three ingredients, they are the perfect guilt-free treat.',
    ingredients: [
      '2 cups ripe Alphonso mango pulp',
      '2 tablespoons honey or jaggery',
      '1/2 cup coconut milk',
      'A pinch of cardamom (optional)'
    ],
    method: [
      'Blend mango pulp, honey, and coconut milk until silky smooth.',
      'Pour mixture into popsicle moulds and insert sticks.',
      'Freeze for at least 6 hours or overnight. Run warm water over mould to release.'
    ],
    imgSrc: '/assets/images/recipes/mango-popsicles.jpg'
  },
  'mango-cucumber-salsa': {
    title: 'This Mango Cucumber Salsa Is The Next Crowd Favourite',
    tag: 'By Memo',
    date: '02 March, 2026',
    time: '15 MINS',
    difficulty: 'EASY',
    description:
      'A vibrant, refreshing salsa that pairs the tropical sweetness of ripe mangoes with cool cucumber and a hint of jalapeño heat.',
    ingredients: [
      '1 ripe mango, diced',
      '1 cucumber, diced',
      '1 small red onion, finely chopped',
      '1 jalapeño, seeded and minced',
      'Juice of 1 lime',
      'Fresh coriander, chopped',
      'Salt to taste'
    ],
    method: [
      'Combine diced mango, cucumber, red onion, and jalapeño in a bowl.',
      'Squeeze fresh lime juice over the mixture and toss to coat.',
      'Add fresh coriander and a pinch of salt. Serve chilled with nachos or grilled fish.'
    ],
    imgSrc: '/assets/images/recipes/mango-salsa.jpg'
  }
};

const MangoRecipeDetailPage = ({ slug, mainMenuItems, footerData }: MangoRecipeDetailPageProps) => {
  const recipe = recipeMap[slug];
  if (!recipe) return null;

  const otherRecipes = Object.entries(recipeMap)
    .filter(([s]) => s !== slug)
    .map(([s, r]) => ({ slug: s, ...r }));

  return (
    <Layout isHeader={false} mainMenuItems={mainMenuItems} footerData={footerData} isHeaderSticky={true}>
      <CustomHead title={`${recipe.title} | Origin Fresh`} description={recipe.description} />
      <MangoHeader />

      <main className="min-h-screen bg-white pt-10 md:pt-20 pb-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-[7.5vw]">
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
            {/* Main Content */}
            <div className="lg:w-[65%]">
              {/* Feature Image with Tags */}
              <div className="relative rounded-[32px] overflow-hidden aspect-[16/9] md:aspect-[21/10] mb-8 md:mb-12 shadow-2xl">
                <Image src={recipe.imgSrc} alt={recipe.title} fill className="object-cover" priority />
                <div className="absolute top-6 left-6 flex gap-3">
                  <div className="flex items-center gap-2 bg-[#FFF9E5] text-[#1a1a1a] px-4 py-2 rounded-full text-[10px] md:text-[12px] font-bold tracking-widest border border-[#F2BB00]/20">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {recipe.time}
                  </div>
                  <div className="flex items-center gap-2 bg-[#E1F2E0] text-[#146321] px-4 py-2 rounded-full text-[10px] md:text-[12px] font-bold tracking-widest border border-[#146321]/20">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {recipe.difficulty}
                  </div>
                </div>
              </div>

              {/* Title Section */}
              <h1
                className="text-4xl md:text-[56px] leading-[1.1] font-bold text-[#1a1a1a] mb-6 md:mb-8"
                style={{ fontFamily: 'fraunces, serif' }}
              >
                {recipe.title.split('Mango').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && <span className="text-[#927F40]">Mango</span>}
                  </React.Fragment>
                ))}
              </h1>

              <p
                className="text-[16px] md:text-[18px] text-[#1a1a1a] opacity-60 leading-relaxed mb-10 md:mb-14 max-w-2xl"
                style={{ fontFamily: 'SofiaPro' }}
              >
                {recipe.description}
              </p>

              {/* Method Box */}
              <div className="bg-[#F7F7EE] rounded-[40px] p-8 md:p-14 relative overflow-hidden">
                <div className="flex items-center gap-6 mb-10">
                  <h2
                    className="text-3xl md:text-[40px] font-bold text-[#1a1a1a]"
                    style={{ fontFamily: 'fraunces, serif' }}
                  >
                    Method
                  </h2>
                  <div className="h-[1px] flex-1 bg-[#1a1a1a]/10" />
                </div>

                <div className="space-y-8 relative z-10 font-bold">
                  {recipe.method.map((step, i) => (
                    <div key={i} className="flex gap-6 md:gap-8">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F2BB00] text-[#1a1a1a] flex items-center justify-center text-[14px] font-bold mt-1">
                        {i + 1}
                      </div>
                      <p
                        className="text-[16px] md:text-[18px] text-[#1a1a1a] opacity-80 leading-relaxed"
                        style={{ fontFamily: 'SofiaPro' }}
                      >
                        {step}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Decorative Icon */}
                <div className="absolute bottom-0 right-0 opacity-[0.03] scale-150 pointer-events-none translate-x-10 translate-y-10">
                  <Image src="/assets/images/recipes/recipe-decor.svg" alt="" width={400} height={400} />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-[35%] flex flex-col gap-14">
              {/* Ingredients Box */}
              <div className="bg-[#F7F7EE] rounded-[40px] p-10 md:p-12">
                <h3
                  className="text-3xl md:text-[36px] font-bold text-[#1a1a1a] mb-8"
                  style={{ fontFamily: 'fraunces, serif' }}
                >
                  Ingredients
                </h3>
                <ul className="space-y-6">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-5">
                      <div className="w-[10px] h-[10px] rounded-full border-[2.5px] border-[#1a1a1a]/30" />
                      <span
                        className="text-[16px] md:text-[18px] text-[#1a1a1a] opacity-80"
                        style={{ fontFamily: 'SofiaPro' }}
                      >
                        {ing}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fresh Picks Section */}
              <div className="flex flex-col gap-8">
                <h3
                  className="text-2xl md:text-[28px] font-bold text-[#1a1a1a]"
                  style={{ fontFamily: 'fraunces, serif' }}
                >
                  Fresh Picks For You
                </h3>
                <div className="flex flex-col gap-6">
                  {otherRecipes.map((other) => (
                    <Link key={other.slug} href={`/mango/recipes/${other.slug}`} className="group block">
                      <div className="flex flex-col bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#eee]/50 relative">
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <Image
                            src={other.imgSrc}
                            alt={other.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-6 bg-[#F7F7EE]">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[#F2BB00] text-[12px] font-bold">👤 {other.tag}</span>
                            <span className="text-[#1a1a1a]/20">|</span>
                            <span className="text-[#1a1a1a]/40 text-[12px] font-medium">📅 {other.date}</span>
                          </div>
                          <h4
                            className="text-[17px] md:text-[19px] font-bold text-[#1a1a1a] leading-tight line-clamp-2 group-hover:text-[#927F40] transition-colors"
                            style={{ fontFamily: 'SofiaPro' }}
                          >
                            {other.title}
                          </h4>
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
