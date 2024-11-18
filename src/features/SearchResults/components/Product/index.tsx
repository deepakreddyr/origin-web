import { Box, Button, Grid, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import Image from 'next/image';
import router from 'next/router';
import React from 'react';

import { cartItems } from '../../../CartPage/context/atoms';
import Down from '../../../Homepage/assets/down-icon.svg';
import Plus from '../../../Homepage/assets/gotoPlus.svg';
import type { SearchedItem } from '../../types/SearchedProduct';
import UomModel from '../UomModel';
import styles from './style.module.css';

interface Props {
  product: SearchedItem;
}

const Product = (props: Props) => {
  const { product } = props;
  const [isUomModalOpen, setIsUomModalOpen] = React.useState(false);

  const [cartItemDetails, setCartItemDetails] = useAtom(cartItems);

  const cartItem = React.useMemo(() => {
    const cartItemTemp = cartItemDetails.find((item: any) => item.id === product.id);
    if (cartItemTemp) return cartItemTemp;
    return {};
  }, [cartItemDetails]);

  const getTotalQty = (): number => {
    let totalValue = 0;
    if (!cartItem) return 0;
    cartItem?.uom.forEach((uom: any) => {
      totalValue += uom.qty;
    });

    return totalValue;
  };

  // const itemId = product.map((item) => item.id);

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
      const tempItems = cartItemDetails.slice();
      const index = tempItems.findIndex((e) => e.item_code === cartValueToBeSet.item_code);
      if (index !== -1) {
        tempItems[index] = cartValueToBeSet;
        setCartItemDetails(tempItems);
        localStorage.setItem('cartItem', JSON.stringify(tempItems));
      } else {
        const newCartItem = [...cartItemDetails, cartValueToBeSet];
        setCartItemDetails(newCartItem);
        localStorage.setItem('cartItem', JSON.stringify(newCartItem));
      }
    } else {
      const newCartItem = cartItemDetails.filter((e) => e.id !== cartValueToBeSet.id);
      setCartItemDetails(newCartItem);
      localStorage.setItem('cartItem', JSON.stringify(newCartItem));
    }
    // localStorage.setItem('cartItem', JSON.stringify(cartItemDetails));
  };

  const onOpenUomModal = () => {
    setIsUomModalOpen(true);
  };
  const onCloseUomModal = () => {
    setIsUomModalOpen(false);
  };

  // const renderButton = (multiUom: any) => {
  //   const enableAddButton = !(cartItem?.item_code === product?.item_code);

  //   if (
  //     Array.isArray(product.multiple_uoms) &&
  //     product.multiple_uoms.length === 1 &&
  //     enableAddButton
  //   )
  //     return (
  //       <Button
  //         className={styles.button}
  //         onClick={() => {
  //           const cartItemToBeAdded = {
  //             ...product,
  //             id: product.id,
  //             item_code: product.item_code,
  //             // availability: product.availability,
  //             uom: generateUomPayload({
  //               ...multiUom,
  //               id: multiUom.uom_id,
  //               variant_id: multiUom.variant_id,
  //               price: parseFloat(multiUom.price),
  //               qty: multiUom.minimum_quantity,
  //               availability: multiUom.is_available || true,
  //               visibility: multiUom.is_visible || true,
  //             }),
  //           };
  //           addItemToCart(cartItemToBeAdded);
  //         }}
  //       >
  //         <Typography className={styles.text}>Add</Typography>
  //         <Image src={Plus} alt="semi" />
  //       </Button>
  //     );

  //   if (enableAddButton)
  //     return (
  //       <Button className={styles.button} onClick={onOpenUomModal}>
  //         <Typography className={styles.text}>Add</Typography>
  //         <Image src={Down} alt="semi" />
  //       </Button>
  //     );

  //   return (
  //     <CounterUOM
  //       variant="yellow"
  //       value={getTotalQty()}
  //       unit={multiUom.unit}
  //       stepCount={multiUom?.stepper_quantity}
  //       minValue={multiUom.minimum_quantity}
  //       maxValue={multiUom.maximum_quantity}
  //       isMultipleUomInAPI={
  //         Array.isArray(product.multiple_uoms) &&
  //         product.multiple_uoms.length > 1
  //       }
  //       onOpenUomModal={onOpenUomModal}
  //       onChange={(val: number) => {
  //         const cartItemToBeAdded = {
  //           ...product,
  //           id: product.id,
  //           item_code: product.item_code,
  //           // availability: product.availability,
  //           uom: generateUomPayload({
  //             ...multiUom,
  //             id: multiUom.uom_id,
  //             variant_id: multiUom.variant_id,
  //             price: parseFloat(multiUom.price),
  //             qty: val,
  //             availability: multiUom.is_available || true,
  //             visibility: multiUom.is_visible || true,
  //           }),
  //         };
  //         addItemToCart(cartItemToBeAdded);
  //       }}
  //     />
  //   );
  // };

  const renderUOM = (uom: any) => {
    let numericUnit: any = uom.unit.replace(/[^\d.]/g, '');
    let { unit } = uom;

    if (numericUnit) {
      unit = uom.unit.split(String(numericUnit)).join('');
      numericUnit *= uom.minimum_quantity;
    } else {
      numericUnit = uom.minimum_quantity;
    }
    {
      console.log(uom.qty);
    }

    // Check if the unit contains 'g'
    if (
      uom.unit.toLowerCase().includes('g') ||
      uom.unit.toLowerCase().includes('piece') ||
      uom.unit.toLowerCase().includes('bunch') ||
      uom.unit.toLowerCase().includes('box') ||
      uom.unit.toLowerCase().includes('pack')
    ) {
      return (
        <Typography
          sx={{
            fontWeight: '500',
            fontSize: '12px'
          }}
        >
          {uom.unit} x{uom.minimum_quantity}
        </Typography>
      );
    }

    return (
      <Typography
        sx={{
          fontWeight: '500',
          fontSize: '12px !important'
        }}
      >
        1 {uom.unit} x{uom.minimum_quantity}
      </Typography>
    );
  };

  return (
    <>
      <Grid item className={styles['product-container']} key={product.id} xs={6} sm={6} md={3} xl={2}>
        <Box className={`product-list-item ${styles['product-list-item']}`}>
          <Box
            component="figure"
            className={styles['img-container']}
            onClick={() => {
              router.push(`/home/product/${product.id}`);
            }}
          >
            <img className={styles.img} src={product.image} alt={product.name} />
          </Box>
          {/* <Box className={styles["details-container"]}>
            <Typography component="h3" className={styles.name}>
              {product.name}
            </Typography>
            {product?.multiple_uoms?.map((uom: any, index: number) => {
              if (index === 0)
                return (
                  <Box className={styles["price-details"]} key={uom.uom_id}>
                    <Typography
                      component="span"
                      variant="body2"
                      className={styles.qty}
                      sx={{
                        fontWeight: "normal",
                      }}
                    >
                      {renderUOM(uom)}
                      {uom.minimum_quantity} {uom.unit}
                    </Typography>
                    <Box className={styles["price-btn-container"]}>
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{
                          fontFamily: "Roboto Mono",
                        }}
                      >
                        {uom.formatted_price}
                      </Typography>
                      {renderButton(product.multiple_uoms[0])}
                    </Box>
                  </Box>
                );
              return <></>;
            })}
          </Box> */}
        </Box>
      </Grid>
      {isUomModalOpen && <UomModel isOpen={isUomModalOpen} onClose={onCloseUomModal} product={product} />}
    </>
  );
};
export default Product;
