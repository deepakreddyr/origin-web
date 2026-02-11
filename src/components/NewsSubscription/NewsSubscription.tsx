import { Box, Grid, InputBase, Typography } from '@mui/material';
import React from 'react';
import { OriginCircleRightArrow } from '../../Icons/OriginIcons';
import OriginButton from '../OriginButton';

const NewsletterSubscription = () => {
  return (
    <>
      <Typography variant="h3" className="text-white sm:leading-normal">
        Stay fresh.
      </Typography>
      <Typography variant="body1" className="pt-6 sm:pt-10 pb-2 sm:pb-3 text-primary-100 leading-[22px]">
        Subscribe to Origin updates.
      </Typography>
      <Box className="relative w-full max-w-full sm:max-w-md">
        <InputBase
          placeholder="Enter your email here*"
          required
          aria-required
          className="bg-primary-100 px-[25px] py-4 rounded-full w-full font-medium text-black text-lg pe-16"
          inputProps={{ 'aria-label': 'search products' }}
        />
        <OriginButton
          variant="iconOnly"
          handleClick={() => {}}
          classes={{
            iconButton: 'right-4 inset-y-0 absolute flex rounded-full items-center w-min h-min -translate-y-1/2 top-1/2'
          }}
        >
          <Box className="right-0 inset-y-0 absolut pe-0">
            <OriginCircleRightArrow
              className="flex items-center bg-black rounded-full w-10 h-10"
              sx={{
                'path:nth-of-type(2)': {
                  fill: '#fac510'
                }
              }}
            />
          </Box>
        </OriginButton>
      </Box>
    </>
  );
};

export default NewsletterSubscription;
