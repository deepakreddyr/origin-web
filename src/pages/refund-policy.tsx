import React from "react";
import Head from "next/head";
import Refund from "@/components/Refund";

const RefundPolicyPage = () => {
  return (
    <>
      <Head>
        <title>Refund Policy</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Return and Refund" />
        <link rel="canonical" href=" https://originfresh.in/return-refund" />
        <meta
          property="og:site_name"
          content="Return and Refund | Origin Fresh"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Return and Refund | Origin Fresh" />
        <meta
          property="og:description"
          content="Our Return and Refund Policy forms are part of and must be read in conjunction with the website’s Terms and Conditions. We reserve the right to change this Return and Refund Policy at any time."
        />
        <meta
          property="og:url"
          content="https://originfresh.in/return-refund"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Return and Refund | Origin Fresh" />
        <meta
          name="twitter:description"
          content="Our Return and Refund Policy forms are part of and must be read in conjunction with the website’s Terms and Conditions. We reserve the right to change this at any time."
        />
        <script type="application/ld+json">
          {`{
                  "@context": "https://schema.org/",
                  "@type": "BreadcrumbList",
                  "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://originfresh.in/"
                },{
                  "@type": "ListItem",
                  "position": 2,
                  "name": "About us",
                  "item": "https://originfresh.in/about-us"
                }]
                }`}
        </script>
      </Head>
      <Refund />
    </>
  );
};

export default RefundPolicyPage;
