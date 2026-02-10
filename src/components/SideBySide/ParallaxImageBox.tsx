// Parallax.tsx
import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import CA from 'classnames';
import { Parallax } from 'react-scroll-parallax';

type ParallaxProps = {
  topImageSrc: string;
  mainImageSrc: string;
  bottomImageSrc: string;
  topImageWidth: number;
  topImageHeight: number;
  mainImageWidth: number;
  mainImageHeight: number;
  bottomImageWidth: number;
  bottomImageHeight: number;
  imageAlt: string;
  topImageClass?: string;
  mainImageClass?: string;
  bottomImageClass?: string;
  topImageContainerClass?: string;
  bottomImageContainerClass?: string;
  parallaxSpeed?: number;
};

const ParallaxImageBox: React.FC<ParallaxProps> = ({
  topImageSrc,
  mainImageSrc,
  bottomImageSrc,
  topImageWidth,
  topImageHeight,
  mainImageWidth,
  mainImageHeight,
  bottomImageWidth,
  bottomImageHeight,
  imageAlt,
  topImageClass,
  mainImageClass,
  bottomImageClass,
  parallaxSpeed = 15,
  topImageContainerClass,
  bottomImageContainerClass
}) => {
  const speed = parallaxSpeed;
  return (
    <>
      {topImageSrc && (
        <Parallax speed={-speed} className={CA('relative', topImageContainerClass)}>
          <Image
            src={topImageSrc}
            width={topImageWidth}
            height={topImageHeight}
            alt={imageAlt}
            className={CA('rounded-[10px] object-cover', topImageClass)}
          />
        </Parallax>
      )}
      {mainImageSrc && (
        <Image
          src={mainImageSrc}
          width={mainImageWidth}
          height={mainImageHeight}
          alt={imageAlt}
          className={CA('rounded-[10px] md:aspect-[unset] object-cover', mainImageClass)}
        />
      )}
      {bottomImageSrc && (
        <Parallax speed={speed} className={CA('relative', bottomImageContainerClass)}>
          <Image
            src={bottomImageSrc}
            width={bottomImageWidth}
            height={bottomImageHeight}
            alt={imageAlt}
            className={CA('rounded-[10px] md:aspect-[unset] object-cover', bottomImageClass)}
          />
        </Parallax>
      )}
    </>
  );
};

export default ParallaxImageBox;
