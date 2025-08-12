import { Box, CircularProgress, Grid } from "@mui/material";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React from "react";

import AddressDetails from "./components/AddressDetails";
import BillDetails from "./components/BillDetails";
import DeliveryPartner from "./components/DeliveryPartner";
// import EditOrderCounter from './components/EditOrderCounter';
import OrderStatusHeader from "./components/Header";
// import CancelOrderCounter from './components/CancelOrderCounter';
import OrderDetails from "./components/OrderDetails";
import OrderStatusImage from "./components/OrderStatusImage";
import OrderStatusText from "./components/OrderStatusText";
import PaymentPending from "./components/PaymentPending";
import { orderDetailsAtom } from "./context/atoms";
import { getOrderDetails } from "./services/getOrderDetails";
import EditOrderCounter from "./components/EditOrderCounter";
import RefundDetails from "./components/RefundDetails";

const OrderDetailsDeskTopView = () => {
  const router = useRouter();
  const [order, setOrderDetails] = useAtom(orderDetailsAtom);
  React.useEffect(() => {
    const { id } = router.query;
    if (id) {
      getOrderDetails(setOrderDetails, {
        id: String(id),
      });
    }
  }, [router.query]);

  if (order.loading) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        margin: "0 4rem 0 4rem",
      }}
    >
      {order.data?.order_code && (
        <OrderStatusHeader order_code={order.data.order_code} />
      )}
      <Grid
        container
        sx={{
          background: "none",
        }}
      >
        <Grid sm={4} xs={12}>
          <Box
            sx={{
              margin: "1rem",
              display: "flex",
              flexDirection: "column",
              background: "none",
              width: "100%",
            }}
          >
            <OrderStatusImage />
            <OrderStatusText />
            <BillDetails />
            <AddressDetails />

            {/* <CancelOrderCounter /> */}
            {!!order.data?.refunds && !!order?.data?.refunds?.amount && (
              <RefundDetails amount={order?.data?.refunds?.amount} />
            )}
          </Box>
        </Grid>
        <Grid sm={8} xs={12}>
          <Box
            sx={{
              margin: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {!!order.data?.driver && <DeliveryPartner />}
            {!!order.data?.is_edit && !!order.data?.is_order_editable && (
              <EditOrderCounter
                orderId={order.data?.order_code}
                orderCreatedAt={order.data?.order_created_at}
                editOrderTimeInSeconds={order.data?.edit_order_time}
              />
            )}
            {/* <DeliveryPartnerDetails /> */}
            {order.data?.payment_status === "pending" && <PaymentPending />}
            <OrderDetails />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetailsDeskTopView;
