import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import SideBySide from '../SideBySide';
import classNames from 'classnames';
import { useRouter } from 'next/router';

const OriginHero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  return (
    <Box className="relative z-0 bg-gradient-to-b lg:bg-gradient-to-r from-[100%] from-primary lg:from-55% to-[100%] to-white lg:to-55% pt-[210px] md:pt-[227px] pb-[120px] lg:pb-[135px]">
      <Container>
        <SideBySide
          variant="hero"
          imageSrc="/assets/images/home-hero.png"
          imageAlt="commitment"
          imageWidth={424}
          imageHeight={499}
          imageClass="object-contain"
          titleVariant={isMobile ? 'h4' : 'h1'}
          title={`Where Fresh is a Lifestyle`}
          imageContainerClass={classNames('lg:w-none', isMobile ? 'pt-12' : '')}
          titleContainerClass="lg:pe-9 lg:pt-11 lg:pb-11 md:ps-0 lg:w-2/5 "
          description={`Join us, elevate meals, support local farmers, and reduce food waste.`}
          buttonText="Shop  Now"
          buttonClick1={() => router.push('/shop')}
          buttonText2="Choose fresh now!"
          buttonVariant="tertiary"
          buttonVariant2="textOnly"
          titleClass="text-black p-0 md:leading-[70px]"
          rootClass={classNames('lg:p-0 px-0 pb-0 flex-col-reverse sm:flex-row-reverse sm:flex-nowrap')}
        />
      </Container>
    </Box>
  );
};

export default OriginHero;
