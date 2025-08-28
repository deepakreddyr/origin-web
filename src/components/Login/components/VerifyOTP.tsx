import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { OtpInput } from './OtpInput';
import ResendOTP from './ResendButton';
import TermsAndConditions from '../TermsAndConditions';
import PrimaryRoundedCta from '@/components/shared/PrimaryRoundedCta';
import { mainApiUrl } from '@/url';
import { request, header } from '@/utilities/request';
import { TabTypeConstant } from '../constants/tabTypeContent';
import type { LoginAtom } from '../types/LoginAtom';
import { useAtom } from 'jotai';
import { profileAtom } from '@/features/AccountPage/context/atoms';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginDetails, setTabType, setUser } from '@/store/slice/loginSlice';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { addressAtom } from '@/features/Address/context/atoms';
import { removeRouteSourceFromLs } from '@/utilities/utils';
import { access } from 'fs';

interface Props {
  mobileNumber: any;
  otpErrors: any;
  setOtpErrors: any;
  setMobileNumber: any;
}

const VerifyOTP = (props: Props) => {
  const { mobileNumber, otpErrors, setOtpErrors, setMobileNumber } = props;
  const [otp, setOtp] = useState('');
  const [profile, setProfileAtom] = useAtom(profileAtom);
  const dispatch = useDispatch();
  const getDataFromApi = useGetDataFromApi();
  const [address, setAddress] = useAtom(addressAtom);
  const [mobileNumberErrors, setMobileNumberErrors] = useState('');
  const loginDetails = useSelector((state: any) => state.loginDetails);

  const fetchAddressDetails = async (token: any) => {
    let apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + '/api/v1/user/address';
    const successHandler = (data: any) => {
      const defaultAddress = data.data.find((item: any) => item.is_default);
      setAddress({
        loading: false,
        success: false,
        error: false,
        address: data.data,
        defaultAddress
      });
      // localStorage.setItem('user_token', loginDetails.user);
      
      if (!data?.data) {
        dispatch(
          setLoginDetails({
            isSidebarOpen: true,
            isLogin: true,
            user: token,
            tabType: TabTypeConstant.MANAGE_ADDRESS
          })
        );
      } else {
        let tab_source = localStorage.getItem('tab_source');

        const defaultAddress = data.data.find((item: any) => item.is_default);
        localStorage.setItem('store-id', JSON.stringify(defaultAddress?.store_id));
        localStorage.setItem('selected_address', JSON.stringify(defaultAddress));

        if (tab_source) {
          removeRouteSourceFromLs('tab_source');
          dispatch(
            setLoginDetails({
              isSidebarOpen: true,
              isLogin: true,
              user: token,
              tabType: JSON.parse(tab_source)
            })
          );
        } else {
          dispatch(
            setLoginDetails({
              isSidebarOpen: false,
              isLogin: true,
              user: token,
              tabType: ''
            })
          );
        }
      }
    };
    const failureHandler = (data: any) => {
      // console.log(data);
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, {});
  };

  const onSubmitOTP = async () => {
    if (!otp) {
      setOtpErrors('Incorrect OTP');
      return;
    }
    setOtpErrors('');

    try {
      const formData = new FormData();
      const requestURL = mainApiUrl.verifyOtp;
      formData.append('grant_type', 'password');
      formData.append('username', `+91${mobileNumber}`);
      formData.append('password', otp);
      formData.append('client_id', process.env.NEXT_PUBLIC_CLIENT_ID || '');
      formData.append('client_secret', process.env.NEXT_PUBLIC_CLIENT_SECRET || '');
      formData.append('scope', '*');

      const response: any = await request(requestURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData
      });

      dispatch(setUser(response.access_token));
      // console.log("TOKEN ",response.access_token);
      localStorage.setItem('user_token', response.access_token);
      // console.log(localStorage.getItem('user_token'));
      const token = localStorage.getItem('user_token')
      const requestURLProfile = mainApiUrl.getProfileDetails;

      const profileResponse: any = await request(requestURLProfile, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      if (profileResponse.data) {
        setMobileNumber('');
      }
      setProfileAtom({
        ...profile,
        data: profileResponse.data
      });
      if (!profileResponse.data.name) {
        dispatch(setTabType(TabTypeConstant.REGISTER));
      } else {
        // this is a temp fix to get the updated state for address and profile
        // window.location.reload()
      }
      if (profileResponse.data.profile) {
        localStorage.setItem('user_token', response.access_token);
        fetchAddressDetails(response.access_token);
      }
    } catch (error: any) {
      const e = await error.response.json();
      setOtpErrors(e.message);
    }
  };

  const isMobileNumberValid = (number: any) => {
    const phoneRegex = /^[0-9]\d{9}$/;
    return phoneRegex.test(number);
  };
  const onSubmitMobileNumber = async () => {
    if (!isMobileNumberValid(mobileNumber)) {
      setMobileNumberErrors('Incorrect mobile number');
      return;
    }
    try {
      setOtpErrors('');
      const formData = new FormData();
      const requestURL = `/api/v1/auth/otp`;
      formData.append('phone', mobileNumber);
      formData.append('scope', 'client');
      await request(requestURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData
      });
      // setTabType(TabTypeConstant.ENTER_OTP);
      setMobileNumberErrors('');
    } catch (error) {
      setMobileNumberErrors('Unable to login please try later');
    }
  };

  return (
    <Box
      className="render-otp-screen"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Box>
        <Typography
          sx={{
            position: 'relative',
            display: 'flex',
            transform: 'initial',
            fontSize: 16,
            fontWeight: '400',
            color: '#000',
            fontFamily: 'SofiaPro'
          }}
        >
          Enter OTP
        </Typography>
        <Typography
          sx={{
            position: 'relative',
            display: 'flex',
            transform: 'initial',
            fontSize: 16,
            fontWeight: '400',
            color: '#000',
            fontFamily: 'SofiaPro'
          }}
        >
          {`Sent to +91 ${mobileNumber}`}
        </Typography>
      </Box>
      <Box>
        <OtpInput
          otp={otp}
          setOtp={(value: string) => {
            setOtpErrors('');
            setOtp(value);
          }}
          onEnter={() => {
            onSubmitOTP();
          }}
          error={otpErrors}
          hasErrored={!!otpErrors}
        />
        <Typography
          variant="body2"
          sx={{
            color: '#C70000',
            fontWeight: 'normal',
            display: 'block',
            fontSize: '12px',
            fontFamily: 'SofiaPro'
          }}
        >
          {otpErrors}
        </Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <ResendOTP
          onResend={() => {
            setOtp('');
            onSubmitMobileNumber();
          }}
        />
      </Box>
      <button
        style={{ width: '100%', marginTop: '1rem' }}
        onClick={() => {
          if (otp.length < 4) {
            setOtpErrors('Enter valid OTP');
          }
        }}
      >
        <div className={'mt-[24px]'}>
          <PrimaryRoundedCta style="" name="Confirm" handler={onSubmitOTP} isDisabled={otp.length !== 4} />
        </div>
        <TermsAndConditions />
      </button>
    </Box>
  );
};

export default VerifyOTP;
