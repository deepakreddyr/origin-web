import TermsAndConditions from "@/components/TermsAndConditions/TermsAndConditions";
import React from "react";
import Head from "next/head";

const TermsAndConditionsPage = () => {
  return (
    <>
      <Head>
        <title>Terms and Condition</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Terms and Conditions" />
        <meta
          property="og:site_name"
          content="Terms and Conditions | Origin Fresh"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Terms and Conditions | Origin Fresh"
        />
        <meta
          property="og:description"
          content="Terms and Conditions of Origin Fresh you agree that you have read, understood and our bound by the Terms, And also what rights are here to guarantee our customers."
        />
        <meta
          property="og:url"
          content="https://originfresh.in/terms-and-conditions"
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="Terms and Conditions | Origin Fresh"
        />
        <meta
          name="twitter:description"
          content="Terms and Conditions of Origin Fresh you agree that you have read, understood and our bound by the Terms, And also what rights are here to guarantee our customers."
        />
        <link
          rel="canonical"
          href=" https://originfresh.in/terms-and-conditions"
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
      <TermsAndConditions />{" "}
    </>
  );
};

export default TermsAndConditionsPage;
