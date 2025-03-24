import { Box, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import { OriginLogoWhite } from '../../Icons/OriginIcons';
import SocialLinks from './SocialLinks';
import ContactInfo from './ContactInfo';
import FooterNav from './FooterNav';
import NewsletterSubscription from '../NewsSubscription';
import { FooterDataType } from '../../utilities/types';

const Footer = (footerData: FooterDataType) => {
  const { footerLinksPrimary, footerLinksSecondary, contactDetails } = footerData;
  return (
    <Box className="bg-secondary py-[60px] md:pt-[80px] md:pb-[75px] rounded-t-[20px] lg:rounded-t-[80px]">
      <Container>
        <Grid container>
          {/* <Grid container className="justify-between items-center border-secondary-200 mb-10 pb-10 border-b">
            <Grid item xs={12} md={7} lg={7} className="mt-6 md:mt-10 mb-10 md:mb-0">
              <NewsletterSubscription />
            </Grid>
            <Grid item xs={12} md={5} lg={5} className="flex flex-row flex-wrap justify-start items-start gap-y-4">
              <FooterNav links={footerLinksPrimary} xs={12} md={6} />
            </Grid>
          </Grid> */}

          <Grid container className="flex flex-row flex-wrap justify-between items-start">
            <Grid item xs={12} md={3} className="pt-2">
              <OriginLogoWhite className="w-32 h-11" />
              <SocialLinks />
            </Grid>
            <Grid item xs={12} md={5} className="my-[35px] md:my-0">
              <ContactInfo contactDetails={contactDetails} />
            </Grid>
            <Grid item xs={12} md={2} className="flex flex-col justify-start items-start gap-y-4">
              <FooterNav xs={12} links={footerLinksSecondary} />
            </Grid>
          </Grid>
          <Grid item md={12} className="mt-5 md:mt-8 text-center">
            <Typography variant="body1" className="text-sm text-white">
              © 2024, Origin. All rights reserved.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
