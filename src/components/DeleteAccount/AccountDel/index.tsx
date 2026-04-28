import { Backdrop } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';

import AccountDelContent from '../AccountDelContent';
import { trackMixpanelEvent } from '@/utilities/mixpanel';
import { AnalyticsEvents } from '@/utilities/mixpanelEvents';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(4)
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#2b2b2b',
    border: '1px solid #C5C5C7',
    fontSize: 16,
    width: '100%',
    padding: '12px',
    transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:focus': {
      boxShadow: '0 7px 17px rgb(0 0 0 / 10%), 0 1px 3px rgb(0 0 0 / 10%)',
      borderColor: theme.palette.primary.main
    }
  }
}));

const AccountDel = () => {
  const [contactNumber, setContactNumber] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [isAccountDeleted, setIsAccountDeleted] = useState(false);
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
  const [otp, setOtp] = useState('');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [contactNumberError, setContactNumberError] = useState('');
  const [otpNumberError, setOtpNumberError] = useState('');
  const [deleteRequestDialogOpen, setDeleteRequestDialogOpen] = useState(false);

  const onSubmit = async () => {
    try {
      const requestURL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/auth/otp`;
      const response = await fetch(requestURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: contactNumber,
          scope: 'client',
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID || '',
          client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET || ''
        })
      });

      if (response.status === 419 || response.status === 522) {
        setIsAccountDeleted(true);
        setContactNumberError('This account is already deleted');
      } else {
        setShowAdditionalInputs(true);
      }
    } catch (err) {
      setContactNumberError('An error occurred');
    }
  };

  const authUser = async () => {
    try {
      const authURL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/oauth/token`;
      const authResponse = await fetch(authURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: `+91${contactNumber}`,
          password: otp,
          scope: '*',
          grant_type: 'password',
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID || '',
          client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET || ''
        })
      });

      if (authResponse.ok) {
        const authData = await authResponse.json();
        return authData.access_token;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const onRequestDelete = async () => {
    try {
      // Validate OTP length
      if (otp.length !== 4) {
        setOtpNumberError('OTP should be exactly 4 digits');
        return;
      }

      // Authenticate the user and obtain the access token
      const accessToken = await authUser();
      if (!accessToken) return;

      const requestDeleteURL = `${process.env.NEXT_PUBLIC_API_URL}/api/v3/user/request-delete`;
      const response = await fetch(requestDeleteURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'MM-Device-Type': 'web',
          'MM-Build-Version': '1.0.1',
          'Delivery-Type': 'app'
        },
        body: JSON.stringify({
          otp
        })
      });

      if (response.ok) {
        trackMixpanelEvent(AnalyticsEvents.DELETE_ACCOUNT);
        setSuccessDialogOpen(true);
      } else if (response.status === 422 || response.status === 522) {
        // Show the dialog for "Delete request available already"
        setDeleteRequestDialogOpen(true);
      } else {
        setContactNumberError('Error submitting account deletion request');
      }
    } catch (err) {
      setContactNumberError('An error occurred');
    }
  };

  const validateForm = () => {
    if (contactNumber.length === 0) {
      setContactNumberError('Contact Number is required');
      return true;
    }

    // Mobile number validation regex (assuming it should start with '+91' followed by 10 digits)
    const mobileNumberRegex = /^\d{10}$/;
    if (!mobileNumberRegex.test(contactNumber)) {
      setContactNumberError('Invalid mobile number format');
      return true;
    }

    setContactNumberError('');
    return false;
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    window.location.reload();
  };

  const handleDeleteRequestDialogClose = () => {
    setDeleteRequestDialogOpen(false);

    window.location.reload();
  };

  return (
    <>
      <AccountDelContent />
      {/* <Grid className="grid-item get-in-touch-item" item xs={12} md={6}> */}
      <Box
        sx={{
          maxWidth: '400px',
          width: '100%',
          mx: 'auto',
          py: {
            xs: 2,
            sm: 4,
            md: 6,
            lg: 8,
            xl: 10
          }
        }}
      >
        {/* <Typography variant="h4" component="h4" sx={{ fontWeight: '400' }}>
            Leave us your details below and we’ll get in touch with you
          </Typography> */}
        <Box
          component="form"
          className="form-block"
          sx={{
            width: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <FormControl sx={{ mt: 0 }} variant="standard">
            <InputLabel sx={{ width: '400px', fontWeight: '500', fontSize: '18px' }} shrink htmlFor="contactNo">
              Contact Number <Box component="small">*</Box>
            </InputLabel>
            <BootstrapInput
              placeholder="Enter your contact number"
              id="contactNo"
              value={contactNumber}
              onChange={(e) => {
                setContactNumber(e.target.value);
                if (e.target.value.length > 0) {
                  setContactNumberError('');
                } else {
                  setContactNumberError('Contact Number is required');
                }
              }}
              disabled={showAdditionalInputs}
            />
            {contactNumberError && (
              <Typography
                variant="caption"
                sx={{
                  color: '#C83532',
                  mt: 1
                }}
              >
                {contactNumberError}
              </Typography>
            )}
          </FormControl>

          {showAdditionalInputs && (
            <>
              <FormControl sx={{ mt: 3 }} variant="standard">
                <InputLabel sx={{ width: '400px', fontWeight: '500', fontSize: '18px' }} shrink htmlFor="otp">
                  OTP <Box component="small">*</Box>
                </InputLabel>
                <BootstrapInput
                  placeholder="Enter OTP"
                  id="otp"
                  value={otp}
                  onChange={(e) => {
                    const enteredValue = e.target.value;

                    if (/^\d*$/.test(enteredValue) && enteredValue.length <= 4) {
                      setOtp(enteredValue);
                      setOtpNumberError('');
                    } else {
                      setOtpNumberError('Please enter a valid 4-digit OTP');
                    }
                  }}
                />

                {otpNumberError && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#C83532',
                      mt: 1
                    }}
                  >
                    {otpNumberError}
                  </Typography>
                )}
              </FormControl>

              <Button
                sx={{
                  width: '400px',
                  flexShrink: 0,
                  ml: 'auto',
                  mt: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                    lg: 5,
                    xl: 6
                  }
                }}
                variant="contained"
                className="lets-talk"
                color="success"
                onClick={onRequestDelete}
              >
                Request Delete Account
              </Button>
            </>
          )}

          {!showAdditionalInputs && (
            <Button
              sx={{
                width: '400px',
                flexShrink: 0,
                ml: 'auto',
                mt: {
                  xs: 2,
                  sm: 3,
                  md: 4,
                  lg: 5,
                  xl: 6
                }
              }}
              variant="contained"
              className="lets-talk"
              color="success"
              onClick={() => {
                if (!validateForm()) {
                  onSubmit();
                }
              }}
            >
              Check Account Status
            </Button>
          )}
        </Box>
      </Box>
      {/* </Grid> */}

      <Dialog
        open={successDialogOpen}
        onClose={handleSuccessDialogClose}
        BackdropComponent={Backdrop}
        BackdropProps={{
          invisible: true
        }}
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description"
      >
        <DialogTitle id="success-dialog-title">Success</DialogTitle>
        <DialogContent>
          <DialogContentText id="success-dialog-description">
            Your account deletion request has been submitted successfully. You can check after some time.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button onClick={handleSuccessDialogClose} autoFocus>
            {' '}
            OK
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteRequestDialogOpen}
        onClose={handleDeleteRequestDialogClose}
        BackdropComponent={Backdrop}
        BackdropProps={{
          invisible: true
        }}
        aria-labelledby="delete-request-dialog-title"
        aria-describedby="delete-request-dialog-description"
      >
        <DialogTitle id="delete-request-dialog-title">Alert</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-request-dialog-description">
            Delete request is available already.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteRequestDialogClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AccountDel;
