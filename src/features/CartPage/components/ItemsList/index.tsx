import { Box, Typography } from '@mui/material';
import { useAtom } from 'jotai';

import { cartItems } from '../../context/atoms';
import Item from '../Item';

const ItemsList = () => {
  const [cart] = useAtom(cartItems);
  return (
    <Box
      className="review-cart"
      sx={{
        backgroundColor: 'rgba(242, 238, 228, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: '2px solid #F2EEE4',
        padding: '1rem',

        margin: '0.3rem',
        borderRadius: '16px',
      }}
    >
      <Typography
        component="h3"
        variant="body1"
        sx={{
          fontFamily: 'Stinger',
          fontSize: '18px',
          fontWeight: 600,
          color: '#231F20CC',
        }}
      >
        Review cart
      </Typography>
      <Box
        className="review-cart-list"
        component="ul"
        sx={{
          listStyleType: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          width: '100%',
        }}
      >
        {cart?.map((item: any) => (
          <Item item={item} key={item.id} />
        ))}
      </Box>
    </Box>
  );
};

export default ItemsList;
