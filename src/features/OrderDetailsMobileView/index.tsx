import { Box, CircularProgress } from '@mui/material';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import React from 'react';

import AddressDetails from './components/AddressDetails';
import BillDetails from './components/BillDetails';
// import CancelOrderCounter from './components/CancelOrderCounter';
import EditOrderCounter from './components/EditOrderCounter';
import OrderDetails from './components/OrderDetails';
import OrderStatusImage from './components/OrderStatusImage';
import OrderStatusText from './components/OrderStatusText';
import PaymentPending from './components/PaymentPending';
import Refund from './components/Refund';
import { orderDetailsAtom } from './context/atoms';
import { getOrderDetails } from './services/getOrderDetails';
import styles from './style.module.css';

const OrderDetailsMobileView = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useAtom(orderDetailsAtom);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const { type, authToken, id } = router.query;
    if (type && authToken && id) {
      setIsLoading(true);
      getOrderDetails(setOrderDetails, {
        authToken: String(authToken),
        id: String(id)
      }).finally(() => {
        setIsLoading(false);
      });
    }

    const interval = setInterval(() => {
      router.reload();
    }, 40000);

    return () => clearInterval(interval);
  }, [router.query]);

  const renderContent = () => {
    return (
      <>
        <Box
          sx={{
            fontFamily: 'Sofia Pro'
          }}
        >
          <OrderStatusImage />
          <OrderStatusText />
        </Box>

        <PaymentPending orderId={orderDetails?.data?.order_id} total={orderDetails?.data?.total} />

        {!!orderDetails.data?.is_edit && !!orderDetails.data?.is_order_editable && (
          <EditOrderCounter
            orderId={orderDetails.data?.order_id}
            orderCreatedAt={orderDetails.data?.order_created_at}
            editOrderTimeInSeconds={orderDetails.data?.edit_order_time}
          />
        )}
        <OrderDetails />
        <BillDetails />
        {!!orderDetails.data?.refunds && <Refund />}
        {/* 
    {lastStatusMessage !== 'Cancelled by user' &&
      !!orderDetails?.data?.order_cancellation_time &&
      !!orderDetails.data?.is_order_editable && <CancelOrderCounter />} */}
        <AddressDetails />
      </>
    );
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <Box className={styles.container}>{renderContent()}</Box>;
};

export default OrderDetailsMobileView;
