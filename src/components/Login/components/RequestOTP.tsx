import { Box, InputLabel, Typography, styled, InputBase, Button } from '@mui/material';
import React, { useState } from 'react';
import NextLink from 'next/link';
import { TabTypeConstant } from '../constants/tabTypeContent';
import { request, header } from '@/utilities/request';
import PrimaryRoundedCta from '@/components/shared/PrimaryRoundedCta';
import TermsAndConditions from '../TermsAndConditions';
import { mainApiUrl } from '@/url';
import { useDispatch } from 'react-redux';
import { setTabType } from '@/store/slice/loginSlice';

interface Props {
  mobileNumber: string;
  setMobileNumber: any;
  otpErrors: any;
  setOtpErrors: any;
}

const RequestOTP = (props: Props) => {
  const { mobileNumber, setMobileNumber } = props;
  const { otpErrors, setOtpErrors } = props;
  const [mobileNumberErrors, setMobileNumberErrors] = useState('');
  const [isNumberDisabled, setIsNumberDisabled] = useState(true);
  // const [otpErrors, setOtpErrors] = useState("");
  const dispatch = useDispatch();

  const isMobileNumberValid = (number: any) => {
    const phoneRegex = /^[0-9]\d{9}$/;
    return phoneRegex.test(number);
  };
  const isButtonDisabled = !isMobileNumberValid(Number(mobileNumber));

  const onSubmitMobileNumber = async () => {
    if (!isMobileNumberValid(mobileNumber)) {
      setMobileNumberErrors('Incorrect mobile number');
      return;
    }
    try {
      setOtpErrors('');
      const formData = new FormData();
      const requestURL = mainApiUrl.requestOtp;
      formData.append('phone', mobileNumber);
      formData.append('scope', 'client');
      await request(requestURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData
      });
      dispatch(setTabType(TabTypeConstant.ENTER_OTP));

      setMobileNumberErrors('');
    } catch (error) {
      setMobileNumberErrors('Unable to login please try later');
    }
  };

  const onChangeNumber = (event: any) => {
    const { value } = event.target;
    const inputPhoneNumber = value.replace(/\D/g, '');
    if (inputPhoneNumber.length > 10) {
      return;
    }
    setMobileNumber(inputPhoneNumber);
  };

  return (
    <div className="">
      <div className="flex flex-col gap-[2.2vw] ">
        <div>
          <p className="font-[SofiaPro] sm:pb-[.78vw] xs:pb-[3vw] font-semibold text-[16px] text-black">
            Mobile Number*
          </p>
          <div className="bg-primary-100 min-h-[48px] px-[3.6vw] md:px-[1.67vw] flex items-center gap-[5px] rounded-full">
            <p className="font-[SofiaPro] text-[14px] ">+91</p>
            <input
              className="border-none outline-none w-full bg-primary-100 placeholder:text-[#231F2099] font-[SofiaPro] text-[14px]"
              placeholder="10 Digit Mobile Number"
              type="number"
              value={mobileNumber ? mobileNumber : ''}
              onChange={onChangeNumber}
              onKeyDown={(e) => {
                if (
                  ['e', 'E', '+', '-', '.'].includes(e.key) ||
                  (e.keyCode >= 65 && e.keyCode <= 90) // Prevent letters A-Z
                ) {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <Typography
            variant="body2"
            sx={{
              fontSize: '12px',
              color: '#C70000',
              fontWeight: 'normal',
              display: 'block',
              fontFamily: 'SofiaPro',
              paddingTop: '10px'
            }}
          >
            {mobileNumberErrors}
          </Typography>
        </div>

        <div className={'mt-[24px]'}>
          <PrimaryRoundedCta style="" name="Get OTP" handler={onSubmitMobileNumber} isDisabled={isButtonDisabled} />
        </div>
      </div>
      <TermsAndConditions />
    </div>
  );
};

export default RequestOTP;
