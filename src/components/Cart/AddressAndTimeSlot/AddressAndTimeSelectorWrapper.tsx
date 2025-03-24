import React, { useState } from 'react';
import CartAddressList from './CartAddressList';
import { useSelector } from 'react-redux';
import AddressAndTimeSlot from './AddressAndTimeSlot';
const AddressAndTimeSelectorWrapper = (props: any) => {
  const { showAddressModal, setAddressModal } = props;

  const [addressTab, setAddressTab] = useState('SELECT_DELIVERY_ADDRESS');

  const SCREEN_MAP: any = {
    SELECT_DELIVERY_ADDRESS: (
      <AddressAndTimeSlot
        setAddressTab={setAddressTab}
        showAddressModal={showAddressModal}
        setAddressModal={setAddressModal}
      />
    ),
    CART_ADDRESS_LIST: <CartAddressList />
  };

  return <div>{SCREEN_MAP[addressTab]}</div>;
};

export default AddressAndTimeSelectorWrapper;
