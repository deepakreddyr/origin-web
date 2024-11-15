import { Box, Typography } from '@mui/material';
import React from 'react';

const RewardCoin = () => {
  const list = [
    {
      title: 'Customers can earn MM coins from the first order onwards.',
    },
    {
      title:
        'Customers will earn MM coins only when their order is delivered only, not upon payment of order.',
    },
    {
      title:
        'Can be earned and redeemed on all products except milk or milk products',
    },
    {
      title:
        'Reward coins cannot be exchanged or redeemed for cash in-part or full & do not carry any real money value.',
    },
  ];

  return (
    <Box
      className="reward-coin"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <Typography variant="body1" component="h4" sx={{ fontWeight: 600 }}>
        1 Reward coin = 1 Rupee
      </Typography>
      <Box
        component="ul"
        className="reward-coin-list"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          paddingLeft: 3,
          gap: 1,
        }}
      >
        {list.map((item, i) => (
          <Box
            key={`${item}-${i}`}
            component="li"
            className="reward-coin-list-item"
            sx={{ fontWeight: 400, fontSize: 12 }}
          >
            <Typography
              component="span"
              variant="body2"
              sx={{ fontWeight: 400 }}
            >
              {item.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RewardCoin;
