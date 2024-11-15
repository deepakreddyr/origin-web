import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';

import EmptyCartImg from '../../assets/empty-cart.svg';
import styles from './style.module.css';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { isCartPageIsOpen } from '../../context/atoms';

export default function EmptyCart() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useAtom(isCartPageIsOpen);

  return (
    <Box className={styles['empty-container']}>
      <Image src={EmptyCartImg} alt="empty" />
      <Box className={styles.container}>
        <Typography className={styles['cart-heading']}>
          Your Cart is empty
        </Typography>
        <Typography className={styles['cart-details']}>
          Try adding items to cart to checkout
        </Typography>
        <Button
          className={styles['empty-btn']}
          onClick={() => {
            router.push('/');
            setIsOpen(false);
          }}
        >
          Explore Now
        </Button>
      </Box>
    </Box>
  );
}
