import TermsAndConditions from "@/components/TermsAndConditions/TermsAndConditions";
import React from "react";
import Head from "next/head";
import CustomHead from "@/components/shared/CustomHead";

const TermsAndConditionsPage = () => {
  return (
    <>
      <CustomHead
        title="Terms and Conditions | Origin Fresh"
        description="Read the Terms and Conditions of Origin Fresh to understand your rights and our policies."
        canonical="https://originfresh.in/terms-and-conditions"
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
      <TermsAndConditions />{" "}
    </>
  );
};

export default TermsAndConditionsPage;
