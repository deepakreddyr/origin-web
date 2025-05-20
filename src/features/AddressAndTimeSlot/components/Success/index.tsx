import { Box, Typography } from '@mui/material';
import Lottie from 'lottie-react';

import OrderSuccessJson from '../../../../assets/json/Success.json';

const Success = () => {
  return (
    <Box>
      <Lottie animationData={OrderSuccessJson} loop={true} autoplay={true} style={{ width: 200, height: 200 }} />
      <Typography>Thanks For Your Order</Typography>
    </Box>
  );
};

export default Success;
