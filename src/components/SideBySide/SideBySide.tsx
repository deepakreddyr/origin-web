import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import OriginButton from '@/components/OriginButton';
import ParallaxImageBox from '@/components/SideBySide/ParallaxImageBox'; // Assuming you have a Parallax component
import CA from 'classnames';
import Image from 'next/image';
import ParallaxProvider from '@/components/ParallaxProvider/ParallaxProvider';
import { Variant } from '@mui/material/styles/createTypography';
import HTMLReactParser from 'html-react-parser/lib/index';

type SideBySideProps = {
  title: React.ReactNode;
  titleVariant?: Variant;
  titleClass?: string;
  description?: string;
  descriptionClass?: string;
  buttonClick1?: any;
  buttonClick2?: any;
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary' | 'tertiary' | 'textOnly';
  buttonText2?: string;
  buttonVariant2?: 'primary' | 'secondary' | 'tertiary' | 'textOnly';
  rootClass?: string;
  imageContainerClass?: string;
  titleContainerClass?: string;
  buttonContainerClass?: string;
  reverse?: boolean;
  variant?: 'parallax' | 'normal' | 'vertical' | 'hero';
  // Parallax props
  parallaxTopImageSrc?: string;
  parallaxMainImageSrc?: string;
  parallaxBottomImageSrc?: string;
  parallaxTopImageWidth?: number;
  parallaxTopImageHeight?: number;
  parallaxMainImageWidth?: number;
  parallaxMainImageHeight?: number;
  parallaxBottomImageWidth?: number;
  parallaxBottomImageHeight?: number;
  parallaxImageAlt?: string;
  parallaxTopImgClass?: string;
  parallaxMainImgClass?: string;
  parallaxBottomImgClass?: string;
  parallaxTopImgContainerClass?: string;
  parallaxBottomImgContainerClass?: string;
  parallaxImgContainerClass?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageClass?: string;
  quality?: number;
  priority?: boolean;
};

