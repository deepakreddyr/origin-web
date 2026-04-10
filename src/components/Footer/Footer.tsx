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
import { useCartStore } from '@/hooks/useCartStore';

type FooterProps = {
  footerData?: FooterDataType;
};

const Footer: React.FC<FooterProps> = ({ footerData }) => {
  const { isMangoPage } = useCartStore();
  if (!footerData) return null;

  const { footerLinksPrimary, footerLinksSecondary } = footerData;

  // Mango Page Specific Data Mapping (matching images)
  const quickLinks = [
    { text: 'How It Works', href: 'about' },
    { text: 'Subscribe', href: 'subscription' }
  ];

  const supportLinks = [
    { text: 'Delivery Info', href: 'delivery-info' },
    { text: 'Returns', href: 'returns' },
    { text: 'Terms & Conditions', href: 'terms-condition' },
    { text: 'Privacy Policy', href: 'privacy-policy' }
  ];

  if (isMangoPage) {
    return (
      <Box
        component="footer"
        className="bg-[#1a1a1a] text-white py-12 md:py-16 mob:rounded-t-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.1)]"
        sx={{ fontFamily: 'SofiaPro' }}
      >
        <Container maxWidth="lg">
          {/* Desktop View */}
          <Box className="mob:hidden">
            <Grid container spacing={4}>
              {/* Logo & Social Links */}
              <Grid item xs={12} md={3.5}>
                <Box className="flex flex-col gap-6 items-start">
                  <Box className="w-[180px] h-[50px] relative overflow-visible">
                    <Image
                      src={originLogo}
                      alt="Origin Logo"
                      width={400}
                      height={75}
                      className="object-contain invert"
                    />
                  </Box>
                  <Box className="flex flex-col gap-8 mt-2">
                    <div className="filter brightness-0 invert opacity-80 mt-2">
                      <SocialLinks />
                    </div>
                  </Box>
                </Box>
              </Grid>

              {/* Navigation */}
              <Grid item xs={12} md={2.5}>
                <Typography className="text-white text-[16px] font-semibold uppercase tracking-wider mb-6">
                  Navigation
                </Typography>
                <Box className="flex flex-col gap-4">
                  <FooterNav xs={12} links={footerLinksPrimary} isDark={true} />
                </Box>
              </Grid>

              {/* Contact Us */}
              <Grid item xs={12} md={3.5}>
                <Typography className="text-white text-[16px] font-semibold uppercase tracking-wider mb-6">
                  Contact Us
                </Typography>
                <Box className="flex flex-col gap-4 text-[#A0A0A0] text-[16px]">
                  <Typography
                    component="a"
                    href="tel:+919900508216"
                    className="text-[#A0A0A0] no-underline flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <PhoneIcon fontSize="small" /> +91 9900508216
                  </Typography>

                  <Typography
                    component="a"
                    href="mailto:support@originfresh.in"
                    className="text-[#A0A0A0] no-underline flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Mail fontSize="small" /> support@originfresh.in
                  </Typography>

                  <Typography
                    component="a"
                    href="https://wa.me/919900507318"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A0A0A0] no-underline flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <WhatsAppIcon fontSize="small" /> +91 9900507318
                  </Typography>
                </Box>
              </Grid>

              {/* Terms/Policy Links */}
              <Grid item xs={12} md={2.5}>
                <Box className="mt-12">
                  <FooterNav xs={12} links={footerLinksSecondary} isDark={true} />
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Mobile View */}
          <Box className="hidden mob:flex flex-col items-center">
            {/* Logo Wrapper */}
            <Box className="w-[180px] h-[40px] relative mb-4">
              <Image src={originLogo} alt="Origin Logo" width={400} height={75} className="object-contain invert" />
            </Box>

            <Grid container spacing={4} className="mb-12">
              <Grid item xs={6}>
                <Typography className="text-white text-[16px] font-semibold uppercase tracking-wider mb-6">
                  Navigation
                </Typography>
                <Box className="flex flex-col gap-3">
                  <FooterNav xs={12} links={footerLinksPrimary} isDark={true} />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography className="text-white text-[16px] font-semibold uppercase tracking-wider mb-6">
                  Contact us
                </Typography>
                <Box className="flex flex-col gap-4 text-[#A0A0A0] text-[13px]">
                  <p>+91 99005 08216</p>
                  <p>support@originfresh.in</p>
                  <p>+91 99005 08216</p>
                </Box>
              </Grid>
            </Grid>

            {/* Social Links Mobile */}
            <div className="filter brightness-0 invert opacity-70 mb-12">
              <SocialLinks />
            </div>

            {/* Bottom Links */}
            <Box className="flex flex-col items-start w-full gap-4 mb-12 border-t border-[#333] pt-8">
              <FooterNav xs={12} links={footerLinksSecondary} isDark={true} />
            </Box>
          </Box>

          {/* Copyright */}
          <Box className="border-t border-[#333] mt-8 pt-8 text-center mob:border-none mob:pt-0">
            <Typography className="text-[#A0A0A0] text-[14px]">
              © {new Date().getFullYear()} Origin Fresh. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <>
      {/* Footer main */}
      <Box className="bg-primary py-[60px] md:pt-[20px]">
        <Box className="min-h-[240px] flex items-center">
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              {/* Logo + Social Links */}
              <Grid item xs={12} md={3.5}>
                <Box className="h-full flex flex-col items-start justify-center space-y-6">
                  <Box className="mt-[50px] pr-[100px]">
                    <Image src={originLogo} alt="Origin Logo" width={400} height={75} className="object-contain" />
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
                    className="text-black text-base no-underline flex items-center gap-2"
                  >
                    <PhoneIcon fontSize="small" /> +91 9900508216
                  </Typography>

                  <Typography
                    component="a"
                    href="mailto:support@originfresh.in"
                    className="text-black text-base no-underline"
                  >
                    <Mail fontSize="small" /> support@originfresh.in
                  </Typography>

                  {/* WhatsApp */}
                  <Typography
                    component="a"
                    href="https://wa.me/919900507318"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black text-base no-underline flex items-center gap-2"
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
                  © {new Date().getFullYear()}, Origin Fresh. All rights reserved.
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

// export default Footer;
