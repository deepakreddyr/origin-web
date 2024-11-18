import { Box, Typography } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import { cartAtom, cartItems, checkoutExtraDetailsAtom } from '../../../CartPage/context/atoms';
import { isCouponApplied } from '../../../CouponPage/context/atoms';
import Arrow from '../../assets/arrow.svg';
import Cards from '../../assets/cards.svg';
import NetBanking from '../../assets/netBanking.svg';
import PayLater from '../../assets/paylater.svg';
import Cash from '../../assets/payOnDelivery.svg';
import UPI from '../../assets/upi.svg';
import { FailOrSuccess, failOrSuccess, razorPayObjectAtom } from '../../context/atoms';
import { header, request } from '@/utilities/request';
// import { checkoutAPI } from '../../context/atoms';

const PaymentMethod = () => {
  // const [checkout, setCheckout] = useAtom(checkoutAPI);
  const razKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
  const [cartItemsAtom] = useAtom(cartItems);
  const [appliedCoupon] = useAtom(isCouponApplied);
  const [, setFailOrSuccess] = useAtom(failOrSuccess);
  const router = useRouter();
  const [, setRazorPayObject] = useAtom(razorPayObjectAtom);
  const [cart] = useAtom(cartAtom);
  const [checkoutExtraDetails] = useAtom(checkoutExtraDetailsAtom);
  const onSuccess = (orderId?: number) => {
    setRazorPayObject(null);
    setFailOrSuccess(FailOrSuccess.SUCCESS);
    if (orderId) {
      setTimeout(() => {
        router.push(`/home/orders/${orderId}`);
      }, 500);
    }
  };
  const onFailure = () => {
    setFailOrSuccess(FailOrSuccess.FAIL);
  };

  const getTotalCallback = () => {
    if (cartItemsAtom && Array.isArray(cartItemsAtom)) {
      // Calculate the total price
      let totalPrice: number = 0;

      cartItemsAtom.forEach((item: any) => {
        item.uom.forEach((uom: any) => {
          totalPrice += uom.qty * uom.price;
        });
      });

      return totalPrice;
    }
    return 0;
  };

  const getDiscountCallback = () => {
    let total = 0;

    if (appliedCoupon.isApplied && appliedCoupon.coupon) {
      switch (appliedCoupon.coupon.discount_type) {
        case 'fixed': {
          total += appliedCoupon.coupon.discount;
          break;
        }
        case 'percentage': {
          total += (appliedCoupon.coupon.discount * total) / 100;
          break;
        }
        default:
          break;
      }
    }

    if (checkoutExtraDetails.isRewardsEnabledInCart && cart.cart?.reward_enabled && cart.cart?.max_redeemable_rewards) {
      total -= cart.cart.max_redeemable_rewards;
    }

    return total;
  };

  const total = React.useMemo(() => {
    return getTotalCallback() - getDiscountCallback();
  }, [cartItemsAtom, appliedCoupon, checkoutExtraDetails, cart]);

  const subTotal = React.useMemo(getTotalCallback, [cartItemsAtom]);

  const onClick = (paymentMethodPrefill: string) => async () => {
    try {
      const isCash = paymentMethodPrefill.toLowerCase() === 'cash';
      const payload: any = {
        items:
          cartItemsAtom?.map((e) => ({
            item_code: e.item_code,
            uom: e.uom
              .map((uomItem: any) => {
                return {
                  variant_id: uomItem.variant_id,
                  qty: uomItem.qty
                };
              })
              .filter((uomItem: any) => uomItem.qty !== 0)
          })) || [],
        delivery_fee: 0,
        delivery_type: 'normal',
        individual_package_enabled: false,
        delivery_date: 1691785531,
        sub_total: subTotal,
        tax: 0,
        total,
        payment_method: isCash ? paymentMethodPrefill : 'razorpay',
        time_slot_id: cart.cartValues?.timeSlotId,
        uuid: '18925c07-21f7-4af7-96bc-249479e5f92b',
        is_exotel_enabled: true,
        instructions: checkoutExtraDetails.instructions,
        meta: {
          device_type: 'web'
        }
      };

      if (!isCash) {
        payload.sub_payment_method = paymentMethodPrefill;
      }

      if (appliedCoupon.isApplied && appliedCoupon.coupon) {
        if (appliedCoupon.coupon.id) {
          payload.coupon_id = appliedCoupon.coupon.id;
        }
      }

      const orderResponse: any = await request(`/api/v3/user/orders`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          Authorization: header(),
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      if (isCash) {
        onSuccess(orderResponse?.data.order_id);
        return;
      }

      const razorpayOptions = {
        key: razKey,
        amount: String(total),
        currency: 'INR',
        name: 'Madras Mandi',
        description: 'Madras Mandi',
        prefill: {
          name: 'name',
          email: 'email',
          contact: '9999999999',
          method: paymentMethodPrefill
        },
        order_id: orderResponse?.data?.razorpay_order_id,
        handler() {
          onSuccess(orderResponse?.data.order_id);
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

      setRazorPayObject(razorpayOptions);

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
          backgroundColor: '#FFF6DE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 1,
          cursor: 'pointer',
          border: '1px solid #FFF6DE',
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
        borderTop: '1px solid #EAE5CF',
        marginTop: '1.25rem',
        paddingTop: '1.25rem'
      }}
    >
      <Typography variant="body2" component="h4" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
        Payment methods
      </Typography>
      <Box
        className="payment-method-list"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1
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
        {renderMethod('Pay on Delivery', Cash, 'cash', 'Pay in cash or pay online when its delivered')}
        {renderMethod('Net Banking', NetBanking, 'netbanking', '')}
      </Box>
    </Box>
  );
};

export default PaymentMethod;
