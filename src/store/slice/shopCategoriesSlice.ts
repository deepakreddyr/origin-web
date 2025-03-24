import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ShopDetails } from '@/utilities/types'

interface CategoryState {
    categories: ShopDetails[]
    subCategories: ShopDetails[]
    isCategoriesFetched: boolean
    isSubCategoriesFetched: boolean
}

const initialState: CategoryState = {
    categories: [],
    subCategories: [],
    isCategoriesFetched: false,
    isSubCategoriesFetched: false,
}

export const shopCategorySlice = createSlice({
    name: 'shopCategories',
    initialState,
    reducers: {
        setShopCategories(state, action: PayloadAction<ShopDetails[]>) {
            state.categories = action.payload
        },
        setShopSubCategories(state, action: PayloadAction<ShopDetails[]>) {
            state.subCategories = action.payload
        },
        setIsShopCategoriesFetched(state, action: PayloadAction<boolean>) {
            state.isCategoriesFetched = action.payload
        },
        setIsShopSubCategoriesFetched(state, action: PayloadAction<boolean>) {
            state.isSubCategoriesFetched = action.payload
        },
    },
})

export const {
    setShopCategories,
    setShopSubCategories,
    setIsShopCategoriesFetched,
    setIsShopSubCategoriesFetched,
} = shopCategorySlice.actions

export default shopCategorySlice.reducer
