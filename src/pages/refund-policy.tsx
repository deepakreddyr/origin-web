import React from "react";
import Head from "next/head";
import Refund from "@/components/Refund";
import CustomHead from "@/components/shared/CustomHead";

const RefundPolicyPage = () => {
  return (
    <>
      <CustomHead
        title="Refund Policy | Origin Fresh"
        description="Our Return and Refund Policy forms are part of and must be read in conjunction with the website’s Terms and Conditions."
        canonical="https://originfresh.in/return-refund"
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
      <Refund />
    </>
  );
};

export default RefundPolicyPage;
