import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { deleteAddress } from '../../services/deleteAddress';
import type AddressAtom from '../../types/AddressAtom';

interface Props {
  text?: string;
  desc?: string;

  setDeletingAddress: any;
  deletingAddressA: any;
  setAddress: any;
}

const DeleteConfirmation = (props: Props) => {
  const {
    setDeletingAddress,

    text,
    desc,
    deletingAddressA,
    setAddress
  } = props;

  const onCancel = () => {
    setDeletingAddress({
      isActive: false,
      addressDetails: null
    });
  };

  const onDelete = async () => {
    if (deletingAddressA.isActive && deletingAddressA.addressDetails?.address_id) {
      try {
        const res = await deleteAddress(deletingAddressA.addressDetails?.address_id);
        setAddress((prevState: AddressAtom) => ({
          ...prevState,
          data: res,
          address: res
        }));
        setDeletingAddress({
          isActive: false,
          addressDetails: null
        });
      } catch (e) {
        //
      }
    }
  };
  return (
    <Box
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        textAlign: 'center',
        gap: '1rem',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column'
          // Add some space between elements
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: '500', fontFamily: 'SofiaPro' }}>
          {text}
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{
            marginBottom: '1rem',
            color: 'rgba(35, 31, 32, 0.8)',
            fontSize: '14px',
            fontFamily: 'SofiaPro'
          }}
        >
          {desc}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start'
        }}
      >
        {onDelete && (
          <Button
            sx={{
              color: '#C70000',
              border: '2px solid #C70000',
              borderRadius: '48px',
              fontSize: '14px',
              padding: '0.7rem 1.5rem',
              fontWeight: '600',
              marginBottom: '1rem',
              fontFamily: 'SofiaPro',
              textTransform: 'capitalize'
            }}
            onClick={onDelete}
          >
            Delete Address
          </Button>
        )}
        {onCancel && (
          <Button
            sx={{
              color: '#231F20',
              border: '2px solid #231F20',
              borderRadius: '48px',
              fontSize: '14px',
              fontWeight: '600',
              padding: '0.7rem 2.5rem',
              marginLeft: '1rem',
              fontFamily: 'SofiaPro',
              textTransform: 'capitalize'
            }}
            onClick={onCancel}
          >
            Go Back
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DeleteConfirmation;
