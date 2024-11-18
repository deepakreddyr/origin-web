import { Box, Typography } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import { checkoutAPI, isAddressAndTimeSlotIsOpen } from '../../../AddressAndTimeSlot/context/atoms';
import { cartAtom, cartItems, checkoutExtraDetailsAtom } from '../../../CartPage/context/atoms';
import { isCouponApplied } from '../../../CouponPage/context/atoms';
import Arrow from '../../assets/arrow.svg';
import Cards from '../../assets/cards.svg';
import NetBanking from '../../assets/netBanking.svg';
import PayLater from '../../assets/paylater.svg';
import Cash from '../../assets/payOnDelivery.svg';
import UPI from '../../assets/upi.svg';
import { FailOrSuccess, failOrSuccess, isPaymentIsOpen, PaymentPrefill, razorPayObjectAtom } from '../../context/atoms';
import useCartCalculation from '../../../CartPage/hooks/useCartCalculation';
import { StyledHeadingTypography } from '@/features/OrderDetailsMobileView/components/Styled/StyledHeadingTypography';
import usePaymentHook from '../../hooks/usePaymentHook';

const PaymentMethod = () => {
  const [checkoutDetails] = useAtom(checkoutAPI);
  const [isOpen, setIsOpen] = useAtom(isPaymentIsOpen);
  const [, setIsAddressAndTimeslotOpen] = useAtom(isAddressAndTimeSlotIsOpen);
  const { setPaymentPrefill } = usePaymentHook();

  const onClick = (paymentPrefill: PaymentPrefill) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setPaymentPrefill(paymentPrefill);
    setIsAddressAndTimeslotOpen(true);
    setIsOpen(false);
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
        onClick={onClick(paymentPrefill as PaymentPrefill)}
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
            <Image src={img} alt={title?.toLowerCase()} />
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
        <StyledHeadingTypography variant="body2" sx={{ fontWeight: 700 }}>
          Payment methods
        </StyledHeadingTypography>
        {renderMethod(
          'Pay Later',
          PayLater,
          'paylater',
          'At no extra charge - buy now & Pay later with available list of providers'
        )}
        {renderMethod('UPI Payment', UPI, 'upi', '')}
        {renderMethod('Debit/Credit Card', Cards, 'card', '')}
        {!!checkoutDetails.data?.enable_cod &&
          renderMethod('Pay on Delivery', Cash, 'cash', 'Pay in cash or pay online when its delivered')}
        {renderMethod('Net Banking', NetBanking, 'netbanking', '')}
      </Box>
    </Box>
  );
};

export default PaymentMethod;
