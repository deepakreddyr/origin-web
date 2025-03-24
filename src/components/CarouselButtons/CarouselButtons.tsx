import React from 'react';
import { Box } from '@mui/material';
import { OriginCircleLeftArrow, OriginCircleRightArrow } from '../../Icons/OriginIcons';
import OriginButton from '../OriginButton';
import CA from 'classnames';

type CarouselButtonsProps = {
  leftButtonClass?: string;
  rightButtonClass?: string;
  width?: number;
  height?: number;
  gap?: number;
  classes?: {
    root?: string;
    button?: string;
  };
  leftClick: any;
  rightClick: any;
};

const CarouselButtons = (props: any) => {
  const {
    leftButtonClass,
    rightButtonClass,
    width = 53,
    height = 53,
    gap = 3,
    classes = {},
    leftClick,
    rightClick
  } = props;
  return (
    <Box className={CA('carouselButtons flex', `gap-${gap}`, classes.root)}>
      <OriginButton
        variant="iconOnly"
        classes={{
          iconButton: CA(rightButtonClass, classes.button, 'group')
        }}
        handleClick={leftClick}
      >
        <OriginCircleLeftArrow className="group-hover:scale-105 w-[3vw] mob:w-[8vw] mob:h-[8vw] h-[3vw] hover:bg-primary-100 rounded-full transition-transform" />
      </OriginButton>
      <OriginButton
        variant="iconOnly"
        classes={{
          iconButton: CA(leftButtonClass, classes.button, 'group')
        }}
        handleClick={rightClick}
      >
        <OriginCircleRightArrow className="group-hover:scale-105 w-[3vw] h-[3vw] mob:w-[8vw] mob:h-[8vw] hover:bg-primary-100 rounded-full transition-transform" />
      </OriginButton>
    </Box>
  );
};

export default CarouselButtons;
