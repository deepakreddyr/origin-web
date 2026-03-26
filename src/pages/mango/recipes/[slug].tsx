import React from 'react';
import Link from 'next/link';
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

// Placeholder recipe map – will be replaced with API call using slug
const recipeMap: Record<
  string,
  {
    title: string;
    tag: string;
    date: string;
    description: string;
    ingredients: string[];
    method: string[];
  }
> = {
  'mango-chaat': {
    title: 'Spice Up Your Evening With This Delectable Mango Chaat!',
    tag: 'By Mango',
    date: '02 March, 2019',
    description:
      'A quintessential summer snack that balances the sweetness of raw mangoes with the sharp punch of Indian spices. Perfect for sun-drenched terrace evenings.',
    ingredients: [
      '1 cup firm mango cubes',
      '1/4 teaspoon red chili powder',
      '1/4 teaspoon roasted cumin powder',
      'Salt to taste',
      'A squeeze of lime',
      'Fresh coriander (optional)'
    ],
    method: [
      'Toss firm mango cubes with chili powder, roasted cumin powder, and salt in a large ceramic mixing bowl.',
      'Add fresh lime juice and mix gently to ensure the spices coat each cube without mashing the fruit.',
      'Garnish with a handful of fresh coriander and serve immediately while the mangoes are chilled.'
    ]
  },
  'mango-popsicles': {
    title: 'Beat The Heat With Addictive Mango Popsicles',
    tag: 'By Mango',
    date: '10 April, 2019',
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
    ]
  },
  'mango-cucumber-salsa': {
    title: 'This Mango Cucumber Salsa Is The Next Crowd Favourite',
    tag: 'By Mango',
    date: '15 May, 2019',
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
    ]
  }
};

// Sidebar recommended recipes (excluding current)
const allRecipes = Object.entries(recipeMap).map(([slug, data]) => ({ slug, title: data.title, date: data.date }));

const MangoRecipeDetailPage = ({ slug, mainMenuItems, footerData }: MangoRecipeDetailPageProps) => {
  const recipe = recipeMap[slug] || {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    tag: 'By Mango',
    date: '',
    description: 'A delicious mango-based recipe.',
    ingredients: [],
    method: []
  };

  const otherRecipes = allRecipes.filter((r) => r.slug !== slug);

  return (
    <Layout isHeader={false} mainMenuItems={mainMenuItems} footerData={footerData} isHeaderSticky={true}>
      <CustomHead title={`${recipe.title} | Mango Recipes | Origin Fresh`} description={recipe.description} />

      <MangoHeader />

      <main className="min-h-screen bg-[#FAFAF8] pt-[80px]">
        {/* ── Breadcrumb ── */}
        <nav className="px-6 md:px-16 py-4 bg-white border-b border-[#eee]">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm flex-wrap text-[#888]">
            <Link href="/mango" className="hover:text-[#333] transition-colors">
              Mango
            </Link>
            <span>/</span>
            <span className="text-[#1a1a1a] font-medium line-clamp-1">{recipe.title}</span>
          </div>
        </nav>

        {/* ── Recipe Detail + Sidebar ── */}
        <section className="px-6 md:px-16 py-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="md:col-span-2">
              {/* Tags */}
              <div className="flex gap-3 mb-4">
                <span className="bg-[#F5C518] text-[#7a5900] text-xs font-semibold py-1 px-3 rounded-full">Mango</span>
                <span className="bg-[#1a1a1a] text-white text-xs font-semibold py-1 px-3 rounded-full">Fresh</span>
              </div>

              {/* Hero Image */}
              <div className="bg-[#F5C518] rounded-3xl aspect-video flex items-center justify-center text-[100px] mb-8">
                🥭
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 leading-tight">
                {recipe.title.split('Mango').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && <span className="text-[#F5C518]">Mango</span>}
                  </React.Fragment>
                ))}
              </h1>
              <div className="flex gap-3 text-xs text-[#888] mb-6">
                <span>{recipe.tag}</span>
                <span>·</span>
                <span>{recipe.date}</span>
              </div>
              <p className="text-[#444] text-base leading-relaxed mb-8">{recipe.description}</p>

              {/* Ingredients */}
              {recipe.ingredients.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">Ingredients</h2>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#444] text-sm">
                        <span className="text-[#F5C518] mt-1">●</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Method */}
              {recipe.method.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">Method</h2>
                  <ol className="space-y-4">
                    {recipe.method.map((step, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm text-[#444]">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#F5C518] text-[#1a1a1a] font-bold flex items-center justify-center text-xs">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Sidebar – Fresh Picks For You */}
            <aside>
              <h3 className="text-base font-bold text-[#1a1a1a] mb-4">Fresh Picks For You</h3>
              <div className="flex flex-col gap-4">
                {otherRecipes.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/mango/recipes/${r.slug}`}
                    className="flex gap-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="w-20 h-16 bg-[#F5C518] rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                      🥭
                    </div>
                    <div>
                      <p className="text-xs text-[#888] mb-1">{r.date}</p>
                      <p className="text-sm font-medium text-[#1a1a1a] line-clamp-2 group-hover:underline">{r.title}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Back to landing */}
              <Link
                href="/mango"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:underline"
              >
                ← Back to Mango
              </Link>
            </aside>
          </div>
        </section>
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
