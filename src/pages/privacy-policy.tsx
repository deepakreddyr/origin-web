import PrivacyPolicy from "@/components/PrivacyPolicy/PrivacyPolicy";
import React from "react";
import Head from "next/head";

const PrivacyPolicyPage = () => {
  return (
    <div>
      <Head>
        <title>Privacy Policy</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Privacy Policy" />
        <link rel="canonical" href=" https://originfresh.in/privacy-policy" />
        <meta
          property="og:site_name"
          content="Privacy Policy |  Origin Fresh"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Privacy Policy |  Origin Fresh" />
        <meta
          property="og:description"
          content="Read the Privacy Policy statement, Which explains how Origin Fresh collects uses, and discloses your personal information in connection with its operation."
        />
        <meta
          property="og:url"
          content="https://originfresh.in/privacy-policy"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Privacy Policy |  Origin Fresh" />
        <meta
          name="twitter:description"
          content="Read the Privacy Policy statement, Which explains how Origin Fresh collects uses, and discloses your personal information in connection with its operation of policies."
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
      <PrivacyPolicy />
    </div>
  );
};

export default PrivacyPolicyPage;
