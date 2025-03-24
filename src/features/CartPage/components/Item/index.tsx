import { Box, Grid, Typography } from '@mui/material'
import { useAtom } from 'jotai'
import React from 'react'

import { cartAtom, cartItems } from '../../context/atoms'
import { addToCart } from '../../services/addToCart'
import styles from './style.module.css'
import { CounterUOM } from '@/components/CartPage/components/UOMCounter'
import debounce from '@/utilities/debounce'
import AddItemBtn from '@/components/shared/AddItemBtn/AddItemBtn'
import CounterButton from '@/components/shared/CounterButton'
import Image from 'next/image'

interface Props {
    item: any
}
const Item = (props: Props) => {
    const { item: product } = props
    // const [cartItemDetails, setCartItemDetails] = useAtom(cartItems)
    // const [, setCartAtom] = useAtom(cartAtom)
    // const img = product.logo

    // function getCartFromAPI() {
    //     if (
    //         cartItemDetails &&
    //         Array.isArray(cartItemDetails) &&
    //         cartItemDetails.length > 0
    //     )
    //         addToCart(cartItemDetails, setCartAtom)
    // }

    // const debouncedCartAPI = debounce(getCartFromAPI, 1000)

    // const cartItem = React.useMemo(() => {
    //     const cartItemTemp = cartItemDetails.find(
    //         (item: any) => item.id === product.id
    //     )
    //     if (cartItemTemp) return cartItemTemp
    //     return {}
    // }, [cartItemDetails])

    // const generateUomPayload = (uomPayload: any) => {
    //     if (!cartItem || !cartItem.uom) return [uomPayload]

    //     const restPayload = cartItem.uom.filter(
    //         (item: any) => item.id !== uomPayload.id
    //     )

    //     // If Qty is 0 then we will remove that uom from the array
    //     if (uomPayload.qty === 0) {
    //         return [...restPayload]
    //     }
    //     return [...restPayload, uomPayload]
    // }

    // const addItemToCart = (cartValueToBeSet: any) => {
    //     const totalQty = cartValueToBeSet.uom.reduce(
    //         (previousValue: any, currentValue: any) => {
    //             const totalQtyVal = previousValue + currentValue.qty
    //             return totalQtyVal
    //         },
    //         0
    //     )
    //     if (totalQty !== 0) {
    //         const tempItems = cartItemDetails.slice()
    //         const index = tempItems.findIndex(
    //             (e) => e.item_code === cartValueToBeSet.item_code
    //         )
    //         if (index !== -1) {
    //             tempItems[index] = cartValueToBeSet
    //             setCartItemDetails(tempItems)
    //             localStorage.setItem('cartItem', JSON.stringify(tempItems))
    //         } else {
    //             const newCartItem = [...cartItemDetails, cartValueToBeSet]
    //             setCartItemDetails(newCartItem)
    //             localStorage.setItem('cartItem', JSON.stringify(newCartItem))
    //         }
    //     } else {
    //         const newCartItem = cartItemDetails.filter(
    //             (e) => e.id !== cartValueToBeSet.id
    //         )
    //         setCartItemDetails(newCartItem)
    //         localStorage.setItem('cartItem', JSON.stringify(newCartItem))
    //     }
    //     debouncedCartAPI()
    //     // localStorage.setItem('cartItem', JSON.stringify(cartItemDetails));
    // }

    // const renderCounter = (multiUom: any) => {
    //     return (
    //         <CounterUOM
    //             variant="full-yellow"
    //             value={multiUom.qty}
    //             unit={multiUom.unit}
    //             minValue={multiUom.minimum_quantity}
    //             maxValue={multiUom.maximum_quantity}
    //             onChange={(val: number) => {
    //                 const cartItemToBeAdded = {
    //                     ...product,
    //                     id: product.id,
    //                     item_code: product.item_code,
    //                     availability: product.availability,
    //                     uom: generateUomPayload({
    //                         ...multiUom,
    //                         id: multiUom.id,
    //                         variant_id: multiUom.variant_id,
    //                         price: parseFloat(multiUom.price),
    //                         qty: val,
    //                         availability: multiUom.is_available || true,
    //                         visibility: multiUom.is_visible || true,
    //                     }),
    //                 }
    //                 addItemToCart(cartItemToBeAdded)
    //             }}
    //         />
    //     )
    // }

    const calculateItemTotalPrice = (price: any, quantity: any) => {
        return price * quantity
    }

    return (
        <>
            {product.multiple_uoms.map((uom: any) => (
                <Box
                    key={uom.id}
                    className="review-cart-list"
                    component="li"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <Grid
                        item
                        className="review-cart-info"
                        sx={{
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            component="figure"
                            sx={{
                                width: 58,
                                height: 57,
                                borderRadius: '12px',
                                backgroundColor: '#F2EEE4',
                                flexShrink: 0,
                                margin: 0,
                                padding: 1,
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                className={styles.img}
                                height="100%"
                                width="100%"
                                src={product.logo}
                                alt="image"
                            />
                        </Box>
                        <Box
                            className="review-cart-information"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography
                                component="h4"
                                variant="body2"
                                sx={{
                                    fontFamily: 'SofiaPro',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                }}
                            >
                                {product?.name}
                            </Typography>
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                    color: 'rgba(0, 0, 0, 0.60)',
                                    fontFamily: 'SofiaPro',
                                }}
                            >
                                {`${uom.unit} `}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid
                        sx={{
                            display: 'flex',
                            gap: '14px',
                            alignItems: 'center',
                        }}
                    >
                        <AddItemBtn
                            product={product}
                            varientId={uom.variant_id}
                            varientPrice={uom.price}
                            stepperQuantity={uom.stepper_quantity}
                            buttonType={'yellow'}
                        />

                        <Grid className="review-cart-counter">
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                {uom.market_price && (
                                    <Typography
                                        component="span"
                                        variant="body1"
                                        sx={{
                                            fontFamily: 'SofiaPro',
                                            textDecoration: 'line-through',
                                            color: '#231F2099',
                                        }}
                                    >
                                        {`₹${uom.market_price}`}
                                    </Typography>
                                )}
                                <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{ fontFamily: 'SofiaPro' }}
                                >
                                    ₹
                                    {calculateItemTotalPrice(
                                        uom.price,
                                        uom.cart_quantity
                                    )}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </>
    )
}
export default Item
