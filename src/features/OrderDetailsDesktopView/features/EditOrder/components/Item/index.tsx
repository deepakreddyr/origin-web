import { Box, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import React from 'react';

import { CounterUOM } from '@/components/CartPage/components/UOMCounter';
import { editOrderAtom } from '../../context/atoms';
import styles from './style.module.css';

interface Props {
  item: any;
}
const Item = (props: Props) => {
  const { item: product } = props;

  const image = product.logo;

  const [editOrder, setEditOrder] = useAtom(editOrderAtom);

  const setEditCartItems = (editCartItems: any) => {
    setEditOrder((prevState: any) => ({
      ...prevState,
      orderItems: editCartItems
    }));
  };

  const cartItem = React.useMemo(() => {
    const cartItemTemp = editOrder.orderItems?.find((item: any) => item.id === product.id);
    if (cartItemTemp) return cartItemTemp;
    return {};
  }, [editOrder.orderItems]);

  const generateUomPayload = (uomPayload: any) => {
    if (!cartItem || !cartItem.uom) return [uomPayload];

    const restPayload = cartItem.uom.filter((item: any) => item.id !== uomPayload.id);

    // If Qty is 0 then we will remove that uom from the array
    if (uomPayload.qty === 0) {
      return [...restPayload];
    }
    return [...restPayload, uomPayload];
  };

  const addItemToCart = (cartValueToBeSet: any) => {
    const totalQty = cartValueToBeSet.uom.reduce((previousValue: any, currentValue: any) => {
      const totalQtyVal = previousValue + currentValue.qty;
      return totalQtyVal;
    }, 0);
    if (totalQty !== 0) {
      const tempItems = editOrder.orderItems.slice();
      const index = tempItems.findIndex((e: any) => e.item_code === cartValueToBeSet.item_code);
      if (index !== -1) {
        tempItems[index] = cartValueToBeSet;
        setEditCartItems(tempItems);
      } else {
        const newCartItem = [...editOrder.orderItems, cartValueToBeSet];
        setEditCartItems(newCartItem);
      }
    } else {
      const newCartItem = editOrder.orderItems.filter((e: any) => e.id !== cartValueToBeSet.id);
      setEditCartItems(newCartItem);
    }
    // debouncedCartAPI();
  };

  const renderCounter = (multiUom: any) => {
    return (
      <CounterUOM
        value={multiUom.qty}
        stepCount={multiUom?.stepper_quantity}
        unit={multiUom.unit}
        minValue={multiUom.minimum_quantity}
        maxValue={multiUom.maximum_quantity}
        onChange={(val: number) => {
          const cartItemToBeAdded = {
            ...product,
            id: product.id,
            item_code: product.item_code,
            availability: product.availability,
            uom: generateUomPayload({
              ...multiUom,
              id: multiUom.id,
              variant_id: multiUom.variant_id,
              price: parseFloat(multiUom.price),
              qty: val,
              availability: multiUom.is_available || true,
              visibility: multiUom.is_visible || true
            })
          };
          addItemToCart(cartItemToBeAdded);
        }}
      />
    );
  };

  return product?.uom
    .sort((a: any, b: any) => b.id - a.id)
    .map((uom: any) => (
      <Box
        key={uom.id}
        className="review-cart-list"
        component="li"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box className="review-cart-info" sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Box
            component="figure"
            sx={{
              width: 58,
              height: 52,
              borderRadius: '6px',
              backgroundColor: '#F2E7CB',
              flexShrink: 0,
              margin: 0,
              padding: 1,
              overflow: 'hidden'
            }}
          >
            <img className={styles.img} height="100%" width="100%" src={image} alt="potato" />
          </Box>
          <Box
            className="review-cart-information"
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography component="h4" variant="body2">
              {product?.name}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: 'rgba(0, 0, 0, 0.60)',
                fontFamily: 'Roboto Mono',
                fontWeight: 'normal'
              }}
            >
              {`${uom.qty}${uom.unit} `}
            </Typography>
          </Box>
        </Box>
        <Box
          className="review-cart-counter"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {renderCounter(uom)}
          <Typography component="span" variant="body1" sx={{ fontFamily: 'Roboto Mono' }}>
            ₹ {uom.price}
          </Typography>
        </Box>
      </Box>
    ));
};
export default Item;
