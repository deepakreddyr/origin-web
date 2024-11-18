import { Box, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { orderDetailsAtom } from '../../context/atoms';
import { getOrderDetails } from '../../services/getOrderDetails';
import CancelOrderModal from '../CancelOrderPopUp';
import styles from './styles.module.css';
import { request } from '@/utilities/request';

const CancelOrderCounter = () => {
  const [cancelModal, setCancelModal] = useState(false);
  const router = useRouter();
  const { authToken } = router.query;
  const [orderDetails] = useAtom(orderDetailsAtom);
  const [, setOrderDetails] = useAtom(orderDetailsAtom);

  const [orderCancellationTime, setOrderCancellationTime] = useState<number>(
    orderDetails?.data?.order_cancellation_time || 0
  );

  const currentTime = Math.floor(Date.now() / 1000);
  const orderCreatedAt = orderDetails?.data?.order_created_at || 0;
  const elapsedTime = Math.max(0, currentTime - orderCreatedAt);
  const remainingTime = Math.max(0, orderCancellationTime - elapsedTime);
  useEffect(() => {
    const timer = setInterval(() => {
      setOrderCancellationTime((prevTime) => Math.max(0, prevTime - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [orderDetails]);

  const onConfirm = async () => {
    const id = orderDetails.data?.order_id;
    await request(`/api/v5/user/order-cancel/${id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
        'Delivery-Type': 'app',
        'MM-Device-Type': 'web',
        'MM-Build-Version': '1.0.1'
      }
    });
    setCancelModal(false);
    getOrderDetails(setOrderDetails, {
      authToken: String(authToken),
      id: String(id)
    });
  };

  const renderModal = () => {
    if (cancelModal)
      return (
        <CancelOrderModal
          isOpen={cancelModal}
          onClose={() => {
            setCancelModal(false);
          }}
          onConfirm={onConfirm}
        />
      );
    return <></>;
  };

  // if (remainingTime === 0) return <></>;

  return (
    <>
      <Box className={styles['cancel-container']} onClick={() => setCancelModal(true)}>
        <Typography className={styles['cancel-text']}>CANCEL ORDER</Typography>
        <Box className={styles['counter-container']}>
          <Typography className={styles['cancel-counter']}>
            {`${Math.floor(remainingTime / 60)
              .toString()
              .padStart(2, '0')}:${(remainingTime % 60).toString().padStart(2, '0')} sec`}
          </Typography>
        </Box>
      </Box>

      {renderModal()}
    </>
  );
};

export default CancelOrderCounter;
