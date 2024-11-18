/* eslint-disable @next/next/no-img-element */
import { Box, debounce, Grid, IconButton, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import React from 'react';

import { cartAtom, cartItems } from '../../context/atoms';
import { addToCart } from '../../services/addToCart';
import styles from './style.module.css';
import Image from 'next/image';
import DeleteIcon from '../../assets/DeleteIcon.svg';
import { CounterUOM } from '../UOMCounter';

interface Props {
  item: any;
}
const Item = (props: Props) => {
  const { item: product } = props;

  const img = product.logo;

  const [cartItemDetails, setCartItemDetails] = useAtom(cartItems);
  const [, setCartAtom] = useAtom(cartAtom);

  function getCartFromAPI() {
    if (cartItemDetails && Array.isArray(cartItemDetails) && cartItemDetails.length > 0)
      addToCart(cartItemDetails, setCartAtom);
  }

  const debouncedCartAPI = debounce(getCartFromAPI, 1000);

  const cartItem = React.useMemo(() => {
    const cartItemTemp = cartItemDetails.find((item: any) => item.id === product.id);
    if (cartItemTemp) return cartItemTemp;
    return {};
  }, [cartItemDetails]);

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
    debouncedCartAPI();
    // localStorage.setItem('cartItem', JSON.stringify(cartItemDetails));
  };

  const renderCounter = (multiUom: any) => {
    return (
      <CounterUOM
        variant="full-yellow"
        stepCount={multiUom?.stepper_quantity}
        value={multiUom.qty}
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

  const renderUOM = (uom: any) => {
    let numericUnit: any = uom.unit.replace(/[^\d.]/g, '');
    let { unit } = uom;

    if (numericUnit) {
      unit = uom.unit.split(String(numericUnit)).join('');
      numericUnit *= uom.qty;
    } else {
      numericUnit = uom.qty;
    }
    {
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
            fontSize: '11px !important'
          }}
        >
          {uom.unit} x{uom.qty}
        </Typography>
      );
    }

    return (
      <Typography
        sx={{
          fontWeight: '500',
          fontSize: '11px !important'
        }}
      >
        1 {uom.unit} x{uom.qty}
      </Typography>
    );
  };

  return product?.uom
    .sort((a: any, b: any) => b.id - a.id)
    .map((uom: any) => {
      return (
        <Grid
          container
          key={uom.id}
          className="review-cart-list"
          component="li"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            ...(uom.qty > uom.maximum_quantity
              ? {
                  background: 'linear-gradient(89.43deg, rgba(208, 88, 63, 0.2) 0.49%, rgba(255, 255, 255, 0) 99.51%)',
                  paddingLeft: '1rem',
                  marginLeft: '-1rem',
                  marginRight: '-1rem',
                  width: 'calc(100% + 1rem)',
                  paddingTop: '1rem',
                  paddingBottom: '1rem'
                }
              : {})
          }}
        >
          <Grid item xs={8} className="review-cart-info" sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Box
              component="figure"
              sx={{
                width: 58,
                height: 52,
                borderRadius: '12px',
                backgroundColor: '#F2EEE4',
                flexShrink: 0,
                margin: 0,
                padding: 1,
                overflow: 'hidden'
              }}
            >
              <img className={styles.img} height="100%" width="100%" src={img} alt="potato" />
            </Box>
            <Box
              className="review-cart-information"
              sx={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography
                component="h4"
                variant="body2"
                sx={{
                  // fontFamily: "Sofia Pro",
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                {product?.name}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: 'rgba(0, 0, 0, 0.60)',
                  // fontFamily: "Roboto Mono",
                  fontWeight: 'normal'
                }}
              >
                {/* {`${uom.qty}${uom.unit} `} */}
                {renderUOM(uom)}
              </Typography>
            </Box>
          </Grid>
          {!uom?.is_available ? (
            <Grid xs={3}>
              <Typography
                sx={{
                  color: '#C70000'
                }}
              >
                Out of stock
              </Typography>
            </Grid>
          ) : (
            <Grid xs={2}>{renderCounter(uom)}</Grid>
          )}
          <Grid item xs={1} className="review-cart-counter">
            {!uom?.is_available ? (
              <Box>
                <IconButton
                  onClick={(event: any) => {
                    const cartItemToBeAdded = {
                      ...product,
                      id: product.id,
                      item_code: product.item_code,
                      availability: product.availability,
                      uom: generateUomPayload({
                        ...uom,
                        id: uom.id,
                        variant_id: uom.variant_id,
                        price: parseFloat(uom.price),
                        qty: 0,
                        availability: uom.is_available || true,
                        visibility: uom.is_visible || true
                      })
                    };
                    addItemToCart(cartItemToBeAdded);
                  }}
                  sx={{
                    width: '45px',
                    height: '45px'
                  }}
                >
                  <Image src={DeleteIcon} height={200} width={200} alt={product?.name} />
                </IconButton>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {!!uom.market_price && (
                  <Typography
                    component="span"
                    variant="body1"
                    sx={{
                      fontFamily: 'Roboto Mono',
                      textDecoration: 'line-through',
                      color: '#231F2099'
                    }}
                  >
                    {`₹${uom.market_price}`}
                  </Typography>
                )}
                <Typography component="span" variant="body1" sx={{ fontFamily: 'Roboto Mono' }}>
                  ₹{uom.price}
                </Typography>
              </Box>
            )}
          </Grid>
          {uom.qty > uom.maximum_quantity ? (
            <Typography
              component="span"
              variant="body1"
              sx={{
                fontFamily: 'Lexend',
                color: '#C70000',
                fontSize: '12px',
                mt: '0.5rem'
              }}
            >{`Maximum available unit(s) is ${uom.maximum_quantity}. Please change the Quantity.`}</Typography>
          ) : (
            <></>
          )}
        </Grid>
      );
    });
};
export default Item;
