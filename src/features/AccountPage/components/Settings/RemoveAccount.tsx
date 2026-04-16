import { Box, Button, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

import Cross from '../../../../assets/svg/xmark.svg';

interface Props {
  onDelete?: () => void;
  onCancel?: () => void;
}

const RemoveAccount = (props: Props) => {
  const { onCancel, onDelete } = props;
  return (
    <Box
      className="remove-account-wrapper"
      sx={{
        maxWidth: 434,
        width: '100%',
        height: '80svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '20px',
        paddingBottom: '20px'
      }}
    >
      <Box
        className="remove-account"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          maxWidth: '100%',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <Box
          className="confirm-account-delete"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'SofiaPro',
              fontWeight: 600,
              fontSize: '18px'
            }}
          >
            Confirm Account Delete?
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              textAlign: 'center'
            }}
          >
            <Typography
              component="span"
              variant="body1"
              sx={{
                fontFamily: 'SofiaPro',
                color: '#5A5A5A',
                fontWeight: 400,
                fontSize: 14
              }}
            >
              You are about to loose all the data and rewards attached with this mobile number permanently!
            </Typography>
            <Typography
              component="small"
              variant="body2"
              sx={{
                fontFamily: 'SofiaPro',
                color: '#5A5A5A',
                fontWeight: 400,
                fontSize: 14
              }}
            >
              Please contact our leading customer support team get any issues sorted.
            </Typography>
          </Box>
        </Box>
        <Box
          className="button-group"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={onDelete}
            sx={{
              borderRadius: '25px',
              fontFamily: 'SofiaPro',
              textTransform: 'capitalize',
              height: '48px',
              paddingLeft: '20px',
              paddingRight: '20px'
            }}
          >
            Delete Account
          </Button>
          <Button
            variant="contained"
            color="warning"
            component="a"
            href="tel:+919900508216"
            sx={{
              backgroundColor: '#fac510',
              color: 'black',
              borderRadius: '25px',
              fontFamily: 'SofiaPro',

              boxShadow: 'none',
              textTransform: 'capitalize',
              height: '48px',
              paddingLeft: '20px',
              paddingRight: '20px',
              textDecoration: 'none',
              ':hover': {
                backgroundColor: '#fac510',
                color: 'black',
                boxShadow: 'none',
                textDecoration: 'none'
              }
            }}
          >
            Contact Support
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RemoveAccount;
