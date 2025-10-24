import { Box, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import { OriginLogoWhite } from '../../Icons/OriginIcons';
import SocialLinks from './SocialLinks';
import FooterNav from './FooterNav';
import { FooterDataType } from '../../utilities/types';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Mail } from '@mui/icons-material';
import Image from 'next/image';
import originLogo from '/public/assets/images/neworiginlogo.png';

type FooterProps = {
  footerData?: FooterDataType;
};

const Footer: React.FC<FooterProps> = ({ footerData }) => {
  if (!footerData) return null;

  const { footerLinksPrimary, footerLinksSecondary } = footerData;

  return (
    <>
      {/* Footer main */}
      <Box className="bg-[#FFDD00] py-[60px] md:pt-[20px]">
        <Box className="min-h-[240px] flex items-center">
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              {/* Logo + Social Links */}
              <Grid item xs={12} md={3.5}>
                <Box className="h-full flex flex-col items-start justify-center space-y-6">
                  <Box className="mt-[50px] pr-[100px]">
                    <Image
                      src={originLogo} // replace with your image path
                      alt="Origin Logo"
                      width={400} // approximate width in pixels (matches w-44)
                      height={75} // height (adjust according to your logo's aspect ratio)
                      className="object-contain"
                    />
                  </Box>
                  <SocialLinks />
                </Box>
              </Grid>

              {/* Navigation */}
              <Grid item xs={12} md={2.5}>
                <Box className="flex flex-col items-start space-y-4 mt-6 md:mt-10">
                  <Typography
                    variant="body2"
                    className="text-black text-sm font-semibold uppercase tracking-wider mb-2"
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
                    className="text-black text-sm font-semibold uppercase tracking-wider mb-2"
                  >
                    Contact Us
                  </Typography>

                  {/* Phone */}
                  <Typography
                    component="a"
                    href="tel:+919900508216"
                    className="text-black text-base no-underline hover:text-green-100 flex items-center gap-2"
                  >
                    <PhoneIcon fontSize="small" /> +91 9900508216
                  </Typography>

                  <Typography
                    component="a"
                    href="mailto:support@originfresh.in"
                    className="text-black text-base no-underline hover:text-green-100"
                  >
                    <Mail fontSize="small"/> support@originfresh.in
                  </Typography>

                  {/* WhatsApp */}
                  <Typography
                    component="a"
                    href="tel:+918344621039"
                    className="text-black text-base no-underline hover:text-green-100 flex items-center gap-2"
                  >
                    <WhatsAppIcon fontSize="small" /> +91 9900507318
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
                <Typography variant="body2" className="text-sm text-black opacity-90">
                  © 2025, Origin Fresh. All rights reserved.
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
