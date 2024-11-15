import { Grid, Link as MUILink, Typography } from "@mui/material";
import NextLink from "next/link";
import React from "react";

import {
  LocationOutlined,
  MessageOutlined,
  PhoneOutlined,
  // WhatsAppOutlined,
} from "../../assets/svg/Icons/OriginIcons";

type ContactDetailsType = {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
};

type ContactInfoProps = {
  contactDetails: ContactDetailsType;
};

const ContactInfo: React.FC<ContactInfoProps> = ({ contactDetails }) => {
  // const { address, phone, email, whatsapp } = contactDetails;

  return (
    <Grid
      item
      xs={12}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        color: "white",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        <LocationOutlined
          sx={{ marginTop: "4px", width: "18px", height: "16px" }}
        />
        <Typography component="span">
          838, 2nd Floor, 7th Main Rd, 2nd Stage, Indiranagar, Bengaluru,
          Karnataka 560038
        </Typography>
      </Typography>
      <Typography
        variant="body1"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          marginTop: "2px",
        }}
      >
        <PhoneOutlined
          sx={{ marginTop: "2px", width: "16px", height: "16px" }}
        />
        <NextLink href={`tel:${9900508216}`} passHref>
          <MUILink sx={{ color: "inherit", textDecoration: "none" }}>
            +91-9900508216
          </MUILink>
        </NextLink>
      </Typography>
      <Typography
        variant="body1"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          marginTop: "4px",
        }}
      >
        <MessageOutlined
          sx={{ marginTop: "2px", width: "16px", height: "16px" }}
        />
        <NextLink href="mailto:support@madrasmandi.in" passHref>
          <MUILink sx={{ color: "inherit", textDecoration: "none" }}>
            support@originfresh.in
          </MUILink>
        </NextLink>
      </Typography>
      <Typography
        variant="body1"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        {/* <WhatsAppOutlined sx={{ marginTop: '4px', width: '18px', height: '16px' }} />
        <NextLink
          href={`https://api.whatsapp.com/send?phone=91${whatsapp}&text=Hello!`}
          passHref
        >
          <MUILink sx={{ color: 'inherit', textDecoration: 'none' }}>
            {whatsapp}
          </MUILink>
        </NextLink> */}
      </Typography>
    </Grid>
  );
};

export default ContactInfo;
