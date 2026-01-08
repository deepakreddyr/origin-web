import { couponDetailsInitialState } from '@/constants';
import { updateCartItemsToLs } from '@/utilities/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// --- INTERFACES ---

interface CartRipeness {
  ripeness_type: string;
  qty: string;
}

interface BasketItem {
  id: number;
  parent_id: number;
  child_id: number;
  name: string;
  image: string;
  price: string;
  uom: string;
  min_qty: number;
  max_qty: number;
  cart_qty: number;
  uom_conversion_in_grams: number;
  is_available: boolean;
}

interface Basket {
  capacity: number;
  basket_items: BasketItem[];
}

interface CartUOM {
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
  is_available: boolean;
  is_default: boolean;
  is_visible: boolean;
  ripeness_types: any;
  cart_ripeness?: CartRipeness[] | null | undefined;
  basket?: Basket;
  gift_text?: string | null;
}

interface CartProduct {
  id: number;
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
  multiple_uoms: CartUOM[];
}

interface CartState {
  items: CartProduct[];
  totalQuantity: number;
  totalPrice: number;
  totalOriginalPrice: number;
  cartTabType: string;
  isProceedBtnEnabled: boolean;
  couponDetails: any;
  amountToPay: number;
  discountAmount: number | null;
  cart_minimum: number | null;
  deliveryFee: number;
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
  deliveryFee: 0,
};

// --- UTILITY FUNCTIONS ---

const updateCartTotals = (state: CartState) => {
  state.totalPrice = 0;
  state.totalOriginalPrice = 0;
  state.totalQuantity = 0;

  state.items.forEach((product) => {
    product.multiple_uoms.forEach((uom) => {
      // Check if this is a basket item
      if (uom.basket) {
        // Calculate basket items total (per basket unit)
        const basketItemsTotalPerUnit = uom.basket.basket_items.reduce((acc: number, item) =>
          acc + (item.cart_qty * Number(item.price)), 0
        );

        // Total for one basket unit (parent + children)
        const totalPerBasket = uom.price + basketItemsTotalPerUnit;

        // Add to totals (multiply by parent quantity)
        state.totalPrice += totalPerBasket * uom.cart_quantity;

        // Use market price if available
        const originalParentPrice = (uom.market_price && uom.market_price > 0 ? uom.market_price : uom.price);
        const originalTotalPerBasket = originalParentPrice + basketItemsTotalPerUnit;

        state.totalOriginalPrice += originalTotalPerBasket * uom.cart_quantity;

        // Count as one line item
        state.totalQuantity += 1;
      } else {
        // Regular item (existing logic)
        let totalUOMQuantity = 0;

        if (uom.cart_ripeness && uom.cart_ripeness.length > 0) {
          uom.cart_ripeness.forEach((ripeness) => {
            const qty = Number(ripeness.qty);
            if (qty > 0) {
              state.totalPrice += uom.price * qty;
              const original = uom.market_price && uom.market_price > 0 ? uom.market_price : uom.price;
              state.totalOriginalPrice += original * qty;
              state.totalQuantity += 1;
              totalUOMQuantity += qty;
            }
          });
          uom.cart_quantity = totalUOMQuantity;
        } else if (uom.cart_quantity > 0) {
          state.totalPrice += uom.price * uom.cart_quantity;
          const original = uom.market_price && uom.market_price > 0 ? uom.market_price : uom.price;
          state.totalOriginalPrice += original * uom.cart_quantity;
          state.totalQuantity += 1;
        }
      }
    });
  });

  state.amountToPay = state.totalPrice;
};

const isProceedBtnEnabled = (state: CartState): boolean => {
  if (state.cart_minimum && state.amountToPay < state.cart_minimum) return false;

  for (const product of state.items) {
    for (const uom of product.multiple_uoms) {
      if (!uom.is_available) return false;
      if (uom.cart_quantity > uom.maximum_quantity) return false;
    }
  }
  return true;
};

