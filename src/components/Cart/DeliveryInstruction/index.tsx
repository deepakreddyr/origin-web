import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import type { SingleDeliveryInstruction } from './data/deliveryInstructions';
import styles from './style.module.css';
import useDeliveryInstructionActions from '@/components/CartPage/hooks/useDeliveryInstructionActions';
import { useDispatch, useSelector } from 'react-redux';
import { updateInstructions } from '@/store/slice/placeOrderDetails';

const DeliveryInstruction = () => {
  const deliveryInstruction = useDeliveryInstructionActions();
  const dispatch = useDispatch();
  const placeOrderDetails = useSelector((state: any) => state.placeOrderDetails);
  const renderDeliveryInstruction = (item: SingleDeliveryInstruction) => {
    const cssRules = {
      containerClassName: `${
        item.isActivated ? styles['delivery-instruction-list-active-item'] : ''
      } ${styles['delivery-instruction-list-item']}
      `
    };

    const handleInstructions = (slug: any, name: any) => {
      deliveryInstruction.onChange(slug)();
      dispatch(updateInstructions(name));
    };

    return (
      <Box
        component="li"
        className={cssRules.containerClassName}
        onClick={() => handleInstructions(item.slug, item.name)}
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
            display: 'block'
          }}
        >
          {item.name}
        </Typography>
      </Box>
    );
  };

  const renderInstruction = () => {
    return (
      <Box component="ul" className={`delivery-instruction-list ${styles['delivery-instruction-list']}`}>
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
        border: '1px solid #F2EEE4',
        padding: '1rem',
        // margin: ' 0.8rem 0.3rem 0.3rem 0.3rem',
        borderRadius: '16px'
      }}
    >
      <p className="font-[stinger] font-semibold text-[1.1vw] mob:text-[4.1vw] text-[#231F20CC]">
        Delivery Instructions
      </p>
      {renderInstruction()}
    </Box>
  );
};

export default DeliveryInstruction;
