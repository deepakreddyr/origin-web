import { Grid } from '@mui/material';
import React from 'react';
import Image from 'next/image';

// Import your custom SVGs
import InstagramIcon from '/public/assets/icons/instagram.svg';
import LinkedInIcon from '/public/assets/icons/linkedinicon.svg';
// import FacebookIcon from "/public/assets/icons/facebook.svg"; // Optional

const SocialLinks = () => {
  return (
    <div className="flex gap-[16px]">
      <a
        href="https://www.instagram.com/originfresh.in?igsh=ZXYxNnFvYXR4cWd5"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg p-1 hover:bg-white/10 transition-colors"
      >
        <Image
          src={InstagramIcon}
          alt="Instagram"
          width={24}
          height={24}
          className="w-[24px] h-[24px] filter invert opacity-70 hover:opacity-100 transition-opacity"
        />
      </a>
      <a
        href="https://www.linkedin.com/company/origin-fresh-tech/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg p-1 hover:bg-white/10 transition-colors"
      >
        <Image
          src={LinkedInIcon}
          alt="LinkedIn"
          width={24}
          height={24}
          className="w-[24px] h-[24px] filter invert opacity-70 hover:opacity-100 transition-opacity"
        />
      </a>
    </div>
  );
};

export default SocialLinks;
