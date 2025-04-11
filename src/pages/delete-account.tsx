import Head from 'next/head';
import React from 'react';

import AccountDel from '../components/DeleteAccount/AccountDel';

const DeleteAccount = (props: any) => (
  <>
    <Head>
      <title>Delete Account</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content="Delete Account" />
      <link rel="canonical" href="https://originfresh.in/delete-account" />
      <meta property="og:site_name" content="Delete Account | Originfresh" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Delete Account | Originfresh" />
      <meta
        property="og:description"
        content="Delete your Originfresh account and remove your personal information."
      />
      <meta property="og:url" content="https://originfresh.in/delete-account" />
      <meta property="og:image" content="/assets/svg/logo-header.svg" />
      <meta property="og:image:alt" content="Delete Account - Originfresh" />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Delete Account | Originfresh" />
      <meta
        name="twitter:description"
        content="Delete your Originfresh account and remove your personal information."
      />
      <meta name="twitter:image" content="/assets/svg/twitter.svg" />
    </Head>
    <AccountDel />
  </>
);

export default DeleteAccount;
