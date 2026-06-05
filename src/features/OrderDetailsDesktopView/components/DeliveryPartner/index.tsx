import { Box, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import Image from 'next/image';

import Call from '../../assets/driverCall.svg';
import { orderDetailsAtom } from '../../context/atoms';
import styles from './styles.module.css';

const DeliveryPartner = () => {
  const orderDetails = useAtomValue(orderDetailsAtom);

  return (
    <Box className={styles['payment-pending-container']}>
      <Box className={styles['payment-pending-details']}>
        <Typography className={styles['payment-pending-heading']}>YOUR DELIVERY PARTNER</Typography>
        <Typography className={styles['payment-pending-text']}>
          {orderDetails.data?.lbnp?.agent_name || orderDetails.data?.driver?.name}
        </Typography>
        <Typography className={styles['payment-pending']}>
          {orderDetails.data?.lbnp?.agent_phone || orderDetails.data?.driver?.phone}
        </Typography>
      </Box>
      <Box className={styles['payment-pending-counter']}>
        <Image src={Call} alt="Call" className={styles['call-img']} />
      </Box>
    </Box>
  );
};

export default DeliveryPartner;
