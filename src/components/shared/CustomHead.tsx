import Head from 'next/head';
import React from 'react';

interface CustomHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  ogUrl?: string;
  noIndex?: boolean;
}

const CustomHead: React.FC<CustomHeadProps> = ({
  title = 'Origin Fresh | Fresh Produce Delivered to Your Doorstep',
  description = 'Shop for the freshest organic fruits, vegetables, and exotic produce at Origin Fresh. Quality guaranteed, delivered straight to your home.',
  keywords = 'fresh produce, organic fruits, organic vegetables, farm fresh, groceries, Origin Fresh',
  canonical,
  ogImage = '/assets/logo.svg', // Assuming a default logo exists
  ogType = 'website',
  ogUrl,
  noIndex = false
}) => {
  const siteName = 'Origin Fresh';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical Link */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Robots */}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
    </Head>
  );
};

export default CustomHead;
