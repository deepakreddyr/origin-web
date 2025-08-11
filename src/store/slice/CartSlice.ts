import { couponDetailsInitialState } from '@/constants';
import { CartItem, Product } from '@/utilities/shop/types';
import { updateCartItemsToLs } from '@/utilities/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Updated interface to treat each UOM as a separate cart item
interface CartItemFlat {
  id: number; // product id
  item_code: string;
  name: string;
  image: string;
  bg_color: string;
  is_available: boolean;
  is_greyed: boolean;
  is_orderable: boolean;
  navigation: {
    to: string;
  };
  tag_url: string | null;
  // UOM specific data (flattened)
  variant_id: number;
  cart_quantity: number;
  price: number;
  market_price?: number;
  maximum_quantity: number;
  minimum_quantity: number;
  stepper_quantity: number;
  unit: string;
  uom_id: number;
  conversion_text: string;
  is_uom_available: boolean;
  is_default: boolean;
  is_visible: boolean;
  ripeness_types: any;
}

interface CartState {
  items: CartItemFlat[];
  totalQuantity: number;
  totalPrice: number;
  totalOriginalPrice: number;
  cartTabType: string;
  isProceedBtnEnabled: boolean;
  couponDetails: any;
  amountToPay: number;
  discountAmount: number | null;
  cart_minimum: number | null;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  totalOriginalPrice: 0,
  amountToPay: 0,
  cartTabType: '',
  isProceedBtnEnabled: false,
  couponDetails: couponDetailsInitialState,
  discountAmount: null,
  cart_minimum: null,
};

const updateCartTotals = (state: CartState) => {
  state.totalPrice = 0;
  state.totalOriginalPrice = 0;
  state.totalQuantity = 0;

  state.items.forEach((item) => {
    if (item.cart_quantity > 0) {
      state.totalPrice += item.price * item.cart_quantity;
      state.totalQuantity += item.cart_quantity;

      const original = item.market_price && item.market_price > 0 ? item.market_price : item.price;
      state.totalOriginalPrice += original * item.cart_quantity;
    }
  });
};

const isProceedBtnEnabled = (state: CartState) => {
  if (state.cart_minimum && state.amountToPay < state.cart_minimum) return false;

  for (const item of state.items) {
    if (item.cart_quantity > 0 && (item.cart_quantity > item.maximum_quantity || !item.is_uom_available)) {
      return false;
    }
  }

  return true;
};

// Helper function to convert old nested format to flat format
const convertToFlatStructure = (items: any[]): CartItemFlat[] => {
  const flatItems: CartItemFlat[] = [];
  
  items.forEach((item) => {
    if (item.multiple_uoms) {
      // Old nested format - convert each UOM to separate item
      item.multiple_uoms.forEach((uom: any) => {
        if (uom.cart_quantity > 0) {
          flatItems.push({
            // Product data
            id: item.id,
            item_code: item.item_code,
            name: item.name,
            image: item.image,
            bg_color: item.bg_color,
            is_available: item.is_available,
            is_greyed: item.is_greyed,
            is_orderable: item.is_orderable,
            navigation: item.navigation,
            tag_url: item.tag_url,
            // UOM data (flattened)
            variant_id: uom.variant_id,
            cart_quantity: uom.cart_quantity,
            price: uom.price,
            market_price: uom.market_price,
            maximum_quantity: uom.maximum_quantity,
            minimum_quantity: uom.minimum_quantity,
            stepper_quantity: uom.stepper_quantity,
            unit: uom.unit,
            uom_id: uom.uom_id,
            conversion_text: uom.conversion_text,
            is_uom_available: uom.is_available,
            is_default: uom.is_default,
            is_visible: uom.is_visible,
            ripeness_types: uom.ripeness_types,
          });
        }
      });
    } else if (item.variant_id) {
      // Already flat format
      flatItems.push(item);
    }
  });
  
  return flatItems;
};

