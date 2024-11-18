import { Box, Button, FormControl, InputBase, InputLabel, MenuItem, Select, styled, Typography } from '@mui/material';
import { useSetAtom } from 'jotai';
import Image from 'next/image';
import React, { FC } from 'react';

import Gift from '@/features/Login/assets/svg/gift.svg';
import { login } from '../../context/atom';
import type { LoginAtom } from '../../types/LoginAtom';
import { header, request } from '@/utilities/request';

const BootstrapInput = styled(InputBase)(() => ({
  width: '100%',
  input: {
    paddingLeft: '12px',
    paddingRight: '12px',
    width: '100%',
    height: 48,
    marginTop: '0.3rem',
    borderRadius: '48px',
    backgroundColor: '#F8F4E9',
    boxSizing: 'border-box'
  }
}));

const MenuProps = {
  PaperProps: {
    sx: {
      bgcolor: '#000',

      '& .MuiMenuItem-root': {
        color: '#fff'
      }
    }
  }
};

interface Props {
  renderTermsAndCondition: React.JSX.Element;
}

const SignUp: FC<Props> = ({ renderTermsAndCondition }) => {
  const setLoginDetails = useSetAtom(login);
  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [errors, setErrors] = React.useState({
    name: '',
    gender: '',
    email: ''
  });

  const hasSpecialCharsOrNumbers = (str: string) => {
    return /[^a-zA-Z\s]/.test(str);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFields = () => {
    let valid = true;
    const newErrors = { name: '', gender: '', email: '' };

    // Name validation
    if (!name) {
      newErrors.name = 'Name is required.';
      valid = false;
    } else if (hasSpecialCharsOrNumbers(name)) {
      newErrors.name = 'Name cannot contain special characters or numbers.';
      valid = false;
    } else if (name.length > 26) {
      newErrors.name = 'Name cannot be more than 26 characters.';
      valid = false;
    }

    // Gender validation
    if (!gender) {
      newErrors.gender = 'Gender is required.';
      valid = false;
    }

    // Email validation (Optional field)
    if (email && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
      valid = false;
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

      await request(requestURL, {
        method: 'POST',
        headers: {
          Authorization: header(),
          Accept: 'application/json'
        },
        body: formData
      });

      setLoginDetails((prevDetails: LoginAtom) => ({
        ...prevDetails,
        isLoginSidebarOpen: false,
        isLogin: true
      }));

      if (window) window.location.reload();
    } catch (error: any) {
      if (error?.response?.status === 500) {
        setErrors((prev) => ({
          ...prev,
          email: 'This email is already registered. Please use a different email.'
        }));
      }
    }
  };

  return (
    <>
      <Typography
        sx={{
          color: 'rgba(35, 31, 32, 0.8)',
          fontSize: '14px',
          fontWeight: '400',
          margin: '-2.5rem 0 2rem 0'
        }}
      >
        Complete your registration to unlock the world of fresh produce!
        <Image src={Gift} alt="gift" />
      </Typography>

      <Box
        className="signup"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
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
              <InputLabel
                required
                htmlFor="name"
                sx={{
                  position: 'relative',
                  display: 'flex',
                  transform: 'initial',
                  color: '#000',
                  '& .MuiInputLabel-asterisk': {
                    display: 'none'
                  }
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 'medium'
                  }}
                >
                  Name
                </Typography>
              </InputLabel>
              <BootstrapInput
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: '' }));
                  }
                }}
                placeholder="Enter your name"
                id="name"
              />
              {errors.name && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#C70000',
                    fontWeight: 'normal',
                    display: 'block'
                  }}
                >
                  {errors.name}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                width: '100%'
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 'medium'
                }}
              >
                Gender
              </Typography>
              <FormControl
                sx={{
                  width: '100%',
                  '& .MuiInputBase-root	': {
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    width: '100%',
                    marginTop: '0.3rem',
                    height: 48,
                    borderRadius: '48px',
                    backgroundColor: '#F8F4E9',
                    boxSizing: 'border-box'
                  },
                  '& .MuiInputBase-root	.MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                    borderRadius: '5px'
                  }
                }}
              >
                <Select
                  sx={{
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    width: '80%',
                    marginTop: '0.3rem',
                    height: 48,
                    borderRadius: '48px',
                    backgroundColor: '#000',
                    boxSizing: 'border-box'
                  }}
                  MenuProps={MenuProps}
                  value={gender}
                  label="Gender"
                  onChange={(event) => {
                    setGender(event.target.value);
                    if (errors.gender) {
                      setErrors((prev) => ({ ...prev, gender: '' }));
                    }
                  }}
                >
                  <MenuItem value={'Male'}>Male</MenuItem>
                  <MenuItem value={'Female'}>Female</MenuItem>
                  <MenuItem value={'Other'}>Other</MenuItem>
                  <MenuItem value={`Prefer not to disclose`}>{`Prefer not to disclose`}</MenuItem>
                </Select>
              </FormControl>
              {errors.gender && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#C70000',
                    fontWeight: 'normal',
                    display: 'block'
                  }}
                >
                  {errors.gender}
                </Typography>
              )}
            </Box>
            <Box className="form-group">
              <InputLabel
                htmlFor="email"
                sx={{
                  position: 'relative',
                  display: 'flex',
                  transform: 'initial',
                  fontSize: 14,
                  fontWeight: 'medium',
                  color: '#000'
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 'medium'
                  }}
                >
                  Email id (Optional)
                </Typography>
              </InputLabel>
              <BootstrapInput
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: '' }));
                  }
                }}
                placeholder="yourname@mail.com"
                id="email"
                required={false}
              />
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
          <Button
            variant="contained"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 48,
              width: '100%',
              marginTop: 8,
              backgroundColor: '#FFDD00',
              textTransform: 'uppercase',
              border: 'none',
              color: '#000',
              borderRadius: '48px',
              '&:disabled': {
                backgroundColor: 'rgba(255, 221, 0, 0.5)'
              },
              ':hover': {
                backgroundColor: '#ffdd00d3'
              }
            }}
            onClick={onSubmitRegister}
          >
            Proceed
          </Button>
        </FormControl>
        {renderTermsAndCondition}
      </Box>
    </>
  );
};

export default SignUp;