const findUOMAndRipeness = (state: CartState, productId: number, variantId: number, selectedRipenessType: string | null) => {
  const product = state.items.find((p) => p.id === productId);
  if (!product) return { product: null, uom: null, ripeness: null, productIndex: -1 };

  const uom = product.multiple_uoms.find((u) => u.variant_id === variantId);
  if (!uom) return { product, uom: null, ripeness: null, productIndex: -1 };

  const productIndex = state.items.findIndex((p) => p.id === productId);

  if (selectedRipenessType) {
    if (!uom.cart_ripeness) uom.cart_ripeness = [];
    const ripeness = uom.cart_ripeness.find((r) => r.ripeness_type === selectedRipenessType);
    return { product, uom, ripeness, productIndex };
  } else {
    return { product, uom, ripeness: null, productIndex };
  }
};

const updateCartQuantityInNestedStructure = (
  uom: CartUOM,
  ripeness: CartRipeness | null,
  stepperQuantity: number,
  action: 'increase' | 'decrease'
) => {
  const amount = action === 'increase' ? stepperQuantity : -stepperQuantity;

  if (action === 'increase') {
    if (uom.cart_quantity + amount > uom.maximum_quantity) return;
  }

  uom.cart_quantity = Math.max(0, uom.cart_quantity + amount);

  if (ripeness) {
    let currentQty = Number(ripeness.qty);
    currentQty = Math.max(0, currentQty + amount);
    ripeness.qty = String(currentQty);
  }
};