// Helper function to update localStorage in the old nested format for compatibility
const updateLSWithNestedFormat = (flatItems: CartItemFlat[]) => {
  const nestedFormat: any[] = [];
  const productGroups: { [key: number]: any } = {};

  // Group by product id
  flatItems.forEach((item) => {
    if (!productGroups[item.id]) {
      productGroups[item.id] = {
        id: item.id,
        item_code: item.item_code,
        name: item.name,
        image: item.image,
        bg_color: item.bg_color,
        is_available: item.is_available,
        is_greyed: item.is_greyed,
        is_orderable: item.is_orderable,
        navigation: item.navigation,
        tag_url: item.tag_url,
        multiple_uoms: []
      };
    }

    productGroups[item.id].multiple_uoms.push({
      variant_id: item.variant_id,
      cart_quantity: item.cart_quantity,
      price: item.price,
      market_price: item.market_price,
      maximum_quantity: item.maximum_quantity,
      minimum_quantity: item.minimum_quantity,
      stepper_quantity: item.stepper_quantity,
      unit: item.unit,
      uom_id: item.uom_id,
      conversion_text: item.conversion_text,
      is_available: item.is_uom_available,
      is_default: item.is_default,
      is_visible: item.is_visible,
      ripeness_types: item.ripeness_types,
    });
  });

  Object.values(productGroups).forEach((product) => {
    nestedFormat.push(product);
  });

  updateCartItemsToLs(nestedFormat);
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<any[]>) => {
      console.log('Setting cart items:', action.payload);
      // Convert to flat structure if needed
      state.items = convertToFlatStructure(action.payload);
      updateCartTotals(state);
      state.isProceedBtnEnabled = isProceedBtnEnabled(state);
    },

    addItemToCart: (state, action: PayloadAction<{ product: any; selectedUOM: any }>) => {
      const { product, selectedUOM } = action.payload;
      console.log('Adding item to cart:', { productId: product.id, variantId: selectedUOM.variant_id });
      
      const existingItemIndex = state.items.findIndex((item) => 
        item.id === product.id && item.variant_id === selectedUOM.variant_id
      );

      if (existingItemIndex !== -1) {
        // Item exists, increase quantity
        console.log('Item exists, updating quantity');
        state.items[existingItemIndex].cart_quantity += selectedUOM.stepper_quantity;
      } else {
        // New item, add to cart
        console.log('New item, adding to cart');
        const newCartItem: CartItemFlat = {
          // Product data
          id: product.id,
          item_code: product.item_code,
          name: product.name,
          image: product.image,
          bg_color: product.bg_color,
          is_available: product.is_available,
          is_greyed: product.is_greyed,
          is_orderable: product.is_orderable,
          navigation: product.navigation,
          tag_url: product.tag_url,
          // UOM data
          variant_id: selectedUOM.variant_id,
          cart_quantity: selectedUOM.stepper_quantity,
          price: selectedUOM.price,
          market_price: selectedUOM.market_price,
          maximum_quantity: selectedUOM.maximum_quantity,
          minimum_quantity: selectedUOM.minimum_quantity,
          stepper_quantity: selectedUOM.stepper_quantity,
          unit: selectedUOM.unit,
          uom_id: selectedUOM.uom_id,
          conversion_text: selectedUOM.conversion_text,
          is_uom_available: selectedUOM.is_available,
          is_default: selectedUOM.is_default,
          is_visible: selectedUOM.is_visible,
          ripeness_types: selectedUOM.ripeness_types,
        };
        state.items.push(newCartItem);
      }

      updateCartTotals(state);
      updateLSWithNestedFormat(state.items);
      state.isProceedBtnEnabled = isProceedBtnEnabled(state);
      console.log('Cart after adding item:', state.items.map(item => ({ id: item.id, variant_id: item.variant_id, quantity: item.cart_quantity })));
    },

    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const variantId = action.payload;
      console.log('Removing variant from cart:', variantId);
      console.log('Cart before removal:', state.items.map(item => ({ id: item.id, variant_id: item.variant_id, quantity: item.cart_quantity })));

      const initialItemCount = state.items.length;
      
      // Simply remove the item with matching variant_id
      state.items = state.items.filter((item) => item.variant_id !== variantId);

      const finalItemCount = state.items.length;
      console.log(`Items count changed from ${initialItemCount} to ${finalItemCount}`);
      console.log('Cart after removal:', state.items.map(item => ({ id: item.id, variant_id: item.variant_id, quantity: item.cart_quantity })));

      updateCartTotals(state);
      updateLSWithNestedFormat(state.items);
      state.isProceedBtnEnabled = isProceedBtnEnabled(state);
    },

    increaseQuantity: (state, action: PayloadAction<{ varientId: number; stepperQuantity: number }>) => {
      const { varientId, stepperQuantity } = action.payload;
      console.log('Increasing quantity for variant:', varientId, 'by:', stepperQuantity);

      const item = state.items.find((item) => item.variant_id === varientId);
      if (item) {
        console.log(`Variant ${varientId} quantity changing from ${item.cart_quantity} to ${item.cart_quantity + stepperQuantity}`);
        item.cart_quantity += stepperQuantity;
      }

      updateCartTotals(state);
      updateLSWithNestedFormat(state.items);
      state.isProceedBtnEnabled = isProceedBtnEnabled(state);
    },

    decreaseQuantity: (state, action: PayloadAction<{ varientId: number; stepperQuantity: number }>) => {
      const { varientId, stepperQuantity } = action.payload;
      console.log('Decreasing quantity for variant:', varientId, 'by:', stepperQuantity);

      const itemIndex = state.items.findIndex((item) => item.variant_id === varientId);
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        const newQuantity = item.cart_quantity - stepperQuantity;
        
        console.log(`Variant ${varientId} quantity changing from ${item.cart_quantity} to ${newQuantity}`);
        
        if (newQuantity <= 0) {
          // Remove the item completely
          console.log('Removing item due to zero quantity:', varientId);
          state.items.splice(itemIndex, 1);
        } else {
          item.cart_quantity = newQuantity;
        }
      }

      updateCartTotals(state);
      updateLSWithNestedFormat(state.items);
      state.isProceedBtnEnabled = isProceedBtnEnabled(state);
    },

    setCartMinimum: (state, action: PayloadAction<number>) => {
      state.cart_minimum = action.payload;
    },
    
    setCartTabType: (state, action: PayloadAction<string>) => {
      state.cartTabType = action.payload;
    },

    setCouponDetails: (state, action: PayloadAction<any>) => {
      state.couponDetails = action.payload;
    },
    
    resetCouponDetails: (state) => {
      state.couponDetails = couponDetailsInitialState;
    },
    
    setTotalPrice: (state, action: PayloadAction<number>) => {
      state.totalPrice = action.payload;
    },
    
    setDiscountAmount: (state, action: PayloadAction<number>) => {
      state.discountAmount = action.payload;
    },
    
    setAmountToPay: (state, action: PayloadAction<number>) => {
      state.amountToPay = action.payload;
    },
    
    setIsProceedButtonEnabled: (state, action: PayloadAction<boolean>) => {
      state.isProceedBtnEnabled = action.payload;
    },

    clearCart: (state) => {
      console.log('Clearing entire cart');
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.totalOriginalPrice = 0;
      state.cartTabType = '';
      state.couponDetails = couponDetailsInitialState;
      localStorage.removeItem('cart_items');
    }
  }
});

export const {
  addItemToCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  setCartItems,
  removeItemFromCart,
  setCartTabType,
  setCouponDetails,
  resetCouponDetails,
  setTotalPrice,
  setAmountToPay,
  setDiscountAmount,
  setIsProceedButtonEnabled,
  setCartMinimum
} = cartSlice.actions;

export default cartSlice.reducer;