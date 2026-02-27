import { Box, Button, FormControl, InputAdornment, InputBase, InputLabel, styled, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import NextLink from 'next/link';
import React from 'react';

import { OtpInput } from './components/OtpInput';
import ResendOTP from './components/ResendButton';
import SidebarWrapper from './components/SidebarWrapper';
import SignUp from './components/SignUp';
import { TabTypeConstant } from './constants/tabTypeContent';
import { login } from './context/atom';
import type { LoginAtom } from './types/LoginAtom';
import { header, request } from '@/utilities/request';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  // width: "100%",
  '& .MuiInputBase-input': {
    paddingLeft: '12px',
    paddingRight: '12px',
    width: '100%',
    height: 48,
    borderRadius: '48px',
    // backgroundColor: "#F8F4E9",
    boxSizing: 'border-box',
    fontSize: '14px',
    '&::placeholder': {
      color: 'rgba(35, 31, 32, 0.6)',
      opacity: 1,
      fontWeight: 400
    }
  }
}));

const Login = () => {
  const [loginDetails, setLoginDetails] = useAtom(login);

  const [mobileNumber, setMobileNumber] = React.useState('');
  const [mobileNumberErrors, setMobileNumberErrors] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [otpErrors, setOtpErrors] = React.useState('');

  const setTabType = (tab: TabTypeConstant) => {
    setLoginDetails((prevDetails) => ({
      ...prevDetails,
      tabType: tab
    }));
  };

  const isMobileNumberValid = (number: string) => {
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
      setTabType(TabTypeConstant.ENTER_OTP);
      setMobileNumberErrors('');
    } catch (error) {
      setMobileNumberErrors('Unable to login please try later');
    }
  };

  const onSubmitOTP = async () => {
    if (!otp) {
      setOtpErrors('Incorrect OTP');
      return;
    }
    setOtpErrors('');

    try {
      const formData = new FormData();
      const requestURL = `/api/v1/oauth/token`;
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
      localStorage.setItem('user_token', response.access_token);

      const requestURLProfile = `/api/v1/user/profile`;

      const profileResponse: any = await request(requestURLProfile, {
        method: 'GET',
        headers: {
          Authorization: header(),
          Accept: 'application/json'
        }
      });

      if (!profileResponse.data.name) {
        setTabType(TabTypeConstant.REGISTER);
        setLoginDetails((prevDetails: LoginAtom) => ({
          ...prevDetails,
          user: response.access_token
        }));
      } else {
        setLoginDetails((prevDetails: LoginAtom) => ({
          ...prevDetails,
          isLoginSidebarOpen: false,
          isLogin: true,
          user: response.access_token
        }));
        // Hard refresh after 3 seconds to fetch all API data fresh with the new auth token
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error: any) {
      const e = await error.response.json();
      setOtpErrors(e.message);
    }
  };

  const onChangeNumber = (event: any) => {
    const { value } = event.target;
    if (value.length > 10) return;
    setMobileNumber(value);
    // const [countryCode, val] = value.split(" ");
    // const inputPhoneNumber = val ? val.replace(/\D/g, "") : "";

    // if (inputPhoneNumber.length > 10) {
    //   return;
    // }
  };

  const renderTermsAndCondition = () => {
    return (
      <Typography
        variant="body2"
        sx={{
          textAlign: 'center',
          color: '#919191',
          fontSize: '12px',
          paddingTop: '.75rem',
          fontWeight: '400',
          a: {
            fontSize: '12px',
            textDecoration: 'underline',
            fontWeight: '500'
          }
        }}
      >
        By clicking, I accept the{' '}
        <NextLink href="/terms-and-conditions" passHref>
          <Typography
            component="a"
            onClick={() =>
              setLoginDetails((prevDetails) => ({
                ...prevDetails,
                isLoginSidebarOpen: false
              }))
            }
          >
            Terms & Conditions
          </Typography>
        </NextLink>{' '}
        &{' '}
        <NextLink href="/privacy-policy" passHref>
          <Typography
            component="a"
            onClick={() =>
              setLoginDetails((prevDetails) => ({
                ...prevDetails,
                isLoginSidebarOpen: false
              }))
            }
          >
            Privacy Policy
          </Typography>
        </NextLink>
      </Typography>
    );
  };

  const renderEnterMobileNumberScreen = () => {
    const isButtonDisabled = !isMobileNumberValid(mobileNumber);

    return (
      <Box
        className="enter-mobile-number-screen"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        <Box className="login-form ">
          <InputLabel
            required
            htmlFor="mobileNumber"
            sx={{
              position: 'relative',
              display: 'flex',
              color: '#231f20',
              '& .MuiInputLabel-asterisk': {
                display: 'none'
              }
            }}
          >
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: '600',
                fontFamily: 'sofia-pro'
              }}
            >
              Mobile Number*
            </Typography>
          </InputLabel>
          <Box
            sx={{
              paddingLeft: '20px',
              marginTop: '16px',
              paddingY: '.2rem',
              minHeight: 48
            }}
            className="bg-primary-100 flex items-center  rounded-full"
          >
            <Typography sx={{ fontSize: '14px', boxSizing: 'border-box' }}>+91</Typography>
            <BootstrapInput
              value={`${mobileNumber}`}
              onChange={onChangeNumber}
              placeholder="10 Digit Mobile Number"
              id="mobileNumber"
              sx={{
                fontSize: '14px',
                color: '#000',
                minHeight: 48
              }}
            />
          </Box>

          <Typography
            variant="body2"
            sx={{
              fontSize: '12px',
              color: '#C70000',
              fontWeight: 'normal',
              display: 'block'
            }}
          >
            {mobileNumberErrors}
          </Typography>
          <Button
            variant="contained"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 48,
              width: '100%',
              marginTop: 8,
              backgroundColor: '#fac510',
              border: 'none',
              color: '#000',
              borderRadius: '48px',
              ':disabled': {
                backgroundColor: 'rgba(255, 221, 0, 0.8)',
                color: 'rgba(35, 31, 32, 1)'
              },
              ':hover': {
                backgroundColor: '#fac510d3'
              }
            }}
            onClick={onSubmitMobileNumber}
            disabled={isButtonDisabled}
          >
            Get OTP
          </Button>
        </Box>
        {renderTermsAndCondition()}
      </Box>
    );
  };

  const renderOTPScreen = () => {
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
              fontSize: 14,
              fontWeight: '400',
              color: '#000'
            }}
          >
            Enter OTP
          </Typography>
          <Typography
            sx={{
              position: 'relative',
              display: 'flex',
              transform: 'initial',
              fontSize: 14,
              fontWeight: '400',
              color: '#000'
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
              fontSize: '12px'
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
        <div
          style={{ width: '100%', marginTop: '1rem' }}
          onClick={() => {
            if (otp.length < 4) {
              setOtpErrors('Enter valid OTP');
            }
          }}
        >
          <Button
            disabled={otp.length !== 4}
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 48,
              border: 'none',
              fontSize: '16px',
              fontWeight: '500',
              borderRadius: '48px',
              backgroundColor: '#fac510',
              color: '#231F20',
              // textTransform: "uppercase",
              '&:disabled': {
                backgroundColor: 'rgba(255, 221, 0, 0.5)'
              },
              ':hover': {
                backgroundColor: '#fac510d3'
              }
            }}
            onClick={() => {
              onSubmitOTP();
            }}
          >
            <Typography>Confirm</Typography>
          </Button>
        </div>
        {renderTermsAndCondition()}
      </Box>
    );
  };

  const isBackButtonEnable = React.useMemo(() => {
    switch (loginDetails.tabType) {
      case TabTypeConstant.ENTER_MOBILE_NUMBER: {
        return false;
      }

      case TabTypeConstant.ENTER_OTP: {
        return true;
      }

      case TabTypeConstant.REGISTER: {
        return true;
      }

      default: {
        return false;
      }
    }
  }, [loginDetails]);

  const onClickBackButton = () => {
    switch (loginDetails.tabType) {
      case TabTypeConstant.ENTER_MOBILE_NUMBER: {
        break;
      }

      case TabTypeConstant.ENTER_OTP: {
        setOtpErrors('');
        setOtp('');
        setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER);
        break;
      }

      case TabTypeConstant.REGISTER: {
        setOtpErrors('');
        setOtp('');
        setTabType(TabTypeConstant.ENTER_OTP);
        break;
      }

      default: {
        break;
      }
    }
  };

  const renderContent = () => {
    switch (loginDetails.tabType) {
      case TabTypeConstant.ENTER_MOBILE_NUMBER:
        return renderEnterMobileNumberScreen();

      case TabTypeConstant.ENTER_OTP:
        return renderOTPScreen();

      case TabTypeConstant.REGISTER:
        return <SignUp renderTermsAndCondition={renderTermsAndCondition()} />;

      default:
        return renderEnterMobileNumberScreen();
    }
  };

  const getHeaderSidebarName = () => {
    switch (loginDetails.tabType) {
      case TabTypeConstant.ENTER_MOBILE_NUMBER:
        return 'Login/Sign up';

      case TabTypeConstant.ENTER_OTP:
        return 'Login/Sign up';

      case TabTypeConstant.REGISTER:
        return 'Registration';

      default:
        return 'Login/Sign up';
    }
  };

  return (
    <SidebarWrapper
      onClickBackButton={onClickBackButton}
      isBackButtonEnable={isBackButtonEnable}
      header={getHeaderSidebarName()}
    >
      {renderContent()}
    </SidebarWrapper>
  );
};

export default Login;
