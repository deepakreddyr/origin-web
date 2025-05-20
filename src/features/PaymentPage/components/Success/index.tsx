import { Box, Typography } from '@mui/material';
import Lottie from 'lottie-react';

import OrderSuccessJson from '../../../../assets/json/Success.json';

const Success = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 'auto'
      }}
    >
      <Lottie animationData={OrderSuccessJson} loop autoplay style={{ height: 200, width: 200 }} />
      <Typography sx={{ fontSize: '20px', fontWeight: '500' }}>Thanks For Your Order</Typography>
    </Box>
  );
};

export default Success;
