import React from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import desktopHero from '/public/assets/images/shop/whyoriginbannershop.png';

const WhyOriginBanner = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        width: '85vw',
        margin: '4rem auto',
      }}
    >
      <Image
        src={desktopHero}
        alt="Why Origin"
        layout="responsive"
        width={1600}
        height={600}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: '10%',
          transform: 'translateY(-50%)',
          color: '#fff',
          textAlign: 'left',
        }}
      >
        
      </Box>
    </Box>
  );
};

export default WhyOriginBanner;
