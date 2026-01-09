import PrivacyPolicy from "@/components/PrivacyPolicy/PrivacyPolicy";
import React from "react";
import Head from "next/head";
import CustomHead from "@/components/shared/CustomHead";

const PrivacyPolicyPage = () => {
  return (
    <div>
      <CustomHead
        title="Privacy Policy | Origin Fresh"
        description="Read the Privacy Policy statement, which explains how Origin Fresh collects, uses, and discloses your personal information."
        canonical="https://originfresh.in/privacy-policy"
      />
      <Head>
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
