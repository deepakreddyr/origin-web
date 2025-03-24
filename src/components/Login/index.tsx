import { Box, Button, FormControl, InputBase, InputLabel, styled, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import NextLink from 'next/link';
import React, { useMemo, useState } from 'react';
// import { header, request } from "../../utils/request";
import { OtpInput } from './components/OtpInput';
import ResendOTP from './components/ResendButton';
import SidebarWrapper from './components/SidebarWrapper';
import SignUp from './components/SignUp';
import { TabTypeConstant } from './constants/tabTypeContent';
import { login } from './context/atom';
import type { LoginAtom } from './types/LoginAtom';
// import RequestOTP from './components/RequestOTP'
import VerifyOTP from './components/VerifyOTP';
import { profileAtom } from '@/features/AccountPage/context/atoms';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import { setIsSidebarOpen, setLoginDetails, setTabType } from '@/store/slice/loginSlice';
import RequestOTP from './components/RequestOTP';
const BootstrapInput = styled(InputBase)(() => ({
  width: '100%',
  input: {
    paddingLeft: '12px',
    paddingRight: '12px',
    width: '100%',
    marginTop: '0.3rem',
    height: 48,
    borderRadius: '48px',
    backgroundColor: '#F8F4E9',
    boxSizing: 'border-box'
  }
}));

const Login = () => {
  // const [loginDetails, setLoginDetails] = useAtom(login)
  const [profile, setProfileAtom] = useAtom(profileAtom);
  const loginDetails = useSelector((state: any) => state.loginDetails);

  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileNumberErrors, setMobileNumberErrors] = useState('');
  const [otp, setOtp] = React.useState('');
  const [otpErrors, setOtpErrors] = useState('');
  const dispatch = useDispatch();

  const isBackButtonEnable = useMemo(() => {
    switch (loginDetails.tabType) {
      case TabTypeConstant.ENTER_MOBILE_NUMBER: {
        return false;
      }

      case TabTypeConstant.ENTER_OTP: {
        return true;
      }

      case TabTypeConstant.REGISTER: {
        return false;
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
        dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
        break;
      }

      case TabTypeConstant.REGISTER: {
        setOtpErrors('');
        setOtp('');
        dispatch(setTabType(TabTypeConstant.ENTER_OTP));
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
        return (
          <RequestOTP
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            otpErrors={otpErrors}
            setOtpErrors={setOtpErrors}
          />
        );

      case TabTypeConstant.ENTER_OTP:
        return (
          <VerifyOTP
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            otpErrors={otpErrors}
            setOtpErrors={setOtpErrors}
          />
        );

      case TabTypeConstant.REGISTER:
        return <SignUp />;

      default:
        break;
      // return (
      //     <RequestOTP
      //         mobileNumber={mobileNumber}
      //         setMobileNumber={setMobileNumber}
      //         otpErrors={otpErrors}
      //         setOtpErrors={setOtpErrors}
      //     />
      // )
    }
  };
  return <>{renderContent()}</>;
  // return (
  //     <SidebarWrapper
  //         onClickBackButton={onClickBackButton}
  //         isBackButtonEnable={isBackButtonEnable}
  //     >
  //         {renderContent()}
  //     </SidebarWrapper>
  // )
};

export default Login;
