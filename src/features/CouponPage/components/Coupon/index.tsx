import styled from '@emotion/styled';
import { Box, Button, Divider, LinearProgress, Modal, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import React from 'react';

import { cartItems } from '../../../CartPage/context/atoms';
import { isCouponApplied } from '../../context/atoms';
import { validateCoupon } from '../../services/validateCoupon';
import type CouponI from '../../types/CouponI';

const ModalBoxContainer = styled.div`
  background-color: #ffffff;
  display: flex;
  width: auto;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem 2rem;
  border-radius: 10px;
`;

interface Props {
  coupon: CouponI;
  onApplied: () => void;
}

const IndividualCoupon = (props: Props) => {
  const { coupon, onApplied } = props;
  const [, setAppliedCoupon] = useAtom(isCouponApplied);
  const [cart] = useAtom(cartItems);
  const [applyingLoader, setApplyingLoader] = React.useState(false);
  const onApply = async (couponString: string) => {
    const hasFreeItem = cart?.some((e: any) => e.isFreeItem);
    if (hasFreeItem) {
      alert('Please remove free items to apply coupon');
      return;
    }
    try {
      setApplyingLoader(true);
      const payload = {
        code: couponString,
        items: cart.map((e: any) => ({
          item_code: e.item_code,
          uom: e.uom.map((uomItem: any) => {
            return {
              variant_id: uomItem.variant_id,
              qty: uomItem.qty
            };
          })
        }))
      };
      await validateCoupon(payload, setAppliedCoupon);
      setApplyingLoader(false);
      onApplied();
    } catch (e) {
      //
    }
  };

  const renderTerm = () => {
    return (
      <Box
        className="coupon-list-details"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          backgroundColor: '#F8F4E9',
          borderRadius: '0 0 8px 8px',
          borderTop: '2px solid #231F201A',
          padding: '12px'
        }}
      >
        <Typography variant="body1" component="h5">
          Terms & Conditions to use this coupon
        </Typography>
        <Box
          component="ul"
          sx={{
            margin: 0,
            padding: '0 0 0 16px',
            display: 'flex',
            flexDirection: 'column',
            listStyleType: 'disc'
          }}
        >
          <Box component="li" sx={{ fontWeight: 400, fontSize: 12 }}>
            <Typography component="small" variant="caption" sx={{ fontWeight: 400 }}>
              Offer valid on first 3 order only
            </Typography>
          </Box>
          <Box component="li" sx={{ fontWeight: 400, fontSize: 12 }}>
            <Typography component="small" variant="caption" sx={{ fontWeight: 400 }}>
              This coupon can be applied ones per day
            </Typography>
          </Box>
          <Box component="li" sx={{ fontWeight: 400, fontSize: 12 }}>
            <Typography component="small" variant="caption" sx={{ fontWeight: 400 }}>
              Offer valid till Jun 30,2023 11:59 PM{' '}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      className="coupon-wrapper"
      sx={{
        gap: '12px',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '1rem',
        backgroundColor: '#F2EEE44D',
        borderRadius: '10px',
        border: '2px solid #231F201A'
      }}
      key={coupon.id}
    >
      <Box
        className="coupon-block"
        sx={{
          borderRadius: '8px',
          display: 'flex'
        }}
      >
        <Box
          className="coupon-list-bottom"
          sx={{
            paddingLeft: '12px',
            paddingRight: '12px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              paddingTop: 1,
              paddingBottom: 1,
              padding: '0.5rem',
              position: 'relative',
              width: '100%'
            }}
          >
            <Box
              sx={{
                backgroundColor: 'white',
                height: '24px',
                width: '24px',
                borderRadius: '50%',
                position: 'absolute',
                bottom: '-0.6rem',
                left: '-1.6rem',
                borderRight: '2px solid #231F201A'
              }}
            ></Box>
            <Box
              sx={{
                backgroundColor: 'white',
                height: '24px',
                width: '24px',
                borderRadius: '50%',
                position: 'absolute',
                bottom: '-0.6rem',
                right: '-1.6rem',
                borderLeft: '2px solid #231F201A'
              }}
            ></Box>
            <Box
              className="apply-code"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                padding: '0.3rem 0.2rem'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography component="span" sx={{ textTransform: 'uppercase' }}>
                  {coupon.name}
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color: '#231F20CC',
                    fontWeight: 500,
                    fontSize: '12px'
                  }}
                >
                  {coupon.discount_type === 'percentage'
                    ? `${coupon.discount}% off up to ₹${coupon.max_cart_value || 0}`
                    : coupon.description}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                sx={{
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: '20px',
                  padding: '0.4rem'
                }}
                onClick={() => onApply(coupon.code)}
              >
                Apply
              </Button>
            </Box>
          </Box>
          <Divider
            sx={{
              border: '1px dashed rgba(0, 0, 0, 0.20)',
              width: '95%'
            }}
          />
          <Box
            sx={{
              marginTop: '0.2rem',
              paddingLeft: '0.7rem',
              paddingRight: '0.7rem',
              width: '100%'
            }}
          >
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: '#231F20CC',
                fontWeight: 500,
                fontSize: '12px'
              }}
            >
              Save ₹50 on your first order, maximum discount ₹50 on order above ₹250.
            </Typography>
          </Box>
        </Box>
      </Box>
      {renderTerm()}
      <Modal open={applyingLoader} onClose={() => {}}>
        <ModalBoxContainer>
          <Typography variant="h5">Applying Coupon</Typography>
          <LinearProgress
            color="success"
            sx={{
              width: '95%',
              position: 'absolute',
              bottom: '0',
              left: '2.5%'
            }}
          />
        </ModalBoxContainer>
      </Modal>
    </Box>
  );
};
export default IndividualCoupon;
