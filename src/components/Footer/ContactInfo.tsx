import { Grid, Typography } from "@mui/material";
import React from "react";
import {
  LocationOutlined,
  PhoneOutlined,
  MessageOutlined,
  WhatsAppOutlined,
} from "../../Icons/OriginIcons";
import Link from "next/link";
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
  const { address, phone, email, whatsapp } = contactDetails;

  return (
    <Grid item xs={12} className="flex flex-col gap-2 text-white">
      <Typography variant="body1" className="flex items-start gap-2">
        <LocationOutlined className="mt-1.5 w-[18px] h-4" />
        <Typography component={"span"}>{address}</Typography>
      </Typography>
      <Typography variant="body1" className="flex items-start gap-2">
        <PhoneOutlined className="mt-1.5 w-4 h-4" />
        <Link href={`tel:${phone}`}>{phone}</Link>
      </Typography>
      <Typography variant="body1" className="flex items-start gap-2">
        <MessageOutlined className="mt-1.5 w-4 h-4" />
        <Link href={`mailto:${email}`}>{email}</Link>
      </Typography>
      <Typography variant="body1" className="flex items-start gap-2">
        <WhatsAppOutlined className="mt-1.5 w-[18px] h-4" />
        <Link
          href={`https://api.whatsapp.com/send?phone=91${whatsapp}&text=Hello!`}
        >
          {whatsapp}
        </Link>
      </Typography>
    </Grid>
  );
};

export default ContactInfo;
