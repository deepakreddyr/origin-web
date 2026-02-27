import { Box, Divider, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import Image from 'next/image';
import React, { useState } from 'react';

import { isAddressAndTimeSlotIsOpen } from '../../../AddressAndTimeSlot/context/atoms';
import { addressAtom, isAddressListIsOpen, searchAddress } from '../../context/atoms';
import { editAddress } from '../../services/editAddress';
import type Address from '../../types/Address';
import Home from './assets/house.svg';
import Office from './assets/office.svg';
import Other from './assets/other.svg';
import styles from './style.module.css';
import { addressActiveScreenAtom } from '@/features/AccountPage/context/atoms';
import { manageAddressScreens } from '@/features/AccountPage/enums/ActiveSidebar';
import LocationChangedPopup from '@/components/Cart/AddressAndTimeSlot/LocationChangedPopup';

const SavedAddressList = () => {
  const [address, setAddressAtom] = useAtom(addressAtom);
  const [, setIsOpen] = useAtom(isAddressListIsOpen);
  const [, setIsAddressAndTimeSlotOpen] = useAtom(isAddressAndTimeSlotIsOpen);
  const [activeScreen, setActiveScreen] = useAtom(addressActiveScreenAtom);
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  const [search] = useAtom(searchAddress);

  const onClick = (addressItem: Address) => async () => {
    try {
      const payload: Address = { ...addressItem, is_default: true };
      await editAddress(payload, setAddressAtom);
      setActiveScreen(manageAddressScreens.ADDRESS_LIST);
      // Show location changed popup; on Alright → hard refresh
      setShowLocationPopup(true);
    } catch (e) {
      //
    }
  };

  const renderImage = (addressItem: Address) => {
    let imageSrc = Other;

    switch (addressItem.address_name) {
      case 'Home':
        imageSrc = Home;
        break;
      case 'Office':
        imageSrc = Office;
        break;
      default:
        break;
    }

    return <Image key={addressItem.address_id} src={imageSrc} alt={`Image for ${addressItem.address_name}`} />;
  };

  const renderDeliveryType = (addressItem: Address) => {
    return (
      <Box
        sx={{
          display: 'flex'
        }}
      >
        {addressItem.show_instant_delivery && (
          <Typography
            sx={{
              background: '#FFE7B2 ',
              color: '#393939',
              padding: ' 0.3rem',
              paddingX: '.7rem',
              fontSize: '10px',
              border: 'none',
              borderRadius: '5px',
              fontFamily: 'SofiaPro'
            }}
          >
            INSTANT
          </Typography>
        )}
        {addressItem.deliverable && (
          <Typography
            sx={{
              background: 'rgba(143, 152, 140, 0.2)',
              color: '#393939',
              padding: ' 0.3rem',
              paddingX: '.7rem',
              fontSize: '10px',
              border: 'none',
              borderRadius: '5px',
              marginLeft: '0.3rem',
              fontFamily: 'SofiaPro'
            }}
          >
            TOMORROW
          </Typography>
        )}
        {!addressItem.show_instant_delivery && <></>}
      </Box>
    );
  };

  const renderAddressItem = () => {
    return address.address
      .filter((i: Address) => i.deliverable)
      .map((addressItem: Address) => (
        <>
          <Box
            key={addressItem.address_id}
            sx={{
              paddingY: '0.5rem',
              marginY: '0.5rem',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              width: '100%',
              alignItems: 'center'
            }}
            onClick={onClick(addressItem)}
          >
            <Box
              sx={{
                border: '2px solid #EAE5CF ',
                borderRadius: '6px',
                padding: '0.8rem'
              }}
            >
              {renderImage(addressItem)}
            </Box>
            <Box
              sx={{
                marginLeft: ' 0.5rem',
                width: '100%'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.3rem',
                  width: '100%'
                }}
              >
                <Typography variant="body1">{addressItem.address_name}</Typography>
                {renderDeliveryType(addressItem)}
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontSize: '12px',
                  color: '#7D786D',
                  fontFamily: 'SofiaPro'
                }}
              >
                {addressItem.address}
              </Typography>
            </Box>
          </Box>
          <Divider
            sx={{
              color: '#EAE5CF'
            }}
          />
        </>
      ));
  };

  const renderSavedText = () => {
    return (
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: '500',
          color: '#7D786D',
          marginLeft: '0.5rem',
          fontFamily: 'SofiaPro'
        }}
      >
        {search.length !== 0 && `${address?.address?.length} Saved`}
      </Typography>
    );
  };

  if ((address?.address?.filter((i: Address) => i.deliverable).length || 0) === 0) return <></>;

  return (
    <>
      <LocationChangedPopup
        isVisible={showLocationPopup}
        onClose={() => {
          window.location.reload();
        }}
      />
      <Box className={styles['address-list-container']}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Typography className={styles.heading}>Saved Addresses</Typography>
          {renderSavedText()}
        </Box>

        {!!address.address &&
          Array.isArray(address.address) &&
          address.address.length > 0 &&
          search.length === 0 &&
          renderAddressItem()}
      </Box>
    </>
  );
};

export default SavedAddressList;
