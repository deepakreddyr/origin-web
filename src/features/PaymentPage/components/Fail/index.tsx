import { Box, Button } from '@mui/material';
import { useAtom } from 'jotai';
import Lottie from 'lottie-react';

import OrderFailedJson from '../../../../assets/json/failure.json';
import { razorPayObjectAtom } from '../../context/atoms';

const Fail = () => {
  const [razorPayObject, setRazorPayObject] = useAtom(razorPayObjectAtom);

  const onClick = () => {
    try {
      if (!razorPayObject) return;
      // @ts-ignore
      const razorpayInstance = new Razorpay(razorPayObject);
      razorpayInstance.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 'auto'
      }}
    >
      <Lottie
        animationData={OrderFailedJson}
        loop
        autoplay
        style={{ height: 200, width: 200 }}
      />
      <Button
        onClick={onClick}
        sx={{ fontSize: '20px', fontWeight: '500' }}
      >
        Retry Payment
      </Button>
    </Box>
  );
};

export default Fail;
