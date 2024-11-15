import { Box, Button, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

import Happy from '../../../../assets/svg/happy.svg';
import Sad from '../../../../assets/svg/sad.svg';

const Rate = () => {
  return (
    <Box
      className="rating-empty"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        paddingTop: '20px',
        paddingBottom: '20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 'auto',
          marginBottom: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 500, textAlign: 'center', lineHeight: 1.1 }}
          >
            Rate your
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 500,
              textAlign: 'center',
              lineHeight: 1.1,
              color: '#00855B',
            }}
          >
            Order Experience!
          </Typography>
        </Box>
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <IconButton>
            <Image src={Happy} alt="Happy" />
          </IconButton>
          <IconButton>
            <Image src={Sad} alt="Sad" />
          </IconButton>
        </Box>
      </Box>
      <Button
        sx={{
          width: '100%',
          textTransform: 'uppercase',
          fontSize: 14,
        }}
        variant="contained"
        color="success"
      >
        Submit Feedback
      </Button>
    </Box>
  );
};

export default Rate;
