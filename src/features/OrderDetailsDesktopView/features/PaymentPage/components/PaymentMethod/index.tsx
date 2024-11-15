import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
// import { useAtom } from 'jotai';
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

import { orderDetailsAtom } from "../../../../context/atoms";
import { editOrderAtom } from "../../../EditOrder/context/atoms";
import getEditCartTotal from "../../../EditOrder/utils/getEditCartTotal";
import Arrow from "../../assets/arrow.svg";
import Cards from "../../assets/cards.svg";
import NetBanking from "../../assets/netBanking.svg";
import PayLater from "../../assets/paylater.svg";
import Cash from "../../assets/payOnDelivery.svg";
import UPI from "../../assets/upi.svg";
import { FailOrSuccess, failOrSuccess } from "../../context/atoms";
import { editOrderService } from "../../services/editOrder";

const PaymentMethod = () => {
  const razKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
  const [editOrder] = useAtom(editOrderAtom);
  const [order] = useAtom(orderDetailsAtom);

  const [, setFailOrSuccess] = useAtom(failOrSuccess);
  const router = useRouter();
  const onSuccess = () => {
    window.location.reload();
    setFailOrSuccess(FailOrSuccess.SUCCESS);
  };
  const onFailure = () => {
    setFailOrSuccess(FailOrSuccess.FAIL);
  };

  const total = React.useMemo(getEditCartTotal(editOrder), [
    editOrder.orderItems,
  ]);

  const toPay = React.useMemo(() => {
    return Number(total) - Number(order?.data?.total);
  }, [order, editOrder.orderItems]);

  const editOrderOnClick = async (paymentMethodPrefill: string) => {
    const payload: any = {
      id: order.data?.order_id,
      body: {
        items: editOrder.orderItems.map((item: any) => {
          return {
            item_code: item.item_code,
            uom: item.uom.map((uomItem: any) => ({
              variant_id: uomItem.variant_id,
              qty: uomItem.cart_quantity,
              ripeness_type: uomItem?.ripeness_type,
            })),
          };
        }),
        payment_method: "razorpay",
        sub_payment_method: paymentMethodPrefill,
        sub_total: toPay,
        tax: 0,
        total: toPay,
      },
    };
    return editOrderService(payload);
  };

  const onClick = (paymentMethodPrefill: string) => async () => {
    try {
      const editedOrder = await editOrderOnClick(paymentMethodPrefill);

      const { razorpay_order_id } = editedOrder.data;

      const razorpayOptions = {
        key: razKey,
        amount: String(toPay),
        currency: "INR",
        name: "Madras Mandi",
        description: "Madras Mandi",
        prefill: {
          name: "name",
          email: "email",
          contact: "9999999999",
          method: paymentMethodPrefill,
        },
        order_id: razorpay_order_id,
        handler() {
          onSuccess();
          setTimeout(() => {
            router.push(`/home/orders/${order.data?.order_id}`);
          }, 500);
        },
        modal: {
          ondismiss() {
            onFailure();
          },
        },
        theme: {
          color: "#EAE5CF",
        },
      };

      // @ts-ignore
      const razorpayInstance = new Razorpay(razorpayOptions);
      razorpayInstance.open();
    } catch (err) {
      console.error(err);
    }
  };

  const renderMethod = (
    title: string,
    img: any,
    paymentPrefill: string,
    description = ""
  ) => {
    return (
      <Box
        className="payment-method-list-item"
        sx={{
          borderRadius: "10px",
          backgroundColor: "#FFF6DE",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 1,
          cursor: "pointer",
          border: "1px solid #FFF6DE",
          minHeight: 62,
          "&:hover": {
            border: "1px solid #00855B",
          },
        }}
        onClick={onClick(paymentPrefill)}
      >
        <Box
          className="payment-method-name"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Box
            component="figure"
            sx={{
              margin: 0,
              width: 75,
              height: 42,
              backgroundColor: "#FFFEFA",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
            }}
          >
            <img src={img} alt={title?.toLowerCase()} />
          </Box>
          <Box
            className="payment-method-info"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <Typography variant="body2" component="h5">
              {title}
            </Typography>
            {description && (
              <Typography
                variant="caption"
                component="small"
                sx={{
                  fontWeight: "normal",
                  display: "block",
                  color: "#737373",
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          component="figure"
          sx={{
            flexShrink: 0,
            width: 12,
            height: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 0,
          }}
        >
          <Image src={Arrow} alt="Arrow" />
        </Box>
      </Box>
    );
  };
  return (
    <Box
      className="payment-method"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        borderTop: "1px solid #EAE5CF",
        marginTop: "1.25rem",
        paddingTop: "1.25rem",
      }}
    >
      <Typography
        variant="body2"
        component="h5"
        sx={{ fontWeight: 700, textTransform: "uppercase" }}
      >
        Your Payment methods
      </Typography>
      <Box
        className="payment-method-list"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {renderMethod(
          "Pay Later",
          PayLater,
          "paylater",
          "At no extra charge - buy now & Pay later with available list of providers"
        )}
        {renderMethod("UPI Payment", UPI, "upi", "")}
        {renderMethod("Debit/Credit Card", Cards, "card", "")}
        {renderMethod(
          "Pay on Delivery",
          Cash,
          "cash",
          "Pay in cash or pay online when its delivered"
        )}
        {renderMethod("Net Banking", NetBanking, "netbanking", "")}
      </Box>
    </Box>
  );
};

export default PaymentMethod;
