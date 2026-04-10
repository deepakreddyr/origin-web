import { Grid } from '@mui/material';
import Link from 'next/link';
import React from 'react';

type LinkType = {
  text: string;
  href: string;
};

type LinksProps = {
  links: LinkType[];
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  isDark?: boolean;
};

const FooterNav = ({ links, xs, sm, md, lg, xl, isDark }: LinksProps) => {
  return (
    <>
      {links?.map((link, index) => (
        <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} className="h-max" key={index}>
          <Link
            href={`/${link.href}`}
            rel="noopener noreferrer"
            className={`${isDark ? 'text-white' : 'text-black'} font-[SofiaPro] text-[1rem] hover:underline`}
          >
            {link.text}
          </Link>
        </Grid>
      ))}
    </>
  );
};

export default FooterNav;