const SideBySide: React.FC<SideBySideProps> = ({
  variant = 'normal',
  parallaxTopImageSrc,
  parallaxMainImageSrc,
  parallaxBottomImageSrc,
  parallaxTopImageWidth = 100,
  parallaxTopImageHeight = 100,
  parallaxMainImageWidth = 300,
  parallaxMainImageHeight = 300,
  parallaxBottomImageWidth = 100,
  parallaxBottomImageHeight = 100,
  parallaxImageAlt = 'parallax-image',
  parallaxTopImgClass,
  parallaxMainImgClass,
  parallaxBottomImgClass,
  parallaxImgContainerClass,
  parallaxTopImgContainerClass,
  parallaxBottomImgContainerClass,
  imageSrc,
  imageAlt,
  imageWidth = 100,
  imageHeight = 100,
  title,
  titleVariant = 'h2',
  titleClass = 'text-secondary',
  description,
  buttonText,
  buttonClick1,
  buttonClick2,
  buttonVariant,
  buttonText2,
  buttonVariant2,
  rootClass = 'bg-secondary-200',
  imageContainerClass,
  titleContainerClass,
  reverse = false,
  imageClass,
  quality,
  priority,
  descriptionClass,
  buttonContainerClass
}) => {
  if (variant === 'parallax') {
    return (
      <TwoRowFlex reverse={reverse} rootClass={rootClass}>
        <Box
          className={CA('w-full lg:w-1/2', reverse ? 'mt-5 lg:mt-0 ' : 'pe-0 lg:pe-[100px]', parallaxImgContainerClass)}
        >
          <ParallaxProvider>
            <ParallaxImageBox
              topImageSrc={parallaxTopImageSrc || ''}
              mainImageSrc={parallaxMainImageSrc || ''}
              bottomImageSrc={parallaxBottomImageSrc || ''}
              topImageWidth={parallaxTopImageWidth}
              topImageHeight={parallaxTopImageHeight}
              mainImageWidth={parallaxMainImageWidth}
              mainImageHeight={parallaxMainImageHeight}
              bottomImageWidth={parallaxBottomImageWidth}
              bottomImageHeight={parallaxBottomImageHeight}
              imageAlt={parallaxImageAlt}
              topImageClass={parallaxTopImgClass}
              mainImageClass={parallaxMainImgClass}
              bottomImageClass={parallaxBottomImgClass}
              topImageContainerClass={parallaxTopImgContainerClass}
              bottomImageContainerClass={parallaxBottomImgContainerClass}
            />
          </ParallaxProvider>
        </Box>
        <Box
          className={CA(
            'px-0 lg:px-0 py-0 lg:py-16 pt-6 w-full lg:w-1/2 z-[1]',
            reverse ? 'ps-0 lg:ps-[90px]' : 'lg:pe-[90px]',
            titleContainerClass
          )}
        >
          <Typography variant={titleVariant} className={CA(titleClass, 'font-semibold')}>
            {typeof title === 'string' ? HTMLReactParser(title) : title}
          </Typography>
          {description && (
            <Typography
              variant="body1"
              component="div"
              className={CA(
                'lg:my-6 mt-6 mb-6 font-semibold md:text-[1.7vw] mob:text-[4vw] leading-[1.25] text-black',
                descriptionClass
              )}
            >
              {HTMLReactParser(description)}
            </Typography>
          )}
          {buttonText && <OriginButton handleClick={buttonClick1} variant={buttonVariant} buttonText={buttonText} />}
        </Box>
      </TwoRowFlex>
    );
  }

  if (variant === 'normal') {
    return (
      <TwoRowFlex reverse={reverse} rootClass={rootClass}>
        <Box
          className={CA(
            'w-full md:w-1/2 ',
            reverse ? 'mt-5 md:mt-0 ps-0 md:ps-[100px]' : 'pe-0 md:pe-[100px]',
            imageContainerClass
          )}
        >
          <Image
            src={imageSrc || ''}
            width={imageWidth}
            height={imageHeight}
            alt={imageAlt || ''}
            quality={quality}
            priority={priority}
            className={CA(
              'rounded-[10px] md:rounded-[46px] w-full sm:h-[200px] md:h-auto lg:w-auto lg:h-auto',
              imageClass
            )}
          />
        </Box>
        <Box
          className={CA(
            'px-0 md:px-0 py-0 md:py-16 pt-6 w-full md:w-1/2',
            reverse ? 'ps-0 md:ps-[100px]' : 'md:pe-[100px]',
            titleContainerClass
          )}
        >
          <Typography variant={titleVariant} className={CA(titleClass, 'font-semibold')}>
            {typeof title === 'string' ? HTMLReactParser(title) : title}
          </Typography>
          {description && (
            <Typography
              variant="body1"
              component="div"
              className={CA(
                'lg:my-6 mt-6 mb-6 font-semibold md:text-[1.7vw] mob:text-[4vw] leading-[1.25] text-black',
                descriptionClass
              )}
            >
              {HTMLReactParser(description)}
            </Typography>
          )}
          <Box className={CA('flex items-center gap-5', buttonContainerClass)}>
            {buttonText && <OriginButton handleClick={buttonClick1} variant={buttonVariant} buttonText={buttonText} />}
            {buttonText2 && (
              <Typography className="text-sm md:text-base" variant="body1">
                {buttonText2}
              </Typography>
            )}
          </Box>
        </Box>
      </TwoRowFlex>
    );
  }

  if (variant === 'vertical') {
    return (
      <TwoColFlex reverse={reverse} rootClass={rootClass}>
        <Box className={CA('w-full', reverse ? 'mt-5 lg:mt-0 pt-0 lg:pt-10' : 'pb-0 lg:pb-10')}>
          <Image
            src={imageSrc || ''}
            width={imageWidth}
            height={imageHeight}
            alt={imageAlt || ''}
            className={CA(
              imageClass,
              'rounded-[10px] lg:rounded-[46px] w-full sm:h-[200px] md:h-[300px] lg:w-full lg:h-[256px] object-cover'
            )}
          />
        </Box>
        <Box className={CA('py-0 lg:py-0 px-0 lg:px-16 pt-6 w-full flex', reverse ? 'pt-0 lg:pt-[0]' : 'lg:pb-[0]')}>
          <TwoRowFlex rootClass={CA('items-start px-0 py-0 lg:gap-12', rootClass)}>
            <Typography variant={titleVariant} className={CA(titleClass, 'w-full lg:w-[calc(50%-3rem)] font-semibold')}>
              {typeof title === 'string' ? HTMLReactParser(title) : title}
            </Typography>
            <Box className="w-full lg:w-[calc(50%-3rem)]">
              <Typography
                variant="body1"
                component="div"
                className={CA(
                  'mt-6 mb-6 lg:mb-6 font-semibold md:text-[1.7vw] mob:text-[4vw] leading-[1.25] text-black',
                  descriptionClass
                )}
              >
                {description && HTMLReactParser(description)}
              </Typography>
              {buttonText && (
                <OriginButton handleClick={buttonClick1} variant={buttonVariant} buttonText={buttonText} />
              )}
              {buttonText2 && (
                <Typography className="text-sm md:text-base" variant="body1">
                  {buttonText2}
                </Typography>
              )}
            </Box>
          </TwoRowFlex>
        </Box>
      </TwoColFlex>
    );
  }

  if (variant === 'hero') {
    return (
      <Box className={CA('flex flex-wrap p-6 rounded-3xl lg:rounded-[64px]', rootClass)}>
        <Box className={CA('w-full lg:w-1/2', reverse ? 'mt-5 lg:mt-0 ps-0' : 'pe-0', imageContainerClass)}>
          {/* <Image
          src={imageSrc || ''}
          width={imageWidth}
          height={imageHeight}
          alt={imageAlt || ''}
          className={CA(
            'rounded-[10px] lg:rounded-[46px] w-full sm:h-[200px] md:h-[300px] lg:w-auto lg:h-auto',
            imageClass
          )}
        /> */}
        </Box>
        <Box
          className={CA(
            'px-0 lg:px-0 py-0 lg:py-16 pt-6 w-full lg:w-1/2',
            reverse ? 'ps-0 lg:ps-[100px]' : 'lg:pe-[100px]',
            titleContainerClass
          )}
        >
          <Typography variant={titleVariant} className={CA(titleClass, 'font-semibold')}>
            {typeof title === 'string' ? HTMLReactParser(title) : title}
          </Typography>

          <Typography
            variant="body1"
            component="div"
            className={CA(
              'lg:my-6 mt-6 mb-6 font-semibold md:text-[1.7vw] mob:text-[4vw] leading-[1.25] text-black',
              descriptionClass
            )}
          >
            {description && HTMLReactParser(description)}
          </Typography>

          <OriginButton
            handleClick={buttonClick1}
            variant={buttonVariant}
            buttonText={buttonText}
            className="mt-4 mx-auto w-fit"
          />

          {buttonText2 && (
            <Typography className="text-sm md:text-base mt-4" variant="body1">
              {buttonText2}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }
  return null;
};

export default SideBySide;

const TwoColFlex = ({
  children,
  reverse,
  rootClass
}: {
  children: ReactNode;
  reverse?: boolean;
  rootClass: string;
}) => {
  return (
    <Box
      className={CA(
        rootClass,
        'flex flex-wrap p-4 md:p-6 rounded-3xl lg:rounded-[64px]',
        reverse ? 'lg:flex-col-reverse' : 'lg:flex-col'
      )}
    >
      {children}
    </Box>
  );
};
const TwoRowFlex = ({
  children,
  reverse = false,
  rootClass
}: {
  children: ReactNode;
  reverse?: boolean;
  rootClass: string;
}) => {
  return (
    <Box
      className={CA(
        'flex flex-wrap p-4 md:p-6 rounded-3xl lg:rounded-[64px]',
        reverse ? 'md:flex-row-reverse' : 'md:flex-row',
        rootClass
      )}
    >
      {children}
    </Box>
  );
};
