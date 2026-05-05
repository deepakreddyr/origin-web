import { Box, Button, FormControl, InputBase, InputLabel, MenuItem, styled, Typography } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Gift from '../../../../assets/svg/gift.svg';
import { request, header } from '@/utilities/request';

import { login } from '../../context/atom';
import type { LoginAtom } from '../../types/LoginAtom';
import PrimaryRoundedCta from '@/components/shared/PrimaryRoundedCta';
import TermsAndConditions from '../../TermsAndConditions';
import SelectDropdown from './Select';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLogin, setLoginDetails, setTabType, setUser } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '../../constants/tabTypeContent';
import { profileAtom } from '@/features/AccountPage/context/atoms';
import ProfileAtom from '@/features/AccountPage/types/ProfileAtom';
import { trackEvent, identifyUser, stopTrackTime } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';

const SignUp = () => {
  // const setLoginDetails = useSetAtom(login)
  const [profileDetails, setProfileAtom] = useAtom(profileAtom);

  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [errors, setErrors] = React.useState({
    name: '',
    gender: '',
    email: ''
  });
  const dispatch = useDispatch();

  const loginDetails = useSelector((state: any) => state.loginDetails);

  React.useEffect(() => {
    trackEvent(AnalyticsEvents.USER_DETAILS);
  }, []);

  const hasSpecialCharsOrNumbers = (str: string) => {
    return /[^a-zA-Z0-9\s]/.test(str);
  };

  const validateFields = () => {
    let valid = true;
    const newErrors = { name: '', gender: '', email: '' };

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required.';
      valid = false;
    } else if (name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long.';
      valid = false;
    } else if (hasSpecialCharsOrNumbers(name)) {
      newErrors.name = 'Name cannot contain special characters or numbers.';
      valid = false;
    } else if (name.length > 26) {
      newErrors.name = 'Name cannot be more than 26 characters.';
      valid = false;
    }

    // Gender validation - This ensures the error is set if gender is empty
    if (!gender) {
      newErrors.gender = 'Please select your gender.';
      valid = false;
    }

    // Email validation (RegEx check)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address.';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const onSubmitRegister = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      const formData = new FormData();
      const requestURL = `/api/v1/user/profile`;

      formData.append('name', name);
      formData.append('email', email);
      formData.append('gender', gender);
      formData.append('user_type', 'individual');
      formData.append('scope', 'client');
      formData.append('address_name', '');
      formData.append('client_id', process.env.NEXT_PUBLIC_CLIENT_ID || '');
      formData.append('client_secret', process.env.NEXT_PUBLIC_CLIENT_SECRET || '');
      formData.append('scope', '*');

      const response: any = await request(requestURL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${loginDetails.user}`,
          Accept: 'application/json'
        },
        body: formData
      });

      if (response.data) {
        setProfileAtom((prev: ProfileAtom) => ({
          ...prev,
          data: response.data
        }));
        trackEvent(AnalyticsEvents.REGISTRATION_SUCCESSFUL);
        trackEvent(AnalyticsEvents.REGISTERED);
        stopTrackTime(AnalyticsEvents.TRACK_REG_USER_DETAILS);
        const userToken = localStorage.setItem('user_token', loginDetails.user);
        // dispatch(setUser(userToken));
        dispatch(setIsLogin(true));
        const { profile } = response.data;
        if (!profile.address) {
          dispatch(setTabType(TabTypeConstant.MANAGE_ADDRESS));
        }

        // Identify the user in analytics using phone number as distinct_id
        const mobileNum = loginDetails.mobileNumber || profile?.phone;
        const identifier = mobileNum || profile?.email || email || name;
        if (identifier) identifyUser(String(identifier));

        trackEvent(AnalyticsEvents.USER_SIGNUP, {
          mobile_number: String(mobileNum || ''),
          user_name: name || profile?.name || '',
          gender: gender || profile?.gender || '',
          email_id: email || profile?.email || ''
        });
      }

      // No reload needed for smooth flow
    } catch (error: any) {
      if (error?.response?.status === 500) {
        setErrors((prev) => ({
          ...prev,
          email: 'This email is already registered. Please use a different email.'
        }));
      }
    }
  };

  const handleValueChange = (name: string, value: any) => {
    setGender(value);
    if (errors.gender) {
      setErrors((prev) => ({
        ...prev,
        gender: ''
      }));
    }
  };

  return (
    <>
      {/* <Typography
        sx={{
          color: '#231F20CC',
          fontSize: '14px',
          fontWeight: '400',
          margin: '0rem 0 2rem 0',
          fontFamily: 'SofiaPro'
        }}
      >
        Complete registration to unlock exclusive discounts and coupons{' '}
      </Typography> */}

      <Box>
        <FormControl
          variant="standard"
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          <Box
            className="signup-main"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Box className="form-group">
              <Typography
                sx={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  fontWeight: 600,
                  fontFamily: 'SofiaPro',
                  color: '#231F20',
                  paddingBottom: '12px'
                }}
              >
                Name
              </Typography>

              <label
                htmlFor="name"
                className="bg-primary-100 min-h-[48px] px-[3.6vw] md:px-[1.67vw] flex items-center gap-[5px] rounded-full cursor-text"
              >
                <input
                  className="border-none outline-none bg-primary-100 placeholder:text-[#231F2099] placeholder:text-[14px] md:placeholder:text-[.97vw] w-full font-[SofiaPro] text-[14px]"
                  placeholder="Enter Your Name"
                  required={true}
                  type="text"
                  value={name}
                  id="name"
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors((prev) => ({
                        ...prev,
                        name: ''
                      }));
                    }
                  }}
                />
              </label>
              {errors.name && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#C70000',
                    fontWeight: 'normal',
                    display: 'block',
                    fontFamily: 'SofiaPro'
                  }}
                >
                  {errors.name}
                </Typography>
              )}
            </Box>
            <SelectDropdown
              name="gender"
              value={gender}
              handler={handleValueChange}
              errors={errors}
              setErrors={setErrors}
            />

            <Box className="form-group pt-[14px] ">
              <Typography
                sx={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  fontWeight: 600,
                  fontFamily: 'SofiaPro',
                  color: '#231F20',
                  paddingBottom: '12px'
                }}
              >
                Email (Optional)
              </Typography>

              <label
                htmlFor="email"
                className="bg-primary-100 min-h-[48px]  px-[3.6vw] md:px-[1.67vw] flex items-center gap-[5px] rounded-full cursor-text"
              >
                <input
                  className="border-none outline-none bg-primary-100 placeholder:text-[#231F2099] placeholder:text-[14px] md:placeholder:text-[.97vw] w-full font-[SofiaPro] text-[14px]"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({
                        ...prev,
                        email: ''
                      }));
                    }
                  }}
                  placeholder="yourname@mail.com"
                  id="email"
                  required={false}
                />
              </label>
              {errors.email && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#C70000',
                    fontWeight: 'normal',
                    display: 'block'
                  }}
                >
                  {errors.email}
                </Typography>
              )}
            </Box>
          </Box>
          <div>
            <PrimaryRoundedCta style="" name="Proceed" handler={onSubmitRegister} isDisabled={false} />
          </div>
        </FormControl>
        <TermsAndConditions />
      </Box>
    </>
  );
};

export default SignUp;
