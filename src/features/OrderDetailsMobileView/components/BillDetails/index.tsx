import { Box, Divider, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import React from 'react';

import { orderDetailsAtom } from '../../context/atoms';
import Bills from '../Bills';
import { StyledHeadingTypography } from '../Styled/StyledHeadingTypography';

const BillDetails = () => {
  const orderDetails = useAtomValue(orderDetailsAtom);
  const { data: item } = orderDetails;

  const totalPayableAmount = React.useMemo(() => {
    if (item?.bills !== undefined) {
      const billsLength: number = item.bills.length as number;

      if (Boolean(item) && Boolean(item?.bills) && Array.isArray(item?.bills) && billsLength > 0) {
        let payableAmount = 0;
        item?.bills.forEach((bill) => {
          if (bill.payment_status === 'complete') {
            // Total Bill
            payableAmount += bill.total;

            // Wallet spent deduction
            if (bill.wallet_spent) {
              payableAmount -= bill.wallet_spent;
            }

            // Rewards spent deduction
            if (bill.reward_spent) {
              payableAmount -= bill.reward_spent;
            }
          }
          if (bill.payment_status !== 'complete') {
            // Total Bill
            payableAmount += bill.total;

            // Wallet spent deduction
            if (bill.wallet_spent) {
              payableAmount -= bill.wallet_spent;
            }

            // Rewards spent deduction
            if (bill.reward_spent) {
              payableAmount -= bill.reward_spent;
            }
          }
        }, []);
        return payableAmount;
      }
    }

    return 0;
  }, [item]);

  const totalSavings = React.useMemo(() => {
    return orderDetails.data?.items.reduce((savings, ite) => {
      const itemSavings = ite.ordered_uoms.reduce((uomSavings, uom) => {
        return uomSavings + (uom.market_price_sub_total - uom.subtotal);
      }, 0);
      return savings + itemSavings;
    }, 0);
  }, [orderDetails]);

  const renderPaymentText = () => {
    if (item?.payment_method === 'Cash' || item?.payment_status === 'failed' || item?.payment_status === 'pending') {
      return (
        <Typography
          sx={{
            fontFamily: 'Sofia Pro',
            fontWeight: '600',
            fontSize: '12px',
            color: '#231F20'
          }}
        >
          To Pay
        </Typography>
      );
    }
    if (item?.payment_status === 'complete' && item?.payment_method === 'Razorpay') {
      return (
        <Typography
          sx={{
            fontFamily: 'Sofia Pro',
            fontWeight: '600',
            fontSize: '12px',
            color: '#231F20'
          }}
        >
          Paid Online
        </Typography>
      );
    }

    return null;
  };

  const renderPayment = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        {renderPaymentText()}
        <Typography
          sx={{
            fontFamily: 'Sofia Pro',
            fontWeight: '500',
            fontSize: '12px'
          }}
        >
          ₹{totalPayableAmount}
          {/* ₹ {orderDetails?.data?.total} */}
        </Typography>
      </Box>
    );
  };

  const renderBillSection = (title: string, value: string, isGreen: boolean = false, canRender: boolean = true) => {
    if (!canRender) return <></>;
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          color: isGreen ? '#00855B' : '#231F20'
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Sofia Pro',
            fontWeight: '500',
            fontSize: '12px'
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Sofia Pro',
            fontWeight: '500',
            fontSize: '12px'
          }}
        >
          {value}
        </Typography>
      </Box>
    );
  };

  const renderBills = () => {
    const totalMarketPrice = orderDetails.data?.total_market_price ?? 0;
    const subTotal = orderDetails.data?.sub_total ?? 0;
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {orderDetails.data?.bills
          .filter((bill) => bill.payment_method !== 'Refund')
          .map((bill) => (
            <Box
              key={bill.bill_id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {totalMarketPrice > subTotal
                ? renderBillSection(`Item Total`, `₹${totalMarketPrice}`)
                : renderBillSection(`Items Total`, `₹${bill.sub_total}`)}

              {(!!bill.reward_spent || !!totalSavings || !!bill.delivery_fee || !!orderDetails.data?.coupon) && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                  }}
                >
                  <Divider sx={{ width: '100%' }} />
                </Box>
              )}

              {renderBillSection(`Rewards`, `-₹${bill.reward_spent}`, true, !!bill.reward_spent)}
              {renderBillSection(`Savings`, `- ₹${totalSavings}`, true, !!totalSavings)}
              {renderBillSection(`Delivery Fee`, `₹${bill.delivery_fee}`, true, !!bill.delivery_fee)}
              {renderBillSection(
                `Coupon Applied ${orderDetails.data?.coupon.code}`,
                `- ₹${bill.discount}`,
                true,
                !!orderDetails.data?.coupon
              )}
            </Box>
          ))}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: 'calc(100% + 16px + 16px)',
            marginLeft: '-16px'
          }}
        >
          <Divider sx={{ width: '100%' }} />
        </Box>

        {renderPayment()}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(242, 238, 228, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
        border: '2px solid #F2EEE4',
        margin: '1rem',
        borderRadius: '16px',
        padding: '16px'
      }}
    >
      <StyledHeadingTypography
        sx={{
          marginBottom: '14px'
        }}
      >
        Bill Details
      </StyledHeadingTypography>
      {(orderDetails?.data?.bills.filter((bill) => bill.payment_method !== 'Refund') || []).length > 1 ? (
        <Bills />
      ) : (
        renderBills()
      )}

      {/* <Divider
        sx={{
          width: '93%',
          marginLeft: '0.6rem',
          marginBottom: '1rem',
        }}
      /> */}
    </Box>
  );
};

export default BillDetails;
