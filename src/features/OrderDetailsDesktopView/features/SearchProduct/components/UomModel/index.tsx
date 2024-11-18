import { Box, Card, IconButton, Modal, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import Image from 'next/image';
import React from 'react';

import Close from '../../../../../../assets/svg/xmark.svg';
import { CounterUOM } from '@/components/CartPage/components/UOMCounter';
import { editOrderAtom } from '../../../EditOrder/context/atoms';
import type { CategoryItem } from '../../types/CategoryItems';
import styles from './style.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: CategoryItem;
}

const UomModel = (props: Props) => {
  const { isOpen, onClose, product } = props;
  const [editOrder, setEditOrder] = useAtom(editOrderAtom);

  const cartItem = React.useMemo(() => {
    const cartItemTemp = editOrder.orderItems.find((item: any) => item.id === product.id);
    if (cartItemTemp) return cartItemTemp;
    return {};
  }, [editOrder.orderItems]);

  const handleClose = () => {
    onClose();
  };

  const getValueByUomId = (uomId: number) => {
    if (!cartItem || !cartItem.uom) return 0;

    const uomItem = cartItem.uom.find((uomType: any) => uomType.id === uomId);

    if (!uomItem) return 0;
    return uomItem.qty;
  };

  const generateUomPayload = (uomPayload: any) => {
    if (!cartItem || !cartItem.uom) return [uomPayload];

    const restPayload = cartItem.uom.filter((item: any) => item.id !== uomPayload.id);

    if (uomPayload.qty === 0) {
      return [...restPayload];
    }
    return [...restPayload, uomPayload];
  };

  const setOrderedItemDetails = (items: any) => {
    setEditOrder((prevState) => ({
      ...prevState,
      orderItems: items
    }));
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
        setOrderedItemDetails(tempItems);
      } else {
        const newCartItem = [...editOrder.orderItems, cartValueToBeSet];
        setOrderedItemDetails(newCartItem);
      }
    } else {
      const newCartItem = editOrder.orderItems.filter((e: any) => e.id !== cartValueToBeSet.id);
      setOrderedItemDetails(newCartItem);
    }
  };

  const renderButton = (multiUom: any) => {
    const enableAddButton = !parseInt(cartItem?.uom?.find((item: any) => item.id === multiUom.uom_id)?.qty || 0, 10);

    if (enableAddButton)
      return (
        <button
          type="button"
          className={styles.add_btn}
          onClick={() => {
            const cartItemToBeAdded = {
              ...product,
              id: product.id,
              item_code: product.item_code,
              availability: product.availability,
              uom: generateUomPayload({
                ...multiUom,
                id: multiUom.uom_id,
                variant_id: multiUom.variant_id,
                price: parseFloat(multiUom.price),
                qty: multiUom.minimum_quantity,
                availability: multiUom.is_available || true,
                visibility: multiUom.is_visible || true
              })
            };
            addItemToCart(cartItemToBeAdded);
          }}
        >
          Add
        </button>
      );

    return (
      <CounterUOM
        value={getValueByUomId(multiUom.uom_id)}
        unit={multiUom.unit}
        stepCount={multiUom?.stepper_quantity}
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
              id: multiUom.uom_id,
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

  const renderCard = (multiUom: any) => {
    if (multiUom.is_available || multiUom.availability) {
      return (
        <Box component="li" className={`card-list-item ${styles['card-list-item']}`} key={multiUom.uom_id}>
          <Box className={`add ${styles.add}`}>
            <Typography
              component="span"
              variant="body1"
              sx={{ fontFamily: 'Roboto Mono, monospace' }}
              className={`unit ${styles.unit}`}
            >
              {multiUom.unit}
              {multiUom.minimum_quantity > 1 ? (
                <Typography component="span" variant="body1" sx={{ fontFamily: 'Roboto Mono, monospace' }}>
                  MIN {multiUom.minimum_quantity} {multiUom.unit}
                </Typography>
              ) : (
                <></>
              )}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Typography
              component="span"
              variant="body1"
              sx={{
                fontFamily: 'Roboto Mono, monospace',
                fontWeight: 'normal'
              }}
            >
              {multiUom.formatted_price}
            </Typography>
            {multiUom.conversation_text}
            {renderButton(multiUom)}
          </Box>
        </Box>
      );
    }
    return (
      <Card className={styles.card} key={multiUom.uom_id}>
        <div>
          <p className={styles.unit}>
            In {multiUom.unit} <span className={styles.qty}>(MAX {multiUom.maximum_quantity})</span>
          </p>
          <p className={styles.price}>
            {multiUom.formatted_price} / {multiUom.unit}
          </p>
        </div>
        <div className={styles.out_of_stock}>
          <span> Out of Stock</span>
        </div>
      </Card>
    );
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      className={styles['modal-container']}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={`modal-inner ${styles['modal-inner']}`}>
        <Box className={`modal-title ${styles['modal-title']}`}>
          <Typography component="h3" variant="h4" className={styles['product-name']}>
            {product.name}
          </Typography>
          <IconButton onClick={onClose}>
            <Image src={Close} alt="Close" />
          </IconButton>
        </Box>
        <Box className={`modal-body ${styles['modal-body']}`}>
          <Typography component="span" variant="body2" sx={{ fontWeight: 'normal' }}>
            Select Unit
          </Typography>
          <Box component="ul" className={`card-list ${styles['card-list']}`}>
            {product.multiple_uoms.map(renderCard)}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default UomModel;
