import { Box, Button } from '@mui/material';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';

import AccountSidebarLayout from '../../../../components/AccountLayout/AccountSidebarLayout';
import {
  addressDetailsAtom,
  goBackToAddressAtom,
  isAddressIsOpen,
  isEditingAddress
} from '../../../AddressEditDetails/context/atoms';
import GoBack from '../../../AddressEditDetails/enums/GoBack';
import {
  activeAccountsPageAtom,
  addressActiveScreenAtom,
  deletingAddressAtom,
  isAccountIsOpen
} from '../../context/atoms';
import ActiveSidebar, { ManageAddressScreenKeys, manageAddressScreens } from '../../enums/ActiveSidebar';
import { deleteAddress } from '../../services/deleteAddress';
import { getAddress } from '../../services/getAddress';
import styles from '../../style.module.css';
import type AddressAtom from '../../types/AddressAtom';
import DeleteConfirmation from '../DeleteConfirmation';
import AddressItem from './AddressItem';
import NoData from './NoData';
import Address from '@/features/AddressEditDetails';
import CheckServiceability from '@/features/AddressEditDetails/components/CheckServiceability';
import CompleteAddress from '@/features/AddressEditDetails/components/CompleteAddress';
import AddressList from '@/features/Address';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { addressAtom } from '@/features/Address/context/atoms';
import AddressListSkeleton from '@/components/skeletonLoaders/sidebar/AddressListSkeleton';
import { trackEvent } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';

type ScreenMapType = {
  [key in ManageAddressScreenKeys]: ReactNode;
};

const ManageAddress = () => {
  const [isOpen, setIsOpen] = useAtom(isAccountIsOpen);
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);
  const [, setIsAddressOpen] = useAtom(isAddressIsOpen);
  const [address, setAddress] = useAtom(addressAtom);
  const [, setGoBackAddress] = useAtom(goBackToAddressAtom);
  const [deletingAddressA, setDeletingAddress] = useAtom(deletingAddressAtom);
  const [isAddressOpen] = useAtom(isAddressIsOpen);
  const [activeScreen, setActiveScreen] = useAtom(addressActiveScreenAtom);
  const [addressDetails, setAddressDetails] = useAtom(addressDetailsAtom);
  const [editingDetails, setIsEditingAddress] = useAtom(isEditingAddress);

  useEffect(() => {
    trackEvent(AnalyticsEvents.MANAGE_ADDRESS);
  }, []);

  const loginDetails = useSelector((state: any) => state.loginDetails);
  const getDataFromApi = useGetDataFromApi();

  useEffect(() => {
    if (!address?.address || address.address.length === 0) {
      setActiveScreen('NO_DATA');
    }
  }, [address]);

  const onEditAddress = () => {
    setActiveScreen(manageAddressScreens.SERVICEABILITY);
  };

  const addNewAddressHandler = () => {
    setAddressDetails({
      address_name: '',
      formatted_address: '',
      address: '',
      door_no: '',
      locality: '',
      landmark: '',
      latitude: 0,
      longitude: 0,
      deliverable: false,
      address_id: null,
      earliest_timeslot: '',
      store_id: '',
      is_default: ''
    });
    setIsEditingAddress({
      ...editingDetails,
      isActive: false
    });
    setActiveScreen(manageAddressScreens.SERVICEABILITY);
  };

  const addAdressCTA = () => {
    return (
      <Button
        variant="contained"
        color="success"
        sx={{
          // marginTop: "auto",
          width: '100%',
          backgroundColor: '#fac510',
          position: 'sticky',
          bottom: '0',
          color: 'black',
          fontFamily: 'SofiaPro',
          fontSize: '16px',
          borderRadius: '100px',
          height: '48px',
          fontWeight: 600,
          textTransform: 'capitalize',
          boxShadow: 'none',
          ':hover': {
            backgroundColor: '#fac510a6',
            color: 'black',
            boxShadow: 'none'
          }
        }}
        onClick={addNewAddressHandler}
      >
        + New Address
      </Button>
    );
  };

  const renderContent = () => {
    if (deletingAddressA.isActive)
      return (
        <DeleteConfirmation
          text="Confirm Address Delete?"
          desc="Are you sure you want to delete this address?"
          setDeletingAddress={setDeletingAddress}
          deletingAddressA={deletingAddressA}
          setAddress={setAddress}
        />
      );
    return (
      <Box className={`weekly ${styles.weekly}`} sx={{ flexGrow: 1, paddingTop: 'px', paddingBottom: '20px' }}>
        {SCREEN_MAP[activeScreen]}
      </Box>
    );
  };

  const SCREEN_MAP: ScreenMapType = {
    ADDRESS_LIST: (
      <Box component="ul" className={`weekly-list  ${styles['weekly-list']}`}>
        {address.address?.map((add: any) => (
          <AddressItem key={add.address_id} address={add} setActiveScreen={setActiveScreen} />
        ))}
      </Box>
    ),
    SERVICEABILITY: <CheckServiceability setActiveScreen={setActiveScreen} />,
    COMPLETE_ADDRESS: <CompleteAddress setActiveScreen={setActiveScreen} />,
    MANUAL_ADDRESS: <AddressList setActiveScreen={setActiveScreen} />,
    NO_DATA: (
      <>
        <NoData onEditAddress={onEditAddress} />
        {addAdressCTA()}
      </>
    )
  };

  if (address.loading) return <AddressListSkeleton />;
  return (
    <>
      {renderContent()}

      {activeScreen === manageAddressScreens.ADDRESS_LIST &&
        !deletingAddressA.isActive &&
        address?.address &&
        addAdressCTA()}
    </>
  );
};

export default ManageAddress;
