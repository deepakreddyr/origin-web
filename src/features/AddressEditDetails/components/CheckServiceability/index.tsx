import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import type { ServiceabilityPayload } from '../../../../layouts/Header/types/ServiceabilityPayload';
import { isAddressListIsOpen } from '../../../Address/context/atoms';
import Location from '../../assets/location.svg';
import { addressDetailsAtom, addressSidebarDetails, isAddressIsOpen } from '../../context/atoms';
import TabType from '../../enums/TabType';
import { checkServiceabilityAddress } from '../../services/checkServiceability';
import AddressMapContainer from '../AddressMapContainer';
import styles from './styles.module.css';
import { manageAddressScreens } from '@/features/AccountPage/enums/ActiveSidebar';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch } from 'react-redux';
import { setLoginDetails } from '@/store/slice/loginSlice';

interface Props {
  setActiveScreen: any;
}

const getPermission = async () => {
  await navigator.permissions.query({ name: 'geolocation' }).then((result) => {
    if (result.state === 'granted') {
      // onSuccess();
    } else if (result.state === 'prompt') {
      // onError();
    } else if (result.state === 'denied') {
      // onError();
    }
  });
};

export default function CheckServiceability(props: Props) {
  const { setActiveScreen } = props;
  const [, setIsOpen] = useAtom(isAddressIsOpen);
  const [, setSidebarDetails] = useAtom(addressSidebarDetails);
  const [addressDetails, setAddressDetails] = useAtom(addressDetailsAtom);
  const [isDeliverableChecked, setIsDeliverableChecked] = useState(false);
  const [, setIsAddressOpen] = useAtom(isAddressListIsOpen);
  const dispatch = useDispatch();

  const address: ServiceabilityPayload | null = JSON?.parse(localStorage.getItem('address') || '{}');

  useEffect(() => {
    getPermission();
  }, []);

  const getReverseGeocodedAddress = async (latitude: number, longitude: number): Promise<string | null> => {
    const apiKey = process.env.NEXT_PUBLIC_MAP_KEY; // Replace with your actual API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        console.error('Failed to fetch address from coordinates:', data.status);
        return null;
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return null;
    }
  };

  const checkForDeliverableAddress = async () => {
    if (addressDetails.latitude === 0 && addressDetails.longitude === 0) {
      try {
        const position: GeolocationPosition = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        let addressFormatToCheck = {
          latitude: latitude,
          longitude: longitude
        };
        const address = await getReverseGeocodedAddress(latitude, longitude);
        const res = await checkServiceabilityAddress(addressFormatToCheck);

        if (address) {
          setAddressDetails((prevState) => ({
            ...prevState,
            latitude: Number(latitude),
            longitude: Number(longitude),
            formatted_address: address,
            address: address,
            deliverable: res?.deliverable,
            store_id: res?.store_id
          }));
        }

        if (res?.deliverable && res?.store_id) {
          dispatch(
            setLoginDetails({
              isLogin: true,
              isLoginSidebarOpen: true,
              user: localStorage.getItem('user_token') || 'guest'
            })
          );
        }
      } catch (error) {
        console.error('Error fetching current location:', error);
      }
    } else {
      let addressFormatToCheck = {
        latitude: addressDetails.latitude,
        longitude: addressDetails.longitude
      };

      const res = await checkServiceabilityAddress(addressFormatToCheck);
      setAddressDetails((prevState) => ({
        ...prevState,
        deliverable: res?.deliverable,
        store_id: res?.store_id
      }));

      if (res?.deliverable && res?.store_id) {
        dispatch(
          setLoginDetails({
            isLogin: true,
            isLoginSidebarOpen: true,
            user: localStorage.getItem('user_token') || 'guest'
          })
        );
      }
    }
  };

  useEffect(() => {
    checkForDeliverableAddress();
  }, []);

  const setDeliverable = (isDeliverable: boolean): void => {
    setAddressDetails((prevState) => ({
      ...prevState,
      deliverable: isDeliverable
    }));
  };

  const geocodePosition = (position: any) => {
    // @ts-ignore
    const geocoder = new window.google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: position }, (results, status) => {
        // @ts-ignore
        if (status === window.google.maps.GeocoderStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
  };

  const goToCurrent = () => {
    navigator?.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lng } }) => {
        const pos = { lat, lng };
        const response: any = await geocodePosition(pos);
        setAddressDetails((prevState) => ({
          ...prevState,
          latitude: Number(pos.lat),
          longitude: Number(pos.lng),
          formatted_address: response.length > 0 ? response[0].formatted_address : '',
          address: response.length > 0 ? response[0].formatted_address : ''
        }));
      },
      () => {
        // alert('Sorry, browser does not support geolocation!');
      },
      { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true }
    );
  };

  const onConfirm = async () => {
    if (!address) return;
    if (!addressDetails.deliverable) {
      const res = await checkServiceabilityAddress(addressDetails);
      setAddressDetails((prevState) => ({
        ...prevState,
        address: addressDetails.formatted_address,
        address_id: addressDetails.address_id,
        address_name: addressDetails.address_name,
        formatted_address: addressDetails.formatted_address,
        latitude: Number(addressDetails.latitude),
        longitude: Number(addressDetails.longitude),
        deliverable: res?.deliverable,
        store_id: res?.store_id
      }));

      if (res?.deliverable && res?.store_id) {
        dispatch(
          setLoginDetails({
            isLogin: true,
            isLoginSidebarOpen: true,
            user: localStorage.getItem('user_token') || 'guest'
          })
        );
      }

      setIsDeliverableChecked(true);
    } else if (addressDetails.deliverable) {
      // setSidebarDetails((prevProps) => ({
      //   ...prevProps,
      //   tabType: TabType.COMPLETE_ADDRESS,
      // }));
    }
    setActiveScreen(manageAddressScreens.COMPLETE_ADDRESS);
  };

  const onTypingManually = () => {
    setIsOpen(false);
    setIsAddressOpen(true);
    setActiveScreen(manageAddressScreens.MANUAL_ADDRESS);
  };

  const renderAddress = () => {
    if (!addressDetails?.address && !address?.formatted_address) return <></>;
    return (
      <Box
        className="select-location"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box
          className={styles.leftSideAddressContainer}
          sx={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Box className={styles.leftImageContainer}>
            <FmdGoodIcon />
          </Box>
          <Box className={styles.leftAddressContainer}>
            <Typography sx={{ fontFamily: 'SofiaPro' }} className={styles.addressFullName}>
              {addressDetails?.address ? addressDetails?.address : address?.formatted_address}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const styleColor: { map: string; button: string } = React.useMemo(() => {
    if (!isDeliverableChecked)
      return {
        map: '',
        button: styles.deliverableColor
      };

    if (addressDetails.deliverable)
      return {
        map: styles.mapActive,
        button: styles.deliverableColor
      };

    return {
      map: styles.mapInActive,
      button: styles.notDeliverableColor
    };
  }, [addressDetails.deliverable, isDeliverableChecked]);

  return (
    <Box
      className="address-selection"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flexGrow: 1
      }}
    >
      <Box
        className="address-map"
        sx={{
          height: '50vh',
          position: 'relative'
        }}
      >
        <Box className={`${styles.mapColor} ${styleColor.map}`}></Box>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '14px',
            border: addressDetails.deliverable ? '10px solid #00855B40' : '10px solid #C7000040'
          }}
        >
          <AddressMapContainer />
        </Box>
        {/* <Box className={`${styles["current-location-button"]}`}>
          <IconButton
            sx={{
              padding: "1rem",
              boxShadow: "0px 2px 4px 0px #00000040",
              background: "#fff",
            }}
            onClick={goToCurrent}
          >
            <Image
              src={Location}
              alt="location"
              style={{
                padding: 0,
              }}
            />
          </IconButton>
        </Box> */}
      </Box>
      <Box className="select-your-location-wrapper" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          onClick={onTypingManually}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            borderRadius: '30px',
            backgroundColor: '#F5F5F5',
            cursor: 'pointer',
            width: '100%',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          {/* <Image src="/icons/search.svg" alt="Search" width={20} height={20} /> */}
          <SearchIcon sx={{ color: '#231F20CC' }} />
          <Typography
            sx={{
              fontWeight: '400',
              fontFamily: 'SofiaPro',
              color: '#231F20CC',
              fontSize: '14px'
            }}
          >
            Search Your Location
          </Typography>
        </Box>

        {renderAddress()}
      </Box>

      <Button
        variant="contained"
        color="success"
        sx={{
          marginTop: 'auto',
          backgroundColor: '#fac510',
          color: !addressDetails.deliverable ? '#FFD700' : 'black',
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
        onClick={onConfirm}
        disabled={!addressDetails.deliverable}
      >
        {!addressDetails.deliverable ? 'Location not deliverable, try another address' : 'Confirm'}
      </Button>
    </Box>
  );
}
