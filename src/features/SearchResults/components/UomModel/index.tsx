import { Add } from '@mui/icons-material'
import { Box, Modal, Typography } from '@mui/material'
import { useAtom } from 'jotai'
import Image from 'next/image'
import React from 'react'

import Cross from '../../../../assets/svg/xmark.svg'
import { cartItems } from '../../../CartPage/context/atoms'
import Raw from '../../assets/raw.svg'
import Ripe from '../../assets/ripe.svg'
import SemiRipe from '../../assets/semi-ripe.svg'
import type { SearchedItem } from '../../types/SearchedProduct'
import styles from './style.module.css'
import { CounterUOM } from '@/components/CartPage/components/UOMCounter'

interface Props {
    isOpen: boolean
    onClose: () => void
    product: SearchedItem
}

const UomModel = (props: Props) => {
    const { isOpen, onClose, product } = props
    const [cartItemDetails, setCartItemDetails] = useAtom(cartItems)
    const [isRipenessOn, setIsRipenessON] = React.useState(false)

    const handleToggle = () => {
        setIsRipenessON(!isRipenessOn)
    }

    const cartItem = React.useMemo(() => {
        const cartItemTemp = cartItemDetails.find(
            (item) => item.id === product.id
        )
        if (cartItemTemp) return cartItemTemp
        return {}
    }, [cartItemDetails])

    const handleClose = () => {
        onClose()
    }

    const getValueByUomId = (uomId: number, ripenessType?: string) => {
        if (!cartItem || !cartItem.uom) return 0

        const uomItem = cartItem.uom.find((uomType: any) => {
            const isUom = uomType.id === uomId

            if (!ripenessType) return isUom
            return isUom && ripenessType === uomType?.ripenessType
        })

        if (!uomItem) return 0
        return uomItem.qty
    }

    const [totalRupees, setTotalRupees] = React.useState(0)

    React.useEffect(() => {
        let newTotalRupees = 0
        cartItemDetails.forEach((item) => {
            item.uom.forEach((uomItem: { price: number; qty: number }) => {
                newTotalRupees += uomItem.price * uomItem.qty
            })
        })
        setTotalRupees(newTotalRupees)
    }, [cartItemDetails])

    // const getTotalItemInUomId = (): Number => {
    //   let totalValue = 0;
    //   product?.multiple_uoms
    //     .sort((a, b) => a.uom_id - b.uom_id)
    //     .forEach((multiUom) => {
    //       totalValue += Number(getValueByUomId(multiUom.uom_id));
    //     });

    //   return totalValue;
    // };

    const generateUomPayload = (uomPayload: any) => {
        if (!cartItem || !cartItem.uom) return [uomPayload]

        const restPayload = cartItem.uom.filter((item: any) => {
            if (!uomPayload.ripenessType) return item.id !== uomPayload.id
            return !(
                item.id === uomPayload.id &&
                item?.ripenessType === uomPayload?.ripenessType
            )
        })

        // If Qty is 0 then we will remove that uom from the array
        if (uomPayload.qty === 0) {
            return [...restPayload]
        }
        return [...restPayload, uomPayload]
    }

    const addItemToCart = (cartValueToBeSet: any) => {
        const totalQty = cartValueToBeSet.uom.reduce(
            (previousValue: any, currentValue: any) => {
                const totalQtyVal = previousValue + currentValue.qty
                return totalQtyVal
            },
            0
        )
        if (totalQty !== 0) {
            const tempItems = cartItemDetails.slice()
            const index = tempItems.findIndex(
                (e) => e.item_code === cartValueToBeSet.item_code
            )
            if (index !== -1) {
                tempItems[index] = cartValueToBeSet
                setCartItemDetails(tempItems)
                localStorage.setItem('cartItem', JSON.stringify(tempItems))
            } else {
                const newCartItem = [...cartItemDetails, cartValueToBeSet]
                setCartItemDetails(newCartItem)
                localStorage.setItem('cartItem', JSON.stringify(newCartItem))
            }
        } else {
            const newCartItem = cartItemDetails.filter(
                (e) => e.id !== cartValueToBeSet.id
            )
            setCartItemDetails(newCartItem)
            localStorage.setItem('cartItem', JSON.stringify(newCartItem))
        }
        // localStorage.setItem('cartItem', JSON.stringify(cartItemDetails));
    }

    const renderButton = (multiUom: any) => {
        const enableAddButton = !parseInt(
            cartItem?.uom?.find((item: any) => {
                if (!multiUom.ripenessType) return item.id === multiUom.uom_id
                return (
                    item.id === multiUom.uom_id &&
                    item.ripenessType === multiUom.ripenessType
                )
            })?.qty || 0,
            10
        )

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
                            // availability: product.availability,
                            uom: generateUomPayload({
                                ...multiUom,
                                id: multiUom.uom_id,
                                variant_id: multiUom.variant_id,
                                price: parseFloat(multiUom.price),
                                qty: multiUom.minimum_quantity,
                                availability: multiUom.is_available || true,
                                visibility: multiUom.is_visible || true,
                                ripenessType: multiUom?.ripenessType,
                            }),
                        }
                        addItemToCart(cartItemToBeAdded)
                    }}
                >
                    <Typography className={styles.text}>Add</Typography>
                    <Add className={styles.img_plus} />
                </button>
            )

        return (
            <CounterUOM
                variant="yellow"
                value={getValueByUomId(multiUom.uom_id, multiUom?.ripenessType)}
                unit={multiUom.unit}
                stepCount={multiUom?.stepper_quantity}
                minValue={multiUom.minimum_quantity}
                maxValue={multiUom.maximum_quantity}
                onChange={(val: number) => {
                    const cartItemToBeAdded = {
                        ...product,
                        id: product.id,
                        item_code: product.item_code,
                        // availability: product.availability,
                        uom: generateUomPayload({
                            ...multiUom,
                            id: multiUom.uom_id,
                            variant_id: multiUom.variant_id,
                            price: parseFloat(multiUom.price),
                            qty: val,
                            availability: multiUom.is_available || true,
                            visibility: multiUom.is_visible || true,
                            ripenessType: multiUom?.ripenessType,
                        }),
                    }
                    addItemToCart(cartItemToBeAdded)
                }}
            />
        )
    }

    const getRipenessTypeName = (ripenessType: string) => {
        switch (ripenessType) {
            case 'semi_ripe':
                return 'SEMI'
            case 'ripe':
                return 'RIPE'
            case 'raw':
                return 'RAW'
            default:
                return 'Unknown'
        }
    }

    const getRipenessTypeDesc = (ripenessType: string) => {
        switch (ripenessType) {
            case 'semi_ripe':
                return (
                    <Typography
                        sx={{
                            fontSize: '12px',
                            color: 'rgba(0, 0, 0, 0.6)',
                        }}
                    >
                        Consume after 2-3 days
                    </Typography>
                )
            case 'ripe':
                return (
                    <Typography
                        sx={{
                            fontSize: '12px',
                            color: 'rgba(0, 0, 0, 0.6)',
                        }}
                    >
                        Ready to eat
                    </Typography>
                )
            case 'raw':
                return 'RAW'
            default:
                return 'Unknown'
        }
    }

    const getRipenessTypeImg = (ripenessType: string) => {
        switch (ripenessType) {
            case 'semi_ripe':
                return (
                    <Image
                        className={styles['ripeness-img']}
                        src={SemiRipe}
                        alt="semi"
                    />
                )
            case 'ripe':
                return (
                    <Image
                        className={styles['ripeness-img']}
                        src={Ripe}
                        alt="semi"
                    />
                )
            case 'raw':
                return (
                    <Image
                        className={styles['ripeness-img']}
                        src={Raw}
                        alt="semi"
                    />
                )
            default:
                return 'Unknown'
        }
    }

    const generateItemsByRipeness = (multiUom: any) => {
        if (!multiUom?.ripeness_types)
            return [
                {
                    ...multiUom,
                    ripenessType: null,
                    ripenessTypeName: null,
                },
            ]

        return multiUom.ripeness_types.map((ripenessType: string) => ({
            ...multiUom,
            ripenessType,
            ripenessTypeName: getRipenessTypeName(ripenessType),
        }))
    }

    const renderCard = (multiUom: any) => {
        const itemsByRipeness = generateItemsByRipeness(multiUom)

        return (
            <Box component="ul" className={`card-list ${styles['card-list']}`}>
                {itemsByRipeness?.map((ripenessItem: any, index: any) => (
                    <Box
                        component="li"
                        className={`card-list-item ${styles['card-list-item']}`}
                        key={ripenessItem.uom_id + index}
                    >
                        <Box
                            className={`ripeness-box ${styles['ripeness-box']}`}
                        >
                            <Box className={`ripeness ${styles.ripeness}`}>
                                {getRipenessTypeImg(ripenessItem.ripenessType)}

                                <Typography
                                    component="span"
                                    variant="body1"
                                    className={`ripeness-name ${styles['ripeness-name']}`}
                                >
                                    {` ${ripenessItem.ripenessTypeName}`}
                                </Typography>
                            </Box>

                            {getRipenessTypeDesc(ripenessItem.ripenessType)}

                            <Typography
                                component="span"
                                variant="body1"
                                sx={{
                                    color: '#231F20',
                                    fontSize: '14px',
                                    marginTop: '0.3rem',
                                }}
                            >
                                {ripenessItem.unit}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{
                                        fontWeight: '500',
                                        fontSize: '16px',
                                        fontFamily: 'Roboto Mono',
                                    }}
                                >
                                    {ripenessItem.formatted_price}
                                </Typography>
                            </Box>

                            {ripenessItem.conversation_text}
                            {renderButton(ripenessItem)}
                        </Box>
                    </Box>
                ))}
            </Box>
        )
    }
    const renderConfirmCard = () => {
        return (
            <Box
                component="li"
                className={`confirm-item ${styles['confirm-item']}`}
                // key={multiUom.uom_id}
            >
                <Box className={` total ${styles.total}`}>
                    <Typography
                        component="span"
                        variant="body1"
                        className={`total-text ${styles['total-text']}`}
                    >
                        Sub Total
                    </Typography>
                    <Typography
                        component="span"
                        variant="body1"
                        className={`total-number ${styles['total-number']}`}
                    >
                        ₹{totalRupees}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: '#FFDD00',
                        color: '#231f20',
                        border: '1px solid #ffdd00',
                        borderRadius: '48px',
                        padding: '10px 24px',
                    }}
                >
                    <Typography
                        component="span"
                        variant="body1"
                        sx={{
                            cursor: 'pointer',
                        }}
                        onClick={handleClose}
                    >
                        CONFIRM
                    </Typography>
                </Box>
            </Box>
        )
    }

    // const renderRipeDetails = () => {
    //   if (!isRipenessOn) return <></>;

    //   return (
    //     <Box className={styles['ripeness-details-box']}>
    //       <Typography className={styles['ripeness-details']}>
    //         Being adding your selected fruits with ripeness level such as
    //         (Ripened, Semi, and Raw) as needed as it arrives...
    //         <br />
    //         <br />
    //         As you had picked by yourself , all of the options you select will be
    //         delivered with your order.
    //       </Typography>
    //     </Box>
    //   );
    // };

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
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            className={styles.img}
                            src={product?.image}
                            alt={product.name}
                        />
                        <Typography
                            component="h3"
                            variant="h4"
                            className={styles['product-name']}
                        >
                            {product.name}
                        </Typography>
                    </Box>
                    <Image
                        onClick={handleClose}
                        className={styles.cross}
                        src={Cross}
                        alt="Cross"
                    />
                </Box>
                {/* <Box className={styles['ripeness-heading-box']}>
          <Box className={styles['ripeness-img-box']}>
            <Image className={styles['ripeness-img']} src={Raw} alt="semi" />
            <Image
              className={styles['ripeness-img']}
              src={SemiRipe}
              alt="semi"
            />
            <Image className={styles['ripeness-img']} src={Ripe} alt="semi" />
            <Typography
              className={styles['ripeness-heading']}
              onClick={handleToggle}
            >
              What is ripeness options?
            </Typography>
          </Box>

          {renderRipeDetails()}
        </Box> */}
                <Box className={`modal-body ${styles['modal-body']}`}>
                    {/* <Typography
            component="span"
            variant="body2"
            sx={{ fontWeight: 'normal' }}
          >
            Select Unit
          </Typography> */}
                    {/* <Box component="ul" className={`card-list ${styles['card-list']}`}>
            {product.multiple_uoms.map(renderCard)}
          </Box> */}
                    {renderConfirmCard()}
                </Box>
            </Box>
        </Modal>
    )
}

export default UomModel
