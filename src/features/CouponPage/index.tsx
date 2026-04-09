import { CheckCircle } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import React from 'react';

import CartSidebarLayout from '../../components/CartLayout/CartSidebarLayout';
import { cartItems } from '../CartPage/context/atoms';
import useCartCalculation from '../CartPage/hooks/useCartCalculation';
import IndividualCoupon from './components/Coupon';
// import { isCartPageIsOpen } from '../CartPage/context/atoms';
import { couponList, isCouponApplied, isCouponPageIsOpen } from './context/atoms';
import { getCoupon } from './services/getCoupon';
import { validateCoupon } from './services/validateCoupon';
import { calculateCouponDiscount } from '@/utilities/utils';
import type CouponI from './types/CouponI';
import EmptyCoupon from './components/EmptyCoupon';

const Coupon = () => {
  const [isOpen, setIsOpen] = useAtom(isCouponPageIsOpen);
  const [cart] = useAtom(cartItems);
  const [coupString, setCoupString] = React.useState('');
  const [coupons, setCoupons] = useAtom(couponList);
  const [appliedCoupon, setAppliedCoupon] = useAtom(isCouponApplied);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { getCouponDetails } = useCartCalculation();

  const onApply = async () => {
    const hasFreeItem = cart?.some((e: any) => e.isFreeItem);
    if (hasFreeItem) {
      alert('Please remove free items to apply coupon');
      return;
    }
    const couponString: string = coupString;
    try {
      const payload = {
        code: couponString,
        items: cart
          .map((e: any) => {
            const itemDetails = {
              item_code: e.item_code,
              uom: e.uom.map((uomItem: any) => {
                if (uomItem.is_not_discounted) return null;
                return {
                  variant_id: uomItem.variant_id,
                  qty: uomItem.qty
                };
              })
            };

            if (itemDetails.uom.length === 0) {
              return null;
            }
            return itemDetails;
          })
          .filter((u) => !!u)
      };
      const res = await validateCoupon(payload, setAppliedCoupon);
      if (res) setIsOpen(false);
    } catch (e) {
      //
    }
  };

  const getTotalCallback = (): number => {
    if (cart && Array.isArray(cart)) {
      // Calculate the total price
      let totalPrice: number = 0;

      cart.forEach((item: any) => {
        item.uom.forEach((uom: any) => {
          if (!uom.is_not_discounted) {
            totalPrice += uom.qty * uom.price;
          }
        });
      });

      return totalPrice;
    }
    return 0;
  };

  const total = React.useCallback(getTotalCallback, [cart]);

  React.useEffect(() => {
    const subTotal = total();
    if (subTotal > 0) getCoupon(subTotal, setCoupons);
  }, [cart]);

  const renderManualCoupon = () => {
    return (
      <Box
        sx={{
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          input: {
            borderRadius: '24px 0 0 24px',
            backgroundColor: '#F8F4E9',
            boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.04)',
            height: 46,
            border: 0,
            width: '100%',
            paddingLeft: '30px',
            fontSize: 14,
            fontWeight: '500',
            '&:focus': {
              outline: 'none',
              boxShadow: 'none'
            }
          }
        }}
      >
        <input
          type="text"
          value={coupString}
          onChange={(e) => setCoupString(String(e?.target?.value))}
          placeholder="Enter promo code"
        />
        <button
          style={{
            backgroundColor: '#F8F4E9',
            color: '#00855b',
            padding: '0.9rem',
            borderRadius: '0px 24px 24px 0',
            cursor: 'pointer',
            border: 'none'
          }}
          onClick={() => onApply()}
        >
          APPLY
        </button>
      </Box>
    );
  };

  const renderCoupon = () => {
    // Sort coupons by discount value descending
    const sortedCoupons = [...(coupons.coupons || [])].sort((a, b) => {
      const discountA = calculateCouponDiscount(total(), a) || 0;
      const discountB = calculateCouponDiscount(total(), b) || 0;
      return discountB - discountA;
    });

    return sortedCoupons.map((coupon: CouponI) => (
      <IndividualCoupon
        key={coupon.id}
        coupon={coupon}
        onApplied={() => {
          setIsSuccess(true);
        }}
      />
    ));
  };

  const renderCouponAppliedSuccessfully = () => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: '100%',
          margin: 'auto',
          gap: '1rem'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CheckCircle sx={{ fontSize: 40, color: 'green' }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Coupon applied successfully!
          </Typography>
        </Box>
        <Typography variant="body1">
          Coupon used <b>{`"${getCouponDetails()?.code}"`}</b>. You save {getCouponDetails()?.offer} on this order.
        </Typography>
        <Button
          variant="outlined"
          color="success"
          onClick={() => {
            setIsSuccess(false);
            setIsOpen(false);
          }}
        >
          <Typography
            sx={{
              pl: '0.5rem',
              pr: '0.5rem'
            }}
          >
            Woohoo! Thanks
          </Typography>
        </Button>
      </Box>
    );
  };
  const renderCouponContent = () => {
    if (coupons.coupons?.length !== 0) {
      return (
        <>
          {renderManualCoupon()}
          <Typography variant="body1" component="h5" sx={{ color: '#747474' }}>
            Available Coupons
          </Typography>
          {renderCoupon()}
        </>
      );
    } else return <EmptyCoupon />;
  };

  return (
    <CartSidebarLayout
      isOpen={isOpen}
      title="Apply Coupon"
      onClose={() => {
        setIsOpen(false);
      }}
      isBackEnable
      onBack={() => {
        setIsOpen(false);
      }}
    >
      {isSuccess ? renderCouponAppliedSuccessfully() : renderCouponContent()}
      {/* {!!coupons.coupons ? renderCouponContent() : <EmptyCoupon />} */}
    </CartSidebarLayout>
  );
};

export default Coupon;
