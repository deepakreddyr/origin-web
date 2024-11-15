import { Box, Typography } from '@mui/material';
import Image from 'next/image';

import useDeliveryInstructionActions from '../../hooks/useDeliveryInstructionActions';
import type { SingleDeliveryInstruction } from './data/deliveryInstructions';
import styles from './style.module.css';

const DeliveryInstruction = () => {
  const deliveryInstruction = useDeliveryInstructionActions();

  const renderDeliveryInstruction = (item: SingleDeliveryInstruction) => {
    const cssRules = {
      containerClassName: `${
        item.isActivated ? styles['delivery-instruction-list-active-item'] : ''
      } ${styles['delivery-instruction-list-item']}
      `,
    };

    return (
      <Box
        component="li"
        className={cssRules.containerClassName}
        onClick={deliveryInstruction.onChange(item.slug)}
      >
        <Box component="figure">
          <Image className={styles.img} src={item.image} alt="leave-at-gate" />
        </Box>
        <Typography
          component="span"
          sx={{
            fontSize: 10,
            fontWeight: 500,
            color: '#025235',
            display: 'block',
          }}
        >
          {item.name}
        </Typography>
      </Box>
    );
  };

  const renderInstruction = () => {
    return (
      <Box
        component="ul"
        className={`delivery-instruction-list ${styles['delivery-instruction-list']}`}
      >
        {deliveryInstruction.data.map(renderDeliveryInstruction)}
      </Box>
    );
  };
  return (
    <Box
      className="delivery-instruction"
      sx={{
        backgroundColor: 'rgba(242, 238, 228, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid #F2EEE4',
        padding: '1rem',
        margin: ' 0.8rem 0.3rem 0.3rem 0.3rem',
        borderRadius: '16px',
      }}
    >
      <Typography component="h3" variant="body1" sx={{ fontWeight: 600 }}>
        Delivery Instructions
      </Typography>
      {renderInstruction()}
    </Box>
  );
};

export default DeliveryInstruction;
