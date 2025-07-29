import { Box, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import { OriginLogoWhite } from '../../Icons/OriginIcons';
import SocialLinks from './SocialLinks';
import FooterNav from './FooterNav';
import { FooterDataType } from '../../utilities/types';

type FooterProps = {
  footerData?: FooterDataType;
};

const Footer: React.FC<FooterProps> = ({ footerData }) => {
  if (!footerData) return null;

  const { footerLinksPrimary, footerLinksSecondary, contactDetails } = footerData;

  return (
    <>
      {/* Footer main */}
      <Box className="bg-[#146321] py-[60px] md:pt-[20px]">
        <Box className="min-h-[240px] flex items-center">
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              {/* Logo + Social Links */}
              <Grid item xs={12} md={3.5}>
                <Box className="h-full flex flex-col items-start justify-center space-y-6">
                  <OriginLogoWhite className="w-44 h-auto pt-[50px]" />
                  <SocialLinks />
                </Box>
              </Grid>

              {/* Navigation */}
              <Grid item xs={12} md={2.5}>
                <Box className="flex flex-col items-start space-y-4 mt-6 md:mt-10">
                  <Typography
                    variant="body2"
                    className="text-white text-sm font-semibold uppercase tracking-wider mb-2"
                  >
                    Navigation
                  </Typography>
                  <FooterNav xs={12} links={footerLinksPrimary} />
                </Box>
              </Grid>

              {/* Contact Us */}
              <Grid item xs={12} md={3.5}>
                <Box className="flex flex-col items-start space-y-4 mt-6 md:mt-10">
                  <Typography
                    variant="body2"
                    className="text-white text-sm font-semibold uppercase tracking-wider mb-2"
                  >
                    Contact Us
                  </Typography>
                  <Typography
                    component="a"
                    href="tel:+919900508216"
                    className="text-white text-base no-underline hover:text-green-100"
                  >
                    +91 9900508216
                  </Typography>
                  <Typography
                    component="a"
                    href="mailto:support@originfresh.in"
                    className="text-white text-base no-underline hover:text-green-100"
                  >
                    support@originfresh.in
                  </Typography>
                  <Typography
                    component="a"
                    href="tel:+918344621039"
                    className="text-white text-base no-underline hover:text-green-100"
                  >
                    +91 8344621039
                  </Typography>
                </Box>
              </Grid>

              {/* Terms and Policy Links */}
              <Grid item xs={12} md={2.5}>
                <Box className="flex flex-col items-start space-y-4 mt-6 md:mt-10">
                  <FooterNav xs={12} links={footerLinksSecondary} />
                </Box>
              </Grid>
            </Grid>

            {/* Footer Bottom */}
            <Grid container className="mt-5 pt-5">
              <Grid item xs={12} className="text-center">
                <Typography variant="body2" className="text-sm text-white opacity-90">
                  © 2025, Origin. All rights reserved.
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Footer;
