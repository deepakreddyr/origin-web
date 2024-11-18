import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import * as React from 'react';

import InfoLogo from '../../../../assets/svg/locations/info.png';
import type { ServiceabilityPayload } from '../../types/ServiceabilityPayload';

interface Props {
  triggerServiceability: (payload: ServiceabilityPayload) => void;
}

export default function DetectLocation(props: Props) {
  const { triggerServiceability } = props;
  const [isError, setIsError] = React.useState<boolean>(false);
  const [isDetecting, setIsDetecting] = React.useState<boolean>(false);

  const getLatLan = async () => {
    navigator?.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lng } }) => {
        const pos = { lat, lng };
        // !data need for name and formatted_address
        const payload: ServiceabilityPayload = {
          latitude: String(pos.lat),
          longitude: String(pos.lng),
          name: '',
          formatted_address: '',
          address_id: ''
        };
        setIsDetecting(false);
        triggerServiceability(payload);
      },
      () => {
        // alert('Sorry, browser does not support geolocation!');
      },
      { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true }
    );
  };

  const onClickAllowPermission = async () => {
    const onSuccess = () => {
      getLatLan();
    };

    const onError = () => {
      setIsDetecting(false);
      setIsError(true);
    };

    const options = {
      maximumAge: 10000,
      timeout: 5000,
      enableHighAccuracy: true
    };

    setIsDetecting(true);

    await navigator?.geolocation.getCurrentPosition(onSuccess, onError, options);
  };

  const renderErrorLocation = () => {
    return (
      <Box
        sx={{
          fontWeight: '500',
          padding: '1rem',
          fontSize: '12px',
          background: '#EF5B3C',
          color: '#fff',
          margin: '0.5rem',
          borderRadius: '10px',
          lineHeight: '16px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            width: '4rem',
            height: '2rem',
            marginRight: '0.5rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image src={InfoLogo} alt="info" />
        </Box>
        <Typography variant="subtitle2">
          Error! Permission to Current location is restricted. Try clicking on privacy or Lock icon to give access to
          Location services for this website.
        </Typography>
      </Box>
    );
  };
  return (
    <Box>
      <Box>
        <Box>
          <Typography sx={{ fontWeight: '600', padding: '1rem', fontSize: '14px' }}>
            Let’s Detect your Location
          </Typography>
          <Typography
            sx={{
              fontWeight: '500',
              padding: '1rem',
              fontSize: '12px',
              marginTop: '-1.5rem'
            }}
          >
            Allowing yo use your location service, will enable us to suggest and pickup fresh fruits & vegetables from
            our nearest stores.
          </Typography>
        </Box>
        <Box>
          {isDetecting ? (
            <Button
              variant="outlined"
              color="success"
              sx={{
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '500',
                margin: '0.1rem 1rem 1rem 1rem',
                padding: '0.5rem 1rem'
              }}
            >
              {`...Detecting`}
            </Button>
          ) : (
            <Button
              onClick={onClickAllowPermission}
              sx={{
                border: '1px solid #00855b',
                borderRadius: '10px',
                background: '#00855b',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                margin: '0.1rem 1rem 1rem 1rem',
                '&:hover': {
                  color: '#00855b'
                }
              }}
            >
              CONTINUE
            </Button>
          )}
        </Box>
      </Box>
      {isError && renderErrorLocation()}
    </Box>
  );
}
