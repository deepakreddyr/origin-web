import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

import NoDataIcon from '../assets/empty-07.svg';

const NoData = () => {
  return (
    <Box
      className="no-data"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 2,
        paddingTop: '15rem',
        paddingBottom: '20px',
        margin: 'auto'
      }}
    >
      <Image src={NoDataIcon} alt="" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Looks Empty!
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.60)' }}>
          Try searching for some other Items
        </Typography>
      </Box>
    </Box>
  );
};

export default NoData;
