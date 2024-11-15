import { Box, Button, Typography } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import React, { useState } from 'react';

import CartSidebarLayout from '../../components/CartLayout/CartSidebarLayout';
import { addressAtom, isAddressListIsOpen } from '../Address/context/atoms';
import { isAddressAndTimeSlotIsOpen } from '../AddressAndTimeSlot/context/atoms';
import {
  addressSidebarDetails,
  isAddressIsOpen,
} from '../AddressEditDetails/context/atoms';
import TabType from '../AddressEditDetails/enums/TabType';
import BillDetails from './components/BillDetails';
import CancellationPolicy from './components/CancellationPolicy';
import CartRewards from './components/CartRewards';
import CouponSection from './components/CouponSection';
import DeliveryInstruction from './components/DeliveryInstruction';
import EmptyCart from './components/EmptyCart';
import ItemsList from './components/ItemsList';
import { cartAtom, cartItems, isCartPageIsOpen } from './context/atoms';
import { addToCart } from './services/addToCart';

const Cart = () => {
  const [isOpen, setIsOpen] = useAtom(isCartPageIsOpen);
  const [, setIsAddressOpen] = useAtom(isAddressIsOpen);
  const cart = useAtomValue(cartItems);
  const [, setCartAtom] = useAtom(cartAtom);
  const [, setSidebarDetails] = useAtom(addressSidebarDetails);
  const [, setIsAddressListOpen] = useAtom(isAddressListIsOpen);
  const [address] = useAtom(addressAtom);
  const [toPay, setToPay] = useState(0);
  const [, setIsAddressTimeSlotOpen] = useAtom(isAddressAndTimeSlotIsOpen);

  React.useEffect(() => {
    if (cart && Array.isArray(cart) && cart.length > 0)
      addToCart(cart, setCartAtom);
  }, []);

  const onProceed = () => {
    const allNonDefaultWithAtLeastOneDeliverable =
      address?.address?.every((add: any) => add.is_default === false) &&
      address.address.some((add: any) => add.deliverable === true);
    const noDeliverableAddresses = address.address?.every(
      (add: any) => add.deliverable === false
    );

    setIsOpen(false);

    if (allNonDefaultWithAtLeastOneDeliverable) {
      setIsAddressListOpen(true);
    } else if (noDeliverableAddresses) {
      setIsAddressOpen(true);
      setSidebarDetails((prevProps) => ({
        ...prevProps,
        tabType: TabType.ADDRESS_SELECTION,
      }));
    } else {
      setIsAddressTimeSlotOpen(true);
    }
  };

  const renderCartItems = () => {
    return (
      <>
        <Box
          sx={{
            height: 'calc(100vh - 100px - 5rem)',
            overflowY: 'auto',
            overflowX: 'hidden',
            mt: '-1rem',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <ItemsList />
          <DeliveryInstruction />
          <CouponSection />
          <CartRewards />
          <BillDetails setToPay={setToPay} />
          <CancellationPolicy />
        </Box>
        <Box
          sx={{
            backgroundColor: '#FFDD00',
            border: 'none',
            borderRadius: '58px',
            position: 'absolute',
            bottom: '0',
            width: '90%',
            zIndex: 1000,
            padding: '0.8rem',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: '12px',
                  color: '#231F2099',
                }}
              >{`${cart
                .map((i) => i?.uom?.length)
                .reduce((sum, num) => sum + num, 0)} items`}</Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: '16px',
                  color: '#231F20',
                }}
              >{`₹ ${toPay}`}</Typography>
            </Box>
            <Button
              onClick={onProceed}
              sx={{
                color: '#ffdd00',
                backgroundColor: '#231F20',
                padding: '0.5rem 1rem 0.5rem 1rem',
                border: 'none',
                borderRadius: '36px',
                ':disabled': {
                  color: '#ffdd00',
                  backgroundColor: '#636363',
                },
                ':hover': {
                  color: '#ffdd00',
                  backgroundColor: '#231F20',
                },
              }}
            >
              Next Step
            </Button>
          </Box>
        </Box>
      </>
    );
  };

  return (
    <CartSidebarLayout
      isOpen={isOpen}
      title="Your Cart"
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Box
        className="body-inner"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {cart.length > 0 ? renderCartItems() : <EmptyCart />}
      </Box>
    </CartSidebarLayout>
  );
};

export default Cart;
