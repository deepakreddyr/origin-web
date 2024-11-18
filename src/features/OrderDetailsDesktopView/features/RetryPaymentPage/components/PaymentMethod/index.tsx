import { Box, Typography } from '@mui/material';
import { useAtom } from 'jotai';
// import { useAtom } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import { orderDetailsAtom } from '../../../../context/atoms';
import Arrow from '../../assets/arrow.svg';
import Cards from '../../assets/cards.svg';
import NetBanking from '../../assets/netBanking.svg';
import PayLater from '../../assets/paylater.svg';
import UPI from '../../assets/upi.svg';
import { FailOrSuccess, failOrSuccess } from '../../context/atoms';
import { header, request } from '@/utilities/request';

const PaymentMethod = ({ toPay }: { toPay: number }) => {
  const razKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
  const [order] = useAtom(orderDetailsAtom);

  const [, setFailOrSuccess] = useAtom(failOrSuccess);
  const router = useRouter();
  const onSuccess = () => {
    setFailOrSuccess(FailOrSuccess.SUCCESS);
  };
  const onFailure = () => {
    setFailOrSuccess(FailOrSuccess.FAIL);
  };

  const onClick = (paymentMethodPrefill: string) => async () => {
    try {
      const orderResponse: any = await request(`/api/v1/user/payment/razorpay/init/order/${order.data?.order_id}`, {
        method: 'GET',
        headers: {
          Authorization: header(),
          Accept: 'application/json',
          'MM-Device-Type': 'web',
          'MM-Build-Version': '1.0.0'
        }
      });

      const razorpayOptions = {
        key: razKey,
        amount: orderResponse?.data?.amount_due,
        currency: 'INR',
        name: 'Madras Mandi',
        description: 'Madras Mandi',
        prefill: {
          name: 'name',
          email: 'email',
          contact: '9999999999',
          method: paymentMethodPrefill
        },
        order_id: orderResponse?.data?.id,
        handler() {
          onSuccess();
          setTimeout(() => {
            router.push(`/home/orders/${order.data?.order_id}`);
          }, 500);
        },
        modal: {
          ondismiss() {
            onFailure();
          }
        },
        theme: {
          color: '#EAE5CF'
        }
      };

      // @ts-ignore
      const razorpayInstance = new Razorpay(razorpayOptions);
      razorpayInstance.open();
    } catch (err) {
      console.error(err);
    }
  };

  const renderMethod = (title: string, img: any, paymentPrefill: string, description = '') => {
    return (
      <Box
        className="payment-method-list-item"
        sx={{
          borderRadius: '10px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 1.5,
          // margin: '0.8rem',
          cursor: 'pointer',
          border: '1px solid #F2EEE4',
          minHeight: 62,
          '&:hover': {
            border: '1px solid #00855B'
          }
        }}
        onClick={onClick(paymentPrefill)}
      >
        <Box className="payment-method-name" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="figure"
            sx={{
              margin: 0,
              width: 75,
              height: 42,
              backgroundColor: '#FFFEFA',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px'
            }}
          >
            <img src={img} alt={title?.toLowerCase()} />
          </Box>
          <Box
            className="payment-method-info"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
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
                  fontWeight: 'normal',
                  display: 'block',
                  color: '#737373'
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0
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
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        borderTop: '1px solid #F8F4E9',
        marginTop: '1.25rem',
        paddingTop: '1.25rem'
      }}
    >
      <Typography variant="body2" component="h5" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
        Payment methods
      </Typography>
      <Box
        className="payment-method-list"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          padding: '1rem',
          backgroundColor: 'rgba(242, 238, 228, 0.3)',
          border: '1px solid #F2EEE4',
          borderRadius: '16px'
        }}
      >
        {renderMethod(
          'Pay Later',
          PayLater,
          'paylater',
          'At no extra charge - buy now & Pay later with available list of providers'
        )}
        {renderMethod('UPI Payment', UPI, 'upi', '')}
        {renderMethod('Debit/Credit Card', Cards, 'card', '')}
        {/* {renderMethod(
          'Pay on Delivery',
          Cash,
          'cash',
          'Pay in cash or pay online when its delivered'
        )} */}
        {renderMethod('Net Banking', NetBanking, 'netbanking', '')}
      </Box>
    </Box>
  );
};

export default PaymentMethod;
