import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputBase,
  InputLabel,
  RadioGroup,
  styled,
  Typography
} from '@mui/material';
import { useAtom } from 'jotai';
import Image from 'next/image';
import React from 'react';

import LocationChangedPopup from '@/components/Cart/AddressAndTimeSlot/LocationChangedPopup';

import family from '/public/assets/svg/familyTag.svg';
import Home from '/public/assets/svg/HouseTag.svg';
import Location from '/public/assets/svg/locationTag.svg';
import Office from '/public/assets/svg/OfficeTag.svg';
import Other from '/public/assets/svg/OthersTag.svg';
import type Address from '../../../AccountPage/types/Address';
import WhiteFamily from '../../assets/white-tags/FnFicon.svg';
import WhiteHome from '../../assets/white-tags/house.svg';
import WhiteOffice from '../../assets/white-tags/office.svg';
import WhiteOther from '../../assets/white-tags/Others.svg';
import { addressDetailsAtom, addressSidebarDetails, isEditingAddress, saveAddressAtom } from '../../context/atoms';
import TabType from '../../enums/TabType';
import { editAddress } from '../../services/editAddress';
import { saveAddress } from '../../services/saveAddress';
import styles from './style.module.css';
import { manageAddressScreens } from '@/features/AccountPage/enums/ActiveSidebar';
import { addressAtom } from '@/features/Address/context/atoms';
import { setTabType } from '@/store/slice/loginSlice';
import { useDispatch } from 'react-redux';
import { removeRouteSourceFromLs } from '@/utilities/utils';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';

interface Props {
  setActiveScreen: any;
}

const BootstrapInput = styled(InputBase)(() => ({
  width: '100%',
  input: {
    paddingLeft: '18px',
    paddingRight: '18px',
    width: '100%',
    height: 48,
    borderRadius: '50px',
    backgroundColor: '#F8F4E9',
    boxSizing: 'border-box',
    fontFamily: 'SofiaPro'
  }
}));

