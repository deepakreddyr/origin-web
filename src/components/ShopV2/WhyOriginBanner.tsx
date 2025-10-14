import React from 'react';
import { Box, Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import landingimg from '/public/assets/images/shop/landingimg2.png';

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
      {/* Background Image */}
      <Image
        src={landingimg}
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

      {/* Button with scale */}
      <Button
        onClick={() => router.push('/cotton-candy-grapes/328')}
        sx={{
          position: 'absolute',
          top: { xs: '70%', sm: '65%', md: '63%' }, // vertical position
          right: { xs: '5%', sm: '5%', md: '6%' },
          transform: {
            xs: 'translateY(-50%) scale(0.5)', // mobile scale
            sm: 'translateY(-50%) scale(0.7)', // tablet scale
            md: 'translateY(-50%) scale(1)',   // desktop normal
          },
          transformOrigin: 'right center', // scale from right center
          borderRadius: '8px',
          backgroundColor: '#FFD600',
          color: 'black',
          px: 4,
          py: 1.5,
          fontWeight: 'bold',
          fontSize: '1.1rem',
          '&:hover': {
            backgroundColor: '#FFCD00',
          },
        }}
      >
        Shop Now
      </Button>
    </Box>
  );
};

export default WhyOriginBanner;
