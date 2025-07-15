import { Box, Button, useTheme, useMediaQuery } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import OriginBanner from '@/assets/svg/hero/OriginBanner.png';

const OriginHero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden',pt: { xs: 12, sm: 0 }}}>
      {/* Banner Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '200px', sm: '500px', md: '650px' },
        }}
      >
        <Image
          src={OriginBanner}
          alt="Origin Hero Banner"
          fill
          priority
          style={{ objectFit: 'contain' }}
        />

        <Box
  sx={{
    position: 'absolute',
    top: '62%',
    left: {
      xs: 'calc(1% + 40px)',
      sm: 'calc(4% + 40px)',
      md: 'calc(6% + 50px)',
    },
    zIndex: 2,
    transform: 'translateY(-50%)',
  }}
>
        <Button
          variant="contained"
          onClick={() => router.push('/shop/exotics/3/ultra-exotics/26')}
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: '30px',
            textTransform: 'none',
            fontWeight: 'bold',
            px: { xs: 3, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            boxShadow: 4,
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          Shop Now
        </Button>
      </Box>
      </Box>
    </Box>
  );
};

export default OriginHero;



// import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
// import React from 'react';
// import SideBySide from '../SideBySide';
// import classNames from 'classnames';
// import { useRouter } from 'next/router';

// const OriginHero = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const router = useRouter();
//   return (
//     <Box className="relative hero-section z-0 from-[100%] from-primary lg:from-55% to-[100%] to-white lg:to-55% pt-[210px] md:pt-[227px] pb-[120px] lg:pb-[135px] sm:pb-[280px]">
//       <Container>
//         <SideBySide
//           variant="hero"
//           // imageSrc="/assets/images/home-hero.png"
//           // imageAlt="commitment"
//           // imageWidth={424}
//           // imageHeight={499}
//           imageClass="object-contain"
//           titleVariant={isMobile ? 'h4' : 'h1'}
//           title={`Where Fresh is a Lifestyle`}
//           imageContainerClass={classNames('lg:w-none', isMobile ? 'pt-12' : '')}
//           titleContainerClass="lg:pe-9 lg:pt-11 lg:pb-11 md:ps-0 lg:w-2/5 "
//           description={`Join us, elevate meals, support local farmers, and reduce food waste.`}
//           buttonText="Shop  Now"
//           buttonClick1={() => router.push('/shop')}
//           buttonText2="Choose fresh now!"
//           buttonVariant="tertiary"
//           buttonVariant2="textOnly"
//           titleClass="text-black p-0"
//           rootClass={classNames('lg:p-0 px-0 pb-0 flex-col-reverse sm:flex-row-reverse sm:flex-nowrap')}
//         />
//       </Container>
//     </Box>
//   );
// };

// export default OriginHero;