import { Box, Button, Typography } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import React, { useEffect, useState } from 'react';

import CartSidebarLayout from '../../components/CartLayout/CartSidebarLayout';
import { addressAtom, isAddressListIsOpen } from '../Address/context/atoms';
import { isAddressAndTimeSlotIsOpen } from '../AddressAndTimeSlot/context/atoms';
import { addressSidebarDetails, isAddressIsOpen } from '../AddressEditDetails/context/atoms';
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
import { useSelector } from 'react-redux';
import { login } from '../Login/context/atom';
import SidebarWrapper from '@/components/Login/components/SidebarWrapper';
import CommonSidebar from '@/components/shared/CommonSidebar';

const Cart = () => {
  const [loginDetails, setLoginDetails] = useAtom(login);
  const [isCartOpen, setIsCartOpen] = useAtom(isCartPageIsOpen);
  const [isOpen, setIsOpen] = useAtom(isCartPageIsOpen);
  const [, setIsAddressOpen] = useAtom(isAddressIsOpen);
  const [activeScreen, setActiveScreen] = useState(1);
  const cart = useSelector((state: any) => state.cart);

  // const cart = useAtomValue(cartItems);
  const [, setCartAtom] = useAtom(cartAtom);
  const [, setSidebarDetails] = useAtom(addressSidebarDetails);
  const [, setIsAddressListOpen] = useAtom(isAddressListIsOpen);
  const [address] = useAtom(addressAtom);
  const [toPay, setToPay] = useState(0);
  const [, setIsAddressTimeSlotOpen] = useAtom(isAddressAndTimeSlotIsOpen);

  // React.useEffect(() => {
  //   if (cart && Array.isArray(cart) && cart.length > 0)
  //     addToCart(cart, setCartAtom);
  // }, []);

  const onProceed = () => {
    const allNonDefaultWithAtLeastOneDeliverable =
      address?.address?.every((add: any) => add.is_default === false) &&
      address.address.some((add: any) => add.deliverable === true);
    const noDeliverableAddresses = address.address?.every((add: any) => add.deliverable === false);

    setIsOpen(false);

    if (allNonDefaultWithAtLeastOneDeliverable) {
      setIsAddressListOpen(true);
    } else if (noDeliverableAddresses) {
      setIsAddressOpen(true);
      setSidebarDetails((prevProps) => ({
        ...prevProps,
        tabType: TabType.ADDRESS_SELECTION
      }));
    } else {
      setIsAddressTimeSlotOpen(true);
    }
  };

  const renderCartItems = () => {
    return (
      <div className="relative  ">
        <ItemsList />
        <DeliveryInstruction />
        <CouponSection />
        <CartRewards />
        <BillDetails setToPay={setToPay} />
        <CancellationPolicy />
        <div className=" bg-primary  ">
          <button className="text-primary bg-black py-[.97vw] px-[2vw] rounded-full ">proceed</button>
        </div>
      </div>
    );
  };

  const onCloseHandler = () => {};
  const onBackHandler = () => {};

  return <>{cart.items.length > 0 ? <div className="">{renderCartItems()}</div> : <EmptyCart />}</>;

  // return (
  //     <CommonSidebar
  //         isOpen={isCartOpen}
  //         onClose={onCloseHandler}
  //         onBack={onBackHandler}
  //         isBackButtonEnabled={true}
  //     >
  //         {cart.items.length > 0 ? renderCartItems() : <EmptyCart />}
  //     </CommonSidebar>
  // )
};

export default Cart;
