import React from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import CustomHead from '@/components/shared/CustomHead';
import { FooterDataType, MainMenuType } from '@/utilities/types';
import MangoHeader from '@/components/Mango/MangoHeader';

interface MangoProductDetailPageProps {
  slug: string;
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}

// Placeholder product map – will be replaced with API call using slug
const productMap: Record<
  string,
  { name: string; description: string; price: number; weight: string; details: string }
> = {
  alphonso: {
    name: 'Alphonso',
    description:
      'The undisputed king of mangoes. Rich, creamy pulp with a saffron-like colour and an irresistible sweet aroma.',
    price: 280,
    weight: '1 Kg',
    details:
      'Grown in the Ratnagiri region of Maharashtra, sourced directly from GI-certified farms. 100% carbide-free.'
  },
  kesar: {
    name: 'Kesar',
    description: 'Named for its saffron-coloured pulp. Fragrant, fiberfree, and deliciously sweet.',
    price: 260,
    weight: '1 Kg',
    details: "Harvested in the Gir forest region of Gujarat. One of India's most prized GI-tagged mangoes."
  },
  dasheri: {
    name: 'Dasheri',
    description: 'Thin-skinned with virtually no fiber. Delicately sweet with a rich lingering flavour.',
    price: 240,
    weight: '1 Kg',
    details: 'Originates from the Malihabad region of Uttar Pradesh, known as the mango belt of India.'
  }
};

const MangoProductDetailPage = ({ slug, mainMenuItems, footerData }: MangoProductDetailPageProps) => {
  const product = productMap[slug] || {
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: 'Fresh, farm-sourced mango.',
    price: 250,
    weight: '1 Kg',
    details: 'Sourced directly from verified farmers. 100% carbide-free.'
  };

  return (
    <Layout isHeader={false} mainMenuItems={mainMenuItems} footerData={footerData} isHeaderSticky={true}>
      <CustomHead title={`${product.name} Mangoes | Origin Fresh`} description={product.description} />

      <MangoHeader />

      <main className="min-h-screen bg-[#FFF9E6] pt-[80px]">
        {/* ── Breadcrumb ── */}
        <nav className="px-6 md:px-16 py-4 bg-white border-b border-[#eee]">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-[#888]">
            <Link href="/mango" className="hover:text-[#333] transition-colors">
              Mango
            </Link>
            <span>/</span>
            <Link href="/mango/products" className="hover:text-[#333] transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-[#1a1a1a] font-medium">{product.name}</span>
          </div>
        </nav>

        {/* ── Product Detail ── */}
        <section className="px-6 md:px-16 py-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <div className="bg-[#F5C518] rounded-3xl aspect-square flex items-center justify-center text-[180px]">
              🥭
            </div>

            {/* Product Info */}
            <div>
              <span className="inline-block bg-[#FFF3CC] text-[#7a5900] text-xs font-semibold py-1 px-3 rounded-full mb-4">
                Mango · {product.weight}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">{product.name}</h1>
              <p className="text-[#444] text-base leading-relaxed mb-6">{product.description}</p>
              <p className="text-sm text-[#666] mb-8">{product.details}</p>

              <div className="flex items-center gap-6 mb-8">
                <span className="text-3xl font-bold text-[#1a1a1a]">₹{product.price}</span>
                <span className="text-sm text-[#888]">per {product.weight}</span>
              </div>

              {/* Add to Cart – placeholder (mango cart state to be implemented) */}
              <button className="w-full md:w-auto bg-[#1a1a1a] text-white font-semibold py-4 px-12 rounded-full text-base hover:bg-[#333] transition-colors">
                Add to Mango Cart
              </button>
            </div>
          </div>
        </section>

        {/* ── Back to All Mangoes ── */}
        <div className="px-6 md:px-16 pb-12">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/mango/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:underline"
            >
              ← View all mangoes
            </Link>
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
    console.error('Error fetching mango product detail data:', error);
    return { props: { slug, mainMenuItems: [], footerData: {} } };
  }
};

export default MangoProductDetailPage;