const saveCart = (state: CartState) => {
  // console.log(state.items, "state.items");
  state.items.forEach(product => {
    product.multiple_uoms.forEach(uom => {
      // Skip processing for baskets - they're already validated by the server
      if (uom.basket) {
        return;
      }

      if (uom.cart_ripeness) {
        const validRipeness = (uom.cart_ripeness ?? []).filter(
          r => r.ripeness_type !== null && r.ripeness_type !== undefined && Number(r.qty) > 0
        );

        if (validRipeness.length > 0) {
          uom.cart_ripeness = validRipeness;
        } else {
          uom.cart_ripeness = undefined;
        }
      }

      if (uom.cart_ripeness?.length && uom.cart_ripeness.length > 0) {
        uom.cart_quantity = uom.cart_ripeness.reduce(
          (sum, r) => sum + Number(r.qty),
          0
        );
      }
    });

    // Remove UOMs with zero quantity (but ALWAYS keep baskets)
    product.multiple_uoms = product.multiple_uoms.filter(uom => {
      if (uom.basket) {
        // ALWAYS keep baskets - the server validates them
        return true;
      }
      return uom.cart_quantity > 0;
    });
  });

  state.items = state.items.filter(product => product.multiple_uoms.length > 0);

  updateCartTotals(state);
  state.isProceedBtnEnabled = isProceedBtnEnabled(state);
  console.log(state.items, "state.items after update");
  updateCartItemsToLs(state.items);
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartProduct[]>) => {
      state.items = action.payload;
      // console.log(state.items, "state.items in setCartItems");
      saveCart(state);
    },

    setCartItemsFromServer: (state, action: PayloadAction<CartProduct[]>) => {
      // When items come from server, we usually trust them.
      // However, for BASKETS, the server might not return the full 'basket_items' with quantities
      // (or it might return default empty baskets).
      // We must MERGE the local basket item quantities into the server response to avoid losing user selection.

      const serverItems = action.payload;

      serverItems.forEach((serverProduct) => {
        const localProduct = state.items.find((p) => p.id === serverProduct.id);
        if (!localProduct) return;

        serverProduct.multiple_uoms.forEach((serverUom) => {
          const localUom = localProduct.multiple_uoms.find((u) => u.variant_id === serverUom.variant_id);

          if (!localUom) return;

          // Case 1: Server has basket, merge local quantities
          if (serverUom.basket && localUom.basket) {
            serverUom.basket.basket_items.forEach((serverChildItem) => {
              const localChildItem = localUom.basket?.basket_items.find((lci) => lci.id === serverChildItem.id);
              if (localChildItem && localChildItem.cart_qty > 0) {
                serverChildItem.cart_qty = localChildItem.cart_qty;
              }
            });

            // Also preserve gift text if present locally and missing/null on server
            if (localUom.gift_text && !serverUom.gift_text) {
              serverUom.gift_text = localUom.gift_text;
            }
          }
          // Case 2: Server doesn't have basket but local does - restore entire local basket
          else if (!serverUom.basket && localUom.basket) {
            serverUom.basket = localUom.basket;
            serverUom.gift_text = localUom.gift_text || null;
          }
        });
      });

      state.items = serverItems;
      // console.log(state.items, "state.items merged from server");

      updateCartTotals(state);
      state.isProceedBtnEnabled = isProceedBtnEnabled(state);
      updateCartItemsToLs(state.items);
    },

    addItemToCart: (state, action: PayloadAction<{ product: any; selectedUOM: any; selectedRipenessType: string | null }>) => {
      const { product, selectedUOM, selectedRipenessType } = action.payload;
      const normalizedProductId = product.id || product.product_id;
      const normalizedVariantId = selectedUOM.variant_id || selectedUOM.varientId;

      const quantityToAdd = selectedUOM.stepper_quantity;

      const originalVariant = product.multiple_uoms.find((uom: any) =>
        (uom.variant_id || uom.varientId) === normalizedVariantId
      );
      const actualStepperQuantity = originalVariant?.stepper_quantity || 1;

      const { product: existingProduct, uom: existingUOM, ripeness: existingRipeness } = findUOMAndRipeness(
        state,
        normalizedProductId,
        normalizedVariantId,
        selectedRipenessType
      );

      if (existingUOM) {
        if (existingUOM.cart_quantity + quantityToAdd > existingUOM.maximum_quantity) {
          saveCart(state);
          return;
        }

        if (selectedRipenessType) {
          if (existingRipeness) {
            updateCartQuantityInNestedStructure(existingUOM, existingRipeness, quantityToAdd, 'increase');
          } else {
            if (!existingUOM.cart_ripeness) existingUOM.cart_ripeness = [];

            existingUOM.cart_ripeness.push({
              ripeness_type: selectedRipenessType,
              qty: String(quantityToAdd),
            });
            existingUOM.cart_quantity += quantityToAdd;
          }
        } else {
          existingUOM.cart_quantity += quantityToAdd;

          if (existingUOM.cart_ripeness && existingUOM.cart_ripeness.length > 0) {
            const firstRipeness = existingUOM.cart_ripeness[0];
            firstRipeness.qty = String(Number(firstRipeness.qty) + quantityToAdd);
          }
        }
      } else {
        const newUOM: CartUOM = {
          variant_id: normalizedVariantId,
          cart_quantity: quantityToAdd,
          price: selectedUOM.price,
          market_price: selectedUOM.market_price,
          maximum_quantity: selectedUOM.maximum_quantity,
          minimum_quantity: selectedUOM.minimum_quantity,
          stepper_quantity: actualStepperQuantity,
          unit: selectedUOM.unit,
          uom_id: selectedUOM.uom_id,
          conversion_text: selectedUOM.conversion_text,
          is_available: selectedUOM.is_available,
          is_default: selectedUOM.is_default,
          is_visible: selectedUOM.is_visible,
          ripeness_types: selectedUOM.ripeness_types,
          cart_ripeness: selectedRipenessType
            ? [{ ripeness_type: selectedRipenessType, qty: String(quantityToAdd) }]
            : undefined,
          basket: selectedUOM.basket ? {
            capacity: selectedUOM.basket.capacity,
            basket_items: selectedUOM.basket.basket_items.map((item: any) => ({
              ...item,
              cart_qty: 0
            }))
          } : undefined
        };

        if (existingProduct) {
          existingProduct.multiple_uoms.push(newUOM);
        } else {
          const newProduct: CartProduct = {
            id: normalizedProductId,
            item_code: product.item_code,
            name: product.name || product.item_name,
            image: product.image,
            bg_color: product.bg_color,
            is_available: product.is_available,
            is_greyed: product.is_greyed,
            is_orderable: product.is_orderable,
            navigation: product.navigation,
            tag_url: product.tag_url,
            multiple_uoms: [newUOM],
          };
          state.items.push(newProduct);
        }
      }

      saveCart(state);
    },

    removeItemFromCart: (state, action: PayloadAction<{ varientId: number; selectedRipenessType: string | null }>) => {
      const { varientId, selectedRipenessType } = action.payload;

      state.items.forEach((product) => {
        product.multiple_uoms.forEach((uom) => {
          if (uom.variant_id === varientId) {
            if (selectedRipenessType) {
              if (uom.cart_ripeness) {
                uom.cart_ripeness = uom.cart_ripeness.filter(r => {
                  const isMatch = r.ripeness_type === selectedRipenessType;
                  if (isMatch) {
                    uom.cart_quantity -= Number(r.qty);
                  }
                  return !isMatch;
                });
              }
            } else {
              uom.cart_quantity = 0;
              uom.cart_ripeness = undefined;

              if (uom.basket && uom.basket.basket_items) {
                uom.basket = undefined;
              }
            }
          }
        });
      });

      saveCart(state);
    },

    increaseQuantity: (state, action: PayloadAction<{ varientId: number; stepperQuantity: number; selectedRipenessType: string | null }>) => {
      const { varientId, stepperQuantity, selectedRipenessType } = action.payload;

      const product = state.items.find(p => p.multiple_uoms.some(u => u.variant_id === varientId));
      if (!product) return;

      const { uom, ripeness } = findUOMAndRipeness(
        state,
        product.id,
        varientId,
        selectedRipenessType
      );

      if (uom) {
        if (uom.cart_quantity + stepperQuantity > uom.maximum_quantity) {
          saveCart(state);
          return;
        }

        if (selectedRipenessType) {
          if (ripeness) {
            updateCartQuantityInNestedStructure(uom, ripeness, stepperQuantity, 'increase');
          }
        } else {
          updateCartQuantityInNestedStructure(uom, null, stepperQuantity, 'increase');

          if (uom.cart_ripeness && uom.cart_ripeness.length > 0) {
            const firstRipeness = uom.cart_ripeness[0];
            const currentQty = Number(firstRipeness.qty);
            firstRipeness.qty = String(currentQty + stepperQuantity);
          }
        }
      }

      saveCart(state);
    },

    decreaseQuantity: (state, action: PayloadAction<{ varientId: number; stepperQuantity: number; selectedRipenessType: string | null }>) => {
      const { varientId, stepperQuantity, selectedRipenessType } = action.payload;

      const product = state.items.find(p => p.multiple_uoms.some(u => u.variant_id === varientId));
      if (!product) return;

      const { uom, ripeness } = findUOMAndRipeness(
        state,
        product.id,
        varientId,
        selectedRipenessType
      );

      if (uom) {
        if (selectedRipenessType) {
          if (ripeness) {
            updateCartQuantityInNestedStructure(uom, ripeness, stepperQuantity, 'decrease');
          }
        } else {
          updateCartQuantityInNestedStructure(uom, null, stepperQuantity, 'decrease');

          if (uom.cart_ripeness && uom.cart_ripeness.length > 0) {
            const firstRipeness = uom.cart_ripeness[0];
            let currentQty = Number(firstRipeness.qty);

            if (currentQty > 0) {
              currentQty = Math.max(0, currentQty - stepperQuantity);
              firstRipeness.qty = String(currentQty);
            }
          }

          if (uom.basket && uom.basket.basket_items && uom.cart_quantity === 0) {
            uom.basket.basket_items.forEach(item => {
              item.cart_qty = 0;
            });
          }
        }
      }

      saveCart(state);
    },

    validateAndCleanCart: (state) => {
      let hasChanges = false;

      state.items.forEach((product) => {
        product.multiple_uoms.forEach((uom) => {
          const availableRipenessTypes = Array.isArray(uom.ripeness_types) ? uom.ripeness_types : [];

          if (uom.cart_ripeness && uom.cart_ripeness.length > 0) {
            const originalLength = uom.cart_ripeness.length;

            uom.cart_ripeness = uom.cart_ripeness.filter((ripeness) =>
              availableRipenessTypes.includes(ripeness.ripeness_type) && Number(ripeness.qty) > 0
            );

            if (uom.cart_ripeness.length !== originalLength) {
              hasChanges = true;
            }

            if (uom.cart_ripeness.length > 0) {
              uom.cart_quantity = uom.cart_ripeness.reduce(
                (sum, r) => sum + Number(r.qty),
                0
              );
            } else {
              uom.cart_ripeness = undefined;
              uom.cart_quantity = 0;
              hasChanges = true;
            }
          }
        });
      });

      if (hasChanges) {
        saveCart(state);
      }
    },

    // ============================================
    // BASKET ACTIONS
    // ============================================

    addBasket: (state, action: PayloadAction<{ product: any; selectedUOM: any; variantId: number }>) => {
      const { product, selectedUOM, variantId } = action.payload;

      const existingBasketIndex = state.items.findIndex((item: any) =>
        item.id === product.id &&
        item.multiple_uoms?.some((u: any) => u.variant_id === variantId)
      );

      if (existingBasketIndex !== -1) {
        saveCart(state);
        return;
      }

      const newBasket: CartProduct = {
        id: product.id,
        item_code: product.item_code || '',
        name: product.name,
        image: product.image,
        bg_color: product.bg_color || '#F9F0DA',
        is_available: product.is_available !== undefined ? product.is_available : true,
        is_greyed: product.is_greyed || false,
        is_orderable: product.is_orderable !== undefined ? product.is_orderable : false,
        navigation: product.navigation || { to: '' },
        tag_url: product.tag_url || null,
        multiple_uoms: [{
          variant_id: selectedUOM.variant_id,
          uom_id: selectedUOM.uom_id,
          unit: selectedUOM.unit,
          minimum_quantity: selectedUOM.minimum_quantity,
          maximum_quantity: selectedUOM.maximum_quantity,
          stepper_quantity: selectedUOM.stepper_quantity,
          is_visible: true,
          is_available: selectedUOM.is_available,
          is_default: true,
          price: selectedUOM.price,
          market_price: selectedUOM.market_price || 0,
          cart_quantity: 1,
          conversion_text: selectedUOM.conversion_text || '',
          ripeness_types: selectedUOM.ripeness_types || null,
          cart_ripeness: undefined,
          gift_text: null,
          basket: {
            capacity: selectedUOM.basket.capacity,
            basket_items: selectedUOM.basket.basket_items.map((item: any) => ({
              id: item.id,
              parent_id: item.parent_id,
              child_id: item.child_id,
              name: item.name,
              image: item.image,
              uom: item.uom,
              price: item.price,
              min_qty: item.min_qty,
              max_qty: item.max_qty,
              uom_conversion_in_grams: item.uom_conversion_in_grams,
              cart_qty: 0,
              is_available: item.is_available
            }))
          }
        }]
      };

      state.items.push(newBasket);
      saveCart(state);
    },

    increaseBasketQuantity: (state, action: PayloadAction<{ productId: number; variantId: number }>) => {
      const { productId, variantId } = action.payload;

      const product = state.items.find((item: any) => item.id === productId);
      if (!product) {
        saveCart(state);
        return;
      }

      const uom = product.multiple_uoms.find((u: any) => u.variant_id === variantId);
      if (!uom || !uom.basket) {
        saveCart(state);
        return;
      }

      if (uom.cart_quantity >= uom.maximum_quantity) {
        saveCart(state);
        return;
      }

      const newQuantity = uom.cart_quantity + 1;

      uom.cart_quantity = newQuantity;

      saveCart(state);
    },

    decreaseBasketQuantity: (state, action: PayloadAction<{ productId: number; variantId: number }>) => {
      const { productId, variantId } = action.payload;

      const product = state.items.find((item: any) => item.id === productId);
      if (!product) {
        saveCart(state);
        return;
      }

      const uom = product.multiple_uoms.find((u: any) => u.variant_id === variantId);
      if (!uom || !uom.basket) {
        saveCart(state);
        return;
      }

      uom.cart_quantity = Math.max(1, uom.cart_quantity - 1);

      saveCart(state);
    },

    updateBasketItem: (
      state,
      action: PayloadAction<{
        productId: number;
        variantId: number;
        childItem: any;
        newQuantity: number;
      }>
    ) => {
      const { productId, variantId, childItem } = action.payload;

      // ✅ create a mutable copy
      let quantity = action.payload.newQuantity;

      const product = state.items.find((item: any) => item.id === productId);
      if (!product) {
        saveCart(state);
        return;
      }

      const uom = product.multiple_uoms.find(
        (u: any) => u.variant_id === variantId
      );
      if (!uom || !uom.basket) {
        saveCart(state);
        return;
      }

      // 🚫 Exceeds max allowed (per basket)
      if (quantity > childItem.max_qty) {
        saveCart(state);
        return;
      }

      // 🔒 Enforce minimum quantity (per basket)
      if (quantity > 0 && quantity < childItem.min_qty) {
        quantity = childItem.min_qty;
      }

      // ⚖️ Capacity constraint (per basket)
      const totalCapacityGrams = uom.basket.capacity;

      const otherItemsWeight = uom.basket.basket_items
        .filter((item: any) => item.id !== childItem.id)
        .reduce(
          (acc: number, item: any) =>
            acc + item.cart_qty * item.uom_conversion_in_grams,
          0
        );

      const newTotalWeight =
        otherItemsWeight + quantity * childItem.uom_conversion_in_grams;

      if (newTotalWeight > totalCapacityGrams) {
        saveCart(state);
        return;
      }

      const existingItemIndex = uom.basket.basket_items.findIndex(
        (item: any) => item.id === childItem.id
      );

      if (existingItemIndex !== -1) {
        uom.basket.basket_items[existingItemIndex] = {
          ...uom.basket.basket_items[existingItemIndex],
          cart_qty: quantity,
        };
      } else {
        const newItem: BasketItem = {
          ...childItem,
          cart_qty: quantity,
        };
        uom.basket.basket_items.push(newItem);
      }

      saveCart(state);
    },


    removeBasketItem: (state, action: PayloadAction<{ productId: number; variantId: number; childItemId: number }>) => {
      const { productId, variantId, childItemId } = action.payload;

      const product = state.items.find((item: any) => item.id === productId);
      if (!product) {
        saveCart(state);
        return;
      }

      const uom = product.multiple_uoms.find((u: any) => u.variant_id === variantId);
      if (!uom || !uom.basket) {
        saveCart(state);
        return;
      }

      uom.basket.basket_items = uom.basket.basket_items.map((bItem) => {
        if (bItem.id === childItemId) {
          return {
            ...bItem,
            cart_qty: 0
          };
        }
        return bItem;
      });

      saveCart(state);
    },

    removeBasket: (state, action: PayloadAction<{ productId: number; variantId: number }>) => {
      const { productId, variantId } = action.payload;

      const productIndex = state.items.findIndex((item: any) => item.id === productId);
      if (productIndex === -1) {
        saveCart(state);
        return;
      }

      const product = state.items[productIndex];

      const updatedUoms = product.multiple_uoms.filter((uom: any) =>
        uom.variant_id !== variantId
      );

      if (updatedUoms.length === 0) {
        state.items.splice(productIndex, 1);
      } else {
        product.multiple_uoms = updatedUoms;
      }

      saveCart(state);
    },

    updateBasketGiftText: (state, action: PayloadAction<{ productId: number; variantId: number; giftText: string }>) => {
      const { productId, variantId, giftText } = action.payload;

      const product = state.items.find((item: any) => item.id === productId);
      if (!product) {
        saveCart(state);
        return;
      }

      const uom = product.multiple_uoms.find((u: any) => u.variant_id === variantId);
      if (!uom || !uom.basket) {
        saveCart(state);
        return;
      }

      uom.gift_text = giftText || null;

      saveCart(state);
    },

    // ============================================
    // OTHER REDUCERS
    // ============================================

    setCartMinimum: (state, action: PayloadAction<number>) => {
      state.cart_minimum = action.payload;
      saveCart(state);
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

    setDeliveryFee: (state, action: PayloadAction<number>) => {
      state.deliveryFee = action.payload;
    },

    setIsProceedButtonEnabled: (state, action: PayloadAction<boolean>) => {
      state.isProceedBtnEnabled = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.totalOriginalPrice = 0;
      state.cartTabType = '';
      state.couponDetails = couponDetailsInitialState;
      state.deliveryFee = 0;
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
  setCartItemsFromServer,
  removeItemFromCart,
  setCartTabType,
  setCouponDetails,
  resetCouponDetails,
  setTotalPrice,
  setAmountToPay,
  setDiscountAmount,
  setIsProceedButtonEnabled,
  setCartMinimum,
  setDeliveryFee,
  validateAndCleanCart,
  addBasket,
  increaseBasketQuantity,
  decreaseBasketQuantity,
  updateBasketItem,
  removeBasketItem,
  removeBasket,
  updateBasketGiftText,
} = cartSlice.actions;

export default cartSlice.reducer;