export default function CompleteAddress(props: Props) {
  const { setActiveScreen } = props;
  const mobile = useMediaQuery(600);
  const [addressDetails, setAddressDetails] = useAtom(addressDetailsAtom);
  const [addressList, setAddressAtom] = useAtom(saveAddressAtom);
  const [, setSidebarDetails] = useAtom(addressSidebarDetails);
  const [editingDetails] = useAtom(isEditingAddress);
  const [address, setAddress] = useAtom(addressAtom);
  const dispatch = useDispatch();
  const [showLocationPopup, setShowLocationPopup] = React.useState(false);

  const onSubmit = async () => {
    try {
      if (editingDetails.isActive)
        await editAddress(
          {
            ...editingDetails.addressDetails,
            ...addressDetails,
            is_default: true
          } as Address,
          setAddress
        );
      else {
        let tab_source = localStorage.getItem('tab_source');

        let apiData = {
          ...addressDetails,
          is_default: true,
          formatted_address: addressDetails.address
        };
        await saveAddress(apiData, setAddress);
        if (tab_source) {
          dispatch(setTabType(JSON.parse(tab_source)));
          removeRouteSourceFromLs('tab_source');
        }
      }

      setSidebarDetails((prevProps: any) => ({
        ...prevProps,
        tabType: TabType.ADDRESS_SELECTION
      }));

      setActiveScreen(manageAddressScreens.ADDRESS_LIST);

      setAddressAtom((prevState: any) => ({
        ...prevState,
        isSaved: true
      }));

      // Show location changed popup; on Alright → hard refresh
      setShowLocationPopup(true);
    } catch (e) {
      // console.log(e, 'error while submitting new address');
    }
  };

  const isButtonDisabled = React.useMemo(() => {
    return !addressDetails.address_name || !addressDetails.door_no || !addressDetails.locality;
  }, [addressDetails]);

  const onChange = (event: any) => {
    const { value, name } = event.target;
    setAddressDetails((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const CustomRadio = ({ checked, ...props }: any) => {
    return <input type="radio" style={{ display: 'none' }} {...props} />;
  };

  const renderTagLocation = () => {
    return (
      <FormControl
        component="fieldset"
        sx={{
          marginTop: '2rem'
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'SofiaPro'
          }}
          // variant="h6"
          gutterBottom
        >
          Tag location
        </Typography>
        <RadioGroup
          name="address_name"
          value={addressDetails.address_name}
          sx={{
            gap: '0.5rem',
            display: 'flex',
            flexDirection: 'row',
            paddingX: '0.8rem'
          }}
        >
          {[
            {
              value: 'Home',
              label: 'Home',
              icon:
                addressDetails.address_name === 'Home' ? (
                  <Image src={WhiteHome} alt="home" />
                ) : (
                  <Image src={Home} alt="home" />
                )
            },
            {
              value: 'Office',
              label: 'Office',
              icon:
                addressDetails.address_name === 'Office' ? (
                  <Image src={WhiteOffice} alt="home" />
                ) : (
                  <Image src={Office} alt="home" />
                )
            },

            // {
            //   value: 'Friends & Family',
            //   label: 'Friends & Family',
            //   icon:
            //     addressDetails.address_name === 'Friends & Family' ? (
            //       <Image src={WhiteFamily} alt="home" />
            //     ) : (
            //       <Image src={family} alt="home" />
            //     )
            // },
            {
              value: 'Other',
              label: 'Other',
              icon:
                addressDetails.address_name === 'Other' ? (
                  <Image src={WhiteOther} alt="home" />
                ) : (
                  <Image src={Other} alt="home" />
                )
            }
          ].map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<CustomRadio />}
              name="address_name"
              label={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {option.icon}
                  <span
                    style={{
                      marginLeft: 8,
                      fontFamily: 'SofiaPro',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  >
                    {option.label}
                  </span>
                </div>
              }
              sx={{
                border: '1px solid #F2EEE4',
                borderRadius: '20px',
                padding: '6px 14px',
                marginRight: 2,
                transition: 'all 0.3s',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: addressDetails.address_name === option.value ? '#25874ce0' : '#F2EEE4'
                },
                ...(addressDetails.address_name === option.value && {
                  backgroundColor: '#25874D',
                  borderColor: '#25874D',
                  color: '#fff'
                })
              }}
              onChange={onChange}
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  };

  const renderAddressForm = () => {
    return (
      <Box className={styles.container}>
        <FormControl variant="standard" className={styles.form}>
          <Box className={styles['form-input']}>
            <Box className={styles['form-group']}>
              <InputLabel required htmlFor="name" className={styles.input}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'SofiaPro'
                  }}
                >
                  Door No., Apartment Name/House Name & Block
                </Typography>
              </InputLabel>
              <BootstrapInput
                name="door_no"
                value={addressDetails.door_no}
                onChange={onChange}
                placeholder="Enter door level details"
              />
            </Box>

            <Box className={styles['form-group']}>
              <InputLabel htmlFor="email" className={styles.input}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'SofiaPro'
                  }}
                >
                  Street / Locality Area
                </Typography>
              </InputLabel>
              <BootstrapInput
                name="locality"
                value={addressDetails.locality}
                onChange={onChange}
                placeholder="Enter street level details"
                required={false}
              />
            </Box>

            <Box className={styles['form-group']}>
              <InputLabel htmlFor="email" className={styles.input}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'SofiaPro'
                  }}
                >
                  Landmark (optional)
                </Typography>
              </InputLabel>
              <BootstrapInput
                name="landmark"
                value={addressDetails.landmark}
                onChange={onChange}
                placeholder="To easily find your delivery location..."
                // id="email"
                required={false}
              />
            </Box>
          </Box>
          {renderTagLocation()}
        </FormControl>
      </Box>
    );
  };

  return (
    <Box className={styles['main-container']}>
      <LocationChangedPopup
        isVisible={showLocationPopup}
        onClose={() => {
          window.location.reload();
        }}
      />
      <Box
        sx={{
          marginTop: '0',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Box>
          <Image src={Location} alt="location" />
        </Box>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            marginLeft: '0.3rem',
            fontFamily: 'SofiaPro',
            width: '88%'
          }}
        >
          {addressDetails.address}
        </Typography>
      </Box>
      <Typography className={styles.text}>
        Providing a detailed address will help our delivery agent find your location faster.
      </Typography>
      {renderAddressForm()}
      <Button
        variant="contained"
        color="success"
        sx={{
          marginY: '1rem',
          width: '100%',
          backgroundColor: '#fac510',
          color: 'black',
          fontFamily: 'SofiaPro',
          fontSize: '16px',
          borderRadius: '100px',
          height: mobile ? '10.5vw' : '3.3vw',
          fontWeight: 600,
          textTransform: 'capitalize',
          boxShadow: 'none',
          ':hover': {
            backgroundColor: '#fac510a6',
            color: 'black',
            boxShadow: 'none'
          }
        }}
        onClick={onSubmit}
        disabled={isButtonDisabled}
      >
        Confirm
      </Button>
    </Box>
  );
}
