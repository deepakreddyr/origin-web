import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";

import { OriginLogoWhite } from "../../assets/svg/Icons/OriginIcons";
// import NewsletterSubscription from '../../components/NewsSubscription';
import ContactInfo from "./ContactInfo";
import FooterNav from "./FooterNav";
import SocialLinks from "./SocialLinks";

export type FooterLink = {
  text: string;
  href: string;
};

export type ContactDetailsType = {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
};

export type FooterDataType = {
  footerLinksPrimary: FooterLink[];
  footerLinksSecondary: FooterLink[];
  contactDetails: ContactDetailsType;
};

const Footer = (footerData: FooterDataType) => {
  const { footerLinksPrimary, footerLinksSecondary, contactDetails } =
    footerData;
  return (
    <Box
      className="footer"
      sx={{
        backgroundColor: "#25874D",
        py: "60px",
        pt: { md: "80px" },
        pb: { md: "75px" },
        borderTopLeftRadius: { xs: "20px", lg: "80px" },
        borderTopRightRadius: { xs: "20px", lg: "80px" },
      }}
    >
      <Container>
        <Grid container>
          <Grid container justifyContent="space-between" alignItems="center">
            {/* <Grid
              item
              xs={12}
              md={7}
              lg={7}
              sx={{ mt: { xs: '24px', md: '40px' }, mb: { xs: '40px', md: 0 } }}
            >
              <NewsletterSubscription />
            </Grid> */}
            <Grid
              item
              xs={12}
              md={5}
              lg={5}
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <FooterNav links={footerLinksPrimary} xs={12} md={6} />
            </Grid>
          </Grid>

          <Grid
            container
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Grid item xs={12} md={3} sx={{ pt: 2 }}>
              <OriginLogoWhite sx={{ width: "128px", height: "44px" }} />
              <SocialLinks />
            </Grid>
            <Grid item xs={12} md={5} sx={{ my: { xs: "35px", md: 0 } }}>
              {/* {contactDetails && ( */}
              <ContactInfo contactDetails={contactDetails} />
              {/* )} */}
            </Grid>
            <Grid
              item
              xs={12}
              md={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <FooterNav xs={12} links={footerLinksSecondary} />
            </Grid>
          </Grid>
          <Grid
            item
            md={12}
            sx={{ mt: { xs: "20px", md: "32px" }, textAlign: "center" }}
          >
            <Typography
              variant="body1"
              sx={{ fontSize: "0.875rem", color: "white" }}
            >
              © 2025, Origin. All rights reserved.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
