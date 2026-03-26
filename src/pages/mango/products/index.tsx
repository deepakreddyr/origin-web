import React from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import CustomHead from '@/components/shared/CustomHead';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import MangoHeader from '@/components/Mango/MangoHeader';

interface MangoProductsPageProps {
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

// Placeholder product data – will be replaced with API data
const allMangoProducts = [
  { slug: 'alphonso', name: 'Alphonso', description: 'The king of mangoes', price: 280, weight: '1 Kg' },
  { slug: 'kesar', name: 'Kesar', description: 'Saffron-hued and aromatic', price: 260, weight: '1 Kg' },
  { slug: 'dasheri', name: 'Dasheri', description: 'Fiberless and sweet', price: 240, weight: '1 Kg' },
  { slug: 'langra', name: 'Langra', description: 'Tangy-sweet, greenish skin', price: 220, weight: '1 Kg' },
  { slug: 'totapuri', name: 'Totapuri', description: 'Firm texture, mildly sweet', price: 200, weight: '1 Kg' },
  { slug: 'banganapalli', name: 'Banganapalli', description: 'Large and golden-yellow', price: 210, weight: '1 Kg' },
  { slug: 'himsagar', name: 'Himsagar', description: 'Rich and pulpy, popular in Bengal', price: 250, weight: '1 Kg' },
  { slug: 'neelam', name: 'Neelam', description: 'Small, sweet, and very fragrant', price: 200, weight: '1 Kg' },
  { slug: 'safeda', name: 'Safeda', description: 'Golden-yellow, mildly sweet', price: 215, weight: '1 Kg' },
  { slug: 'mulgoba', name: 'Mulgoba', description: 'Oval-shaped, spicy-sweet', price: 230, weight: '1 Kg' }
];

const MangoProductsPage = ({ mainMenuItems, footerData }: MangoProductsPageProps) => {
  return (
    <Layout isHeader={false} mainMenuItems={mainMenuItems} footerData={footerData} isHeaderSticky={true}>
      <CustomHead
        title="All Mangoes – Fresh Arrivals | Origin Fresh"
        description="Explore our full range of farm-fresh, carbide-free mangoes. Order online and get them delivered fresh."
      />

      <MangoHeader />

      <main className="min-h-screen bg-[#FAFAF8] pt-[80px]">
        {/* ── Page Header ── */}
        <section className="px-6 md:px-16 py-8 bg-white border-b border-[#eee]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <Link href="/mango" className="text-sm text-[#888] hover:text-[#333] transition-colors mb-1 inline-block">
                ← Back to Mango
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mt-1">Fresh Arrivals</h1>
            </div>
            <input
              type="text"
              placeholder="Search products"
              className="hidden md:block border border-[#ddd] rounded-full px-4 py-2 text-sm outline-none focus:border-[#F5C518] w-56"
            />
          </div>
        </section>

        {/* ── Products Grid ── */}
        <section className="px-6 md:px-16 py-10">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allMangoProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/mango/products/${product.slug}`}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="aspect-square bg-[#FFF3CC] rounded-xl flex items-center justify-center text-5xl mb-3 group-hover:scale-105 transition-transform overflow-hidden">
                  🥭
                </div>
                <h3 className="font-semibold text-[#1a1a1a] text-sm mb-1 truncate">{product.name}</h3>
                <p className="text-xs text-[#666] mb-1 line-clamp-2">{product.description}</p>
                <p className="text-xs text-[#888] mb-2">{product.weight}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#1a1a1a]">₹{product.price}</span>
                  <button
                    className="text-xs bg-[#F5C518] text-[#1a1a1a] font-semibold py-1 px-3 rounded-full hover:bg-[#e6b800] transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    Add
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
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
    console.error('Error fetching mango products list data:', error);
    return { props: { mainMenuItems: [], footerData: {} } };
  }
};

export default MangoProductsPage;
