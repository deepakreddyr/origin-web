import { Grid } from '@mui/material';
import React from 'react';
import Image from 'next/image';

// Import your custom SVGs
import InstagramIcon from '/public/assets/icons/instagram.svg';
import LinkedInIcon from '/public/assets/icons/linkedinicon.svg';
// import FacebookIcon from "/public/assets/icons/facebook.svg"; // Optional

const SocialLinks = () => {
  return (
    <Grid item xs={12} className="flex gap-5 pl-[30px] sm:gap-6 mt-10 sm:mt-12">
      <a
        href="https://www.instagram.com/originfresh.in?igsh=ZXYxNnFvYXR4cWd5"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg p-1"
      >
        <Image src={InstagramIcon} alt="Instagram" width={32} height={32} className="w-8 h-8 filter invert" />
      </a>
      <a
        href="https://www.linkedin.com/company/origin-fresh-tech/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg p-1"
      >
        <Image src={LinkedInIcon} alt="LinkedIn" width={32} height={32} className="w-8 h-8 filter invert" />
      </a>
      {/* <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-secondary-200 rounded-lg p-1"
      >
        <Image
          src={FacebookIcon}
          alt="Facebook"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      </a> */}
    </Grid>
  );
};

export default SocialLinks;
