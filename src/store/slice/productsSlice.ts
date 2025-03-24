import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    productsList: [],
    isProductListLoading: true,
}

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProductList(state, action: PayloadAction<[]>) {
            state.productsList = action.payload
        },
        setIsProductListLoading(state, action: PayloadAction<boolean>) {
            state.isProductListLoading = action.payload
        },
    },
})

export const { setProductList, setIsProductListLoading } = productsSlice.actions
export default productsSlice.reducer
