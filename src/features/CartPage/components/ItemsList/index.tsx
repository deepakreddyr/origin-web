import { Box, Typography } from '@mui/material'
import { useAtom } from 'jotai'

import { cartItems } from '../../context/atoms'
import Item from '../Item'
import { useSelector } from 'react-redux'

const ItemsList = () => {
    const cart = useSelector((state: any) => state.cart)
    // const [cart] = useAtom(cartItems);
    return (
        <Box
            className="review-cart"
            sx={{
                backgroundColor: '#F2EEE44D',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                border: '2px solid #F2EEE4',
                padding: '1rem',
                overflow: 'scroll',
                margin: '0.3rem',
                borderRadius: '16px',
            }}
        >
            <Typography
                component="h3"
                variant="body1"
                sx={{
                    fontFamily: 'SofiaPro',
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
                {cart.items?.map((item: any) => (
                    <Item item={item} key={item.id} />
                ))}
            </Box>
        </Box>
    )
}

export default ItemsList
