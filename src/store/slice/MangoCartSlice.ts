import { couponDetailsInitialState } from '@/constants';
import { updateCartItemsToLs, calculateCouponDiscount } from '@/utilities/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// --- INTERFACES (Reused from CartSlice) ---

interface CartRipeness {
  ripeness_type: string;
  qty: string;
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
}

interface CartProduct {
  id: number;
  item_code: string;
  name: string;
  image: string;
  website_image?: string;
  bg_color: string;
  is_available: boolean;
  is_greyed: boolean;
  is_orderable: boolean;
  navigation: {
    to: string;
  };
  tag_url: string | null;
  multiple_uoms: CartUOM[];
  isFreeItem?: boolean;
  free?: boolean;
  isFree?: boolean;
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
  freeItems: any[];
  freeItemsMov: number;
  maxQuantityError: { message: string | null; isVisible: boolean };
  show_timeslot_sheet: boolean;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  totalOriginalPrice: 0,
  amountToPay: 0,
  cartTabType: 'CART_MAIN',
  isProceedBtnEnabled: false,
  couponDetails: couponDetailsInitialState,
  discountAmount: null,
  cart_minimum: null,
  deliveryFee: 0,
  freeItems: [],
  freeItemsMov: 0,
  maxQuantityError: { message: null, isVisible: false },
  show_timeslot_sheet: true
};

// --- UTILITY FUNCTIONS ---

const updateCartTotals = (state: CartState) => {
  state.totalPrice = 0;
  state.totalOriginalPrice = 0;
  state.totalQuantity = 0;

  state.items.forEach((product) => {
    const isProductFree = product.isFreeItem || product.free;

    product.multiple_uoms.forEach((uom: CartUOM) => {
      let totalUOMQuantity = 0;

      if (uom.cart_ripeness && uom.cart_ripeness.length > 0) {
        uom.cart_ripeness.forEach((ripeness: CartRipeness) => {
          const qty = Number(ripeness.qty);
          if (qty > 0) {
            if (!isProductFree) {
              state.totalPrice += uom.price * qty;
              const original = uom.market_price && uom.market_price > 0 ? uom.market_price : uom.price;
              state.totalOriginalPrice += original * qty;
            }
            state.totalQuantity += 1;
            totalUOMQuantity += qty;
          }
        });
        uom.cart_quantity = totalUOMQuantity;
      } else if (uom.cart_quantity > 0) {
        if (!isProductFree) {
          state.totalPrice += uom.price * uom.cart_quantity;
          const original = uom.market_price && uom.market_price > 0 ? uom.market_price : uom.price;
          state.totalOriginalPrice += original * uom.cart_quantity;
        }
        state.totalQuantity += 1;
      }
    });
  });
  // Calculate final amount to pay and recalculate coupon discount if needed
  if (state.couponDetails && state.couponDetails.code && state.couponDetails.code !== '') {
    const minVal = state.couponDetails.min_cart_value || 0;
    if (state.totalPrice >= minVal) {
      const newDiscount = calculateCouponDiscount(state.totalPrice, state.couponDetails) || 0;
      state.discountAmount = Math.round(newDiscount);
      state.amountToPay = Math.max(0, state.totalPrice - state.discountAmount);
    } else {
      state.discountAmount = 0;
      state.amountToPay = state.totalPrice;
    }
  } else {
    state.discountAmount = 0;
    state.amountToPay = state.totalPrice;
  }
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

// --- HELPER FUNCTIONS FOR PERSISTENT FREE ITEMS ---

const MANGO_PERSISTENT_FREE_ITEMS_KEY = 'mango_added_free_items';

const getPersistentFreeItems = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(MANGO_PERSISTENT_FREE_ITEMS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const addPersistentFreeItem = (itemCode: string) => {
  const items = getPersistentFreeItems();
  if (!items.includes(itemCode)) {
    items.push(itemCode);
    localStorage.setItem(MANGO_PERSISTENT_FREE_ITEMS_KEY, JSON.stringify(items));
  }
};

const removePersistentFreeItem = (itemCode: string) => {
  const items = getPersistentFreeItems().filter((code) => code !== itemCode);
  localStorage.setItem(MANGO_PERSISTENT_FREE_ITEMS_KEY, JSON.stringify(items));
};

const clearPersistentFreeItems = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(MANGO_PERSISTENT_FREE_ITEMS_KEY);
  }
};

// --- HELPER FUNCTION TO FIND AND UPDATE UOM/RIPENESS ---

const findUOMAndRipeness = (
  state: CartState,
  productId: number,
  variantId: number,
  selectedRipenessType: string | null
) => {
  const product = state.items.find((p) => String(p.id) === String(productId));
  if (!product) return { product: null, uom: null, ripeness: null, productIndex: -1 };

  const uom = product.multiple_uoms.find((u) => String(u.variant_id) === String(variantId));
  if (!uom) return { product, uom: null, ripeness: null, productIndex: -1 };

  const productIndex = state.items.findIndex((p) => String(p.id) === String(productId));

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

const mergeApiItems = (items: CartProduct[]): CartProduct[] => {
  const mergedMap = new Map<string, CartProduct>();

  items.forEach((item) => {
    const key = String(item.id || item.item_code);
    let existingProduct = mergedMap.get(key);

    if (!existingProduct) {
      existingProduct = JSON.parse(JSON.stringify({ ...item, multiple_uoms: [] }));
      mergedMap.set(key, existingProduct!);
    }

    if (item.multiple_uoms) {
      item.multiple_uoms.forEach((uom) => {
        const existingUom = existingProduct!.multiple_uoms.find((u) => String(u.variant_id) === String(uom.variant_id));

        if (existingUom) {
          if (uom.cart_ripeness && uom.cart_ripeness.length > 0) {
            if (!existingUom.cart_ripeness) existingUom.cart_ripeness = [];

            uom.cart_ripeness.forEach((r) => {
              const existingRipeness = existingUom.cart_ripeness!.find((er) => er.ripeness_type === r.ripeness_type);
              if (existingRipeness) {
                // Ignore duplicates by taking the max quantity instead of summing them
                existingRipeness.qty = String(Math.max(Number(existingRipeness.qty), Number(r.qty)));
              } else {
                existingUom.cart_ripeness!.push({ ...r });
              }
            });
          } else {
            existingUom.cart_quantity += uom.cart_quantity;
          }
        } else {
          const newUom = JSON.parse(JSON.stringify(uom));
          // Deep deduplicate cart_ripeness inside the new UOM
          if (newUom.cart_ripeness && newUom.cart_ripeness.length > 0) {
            const ripenessMap = new Map<string, any>();
            newUom.cart_ripeness.forEach((r: any) => {
              if (ripenessMap.has(r.ripeness_type)) {
                const existing = ripenessMap.get(r.ripeness_type);
                // Ignore duplicates by taking the max quantity instead of summing them
                existing.qty = String(Math.max(Number(existing.qty), Number(r.qty)));
              } else {
                ripenessMap.set(r.ripeness_type, { ...r });
              }
            });
            newUom.cart_ripeness = Array.from(ripenessMap.values());
          }
          existingProduct!.multiple_uoms.push(newUom);
        }
      });
    }
  });

  return Array.from(mergedMap.values());
};

const saveCart = (state: CartState) => {
  state.items.forEach((product) => {
    product.multiple_uoms.forEach((uom) => {
      if (uom.cart_ripeness) {
        const validRipeness = (uom.cart_ripeness ?? []).filter(
          (r) => r.ripeness_type !== null && r.ripeness_type !== undefined && Number(r.qty) > 0
        );

        if (validRipeness.length > 0) {
          uom.cart_ripeness = validRipeness;
        } else {
          uom.cart_ripeness = undefined;
        }
      }

      if (uom.cart_ripeness?.length && uom.cart_ripeness.length > 0) {
        uom.cart_quantity = uom.cart_ripeness.reduce((sum, r) => sum + Number(r.qty), 0);
      }
    });

    product.multiple_uoms = product.multiple_uoms.filter((uom) => uom.cart_quantity > 0);
  });

  state.items = state.items.filter((product) => product.multiple_uoms.length > 0);

  updateCartTotals(state);
  state.isProceedBtnEnabled = isProceedBtnEnabled(state);

  updateCartItemsToLs(state.items, 'mango_cart_items');
};

export const mangoCartSlice = createSlice({
  name: 'mangoCart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartProduct[]>) => {
      const persistentFreeItems = getPersistentFreeItems();
      const preservedFreeItems = state.items.filter((item) => item.isFreeItem || item.free || item.isFree);

      const itemsFromApi = action.payload.map((item) => {
        const isActuallyFree =
          persistentFreeItems.includes(item.item_code) ||
          item.isFreeItem ||
          item.free ||
          item.isFree ||
          (item.multiple_uoms && item.multiple_uoms.some((u) => Number(u.price) === 0));

        return {
          ...item,
          isFreeItem: isActuallyFree,
          free: isActuallyFree,
          isFree: isActuallyFree,
          multiple_uoms: item.multiple_uoms.map((uom) => ({
            ...uom,
            price: isActuallyFree ? 0 : uom.price
          }))
        };
      });

      const mergedApiItems = mergeApiItems(itemsFromApi);

      const apiItemCodes = new Set(mergedApiItems.map((i) => i.item_code));
      const finalRestoredItems = preservedFreeItems.filter((i) => !apiItemCodes.has(i.item_code));

      state.items = [...finalRestoredItems, ...mergedApiItems];
      saveCart(state);
    },

    addItemToCart: (
      state,
      action: PayloadAction<{ product: any; selectedUOM: any; selectedRipenessType: string | null }>
    ) => {
      const { product, selectedUOM, selectedRipenessType } = action.payload;
      const normalizedProductId = product.id || product.product_id;
      const normalizedVariantId = selectedUOM.variant_id || selectedUOM.varientId;
      const quantityToAdd = selectedUOM.stepper_quantity;

      const originalVariant = product.multiple_uoms.find(
        (uom: any) => String(uom.variant_id || uom.varientId) === String(normalizedVariantId)
      );
      const actualStepperQuantity = originalVariant?.stepper_quantity || 1;

      const {
        product: existingProduct,
        uom: existingUOM,
        ripeness: existingRipeness
      } = findUOMAndRipeness(state, normalizedProductId, normalizedVariantId, selectedRipenessType);

      if (existingUOM) {
        if (existingUOM.cart_quantity + quantityToAdd > existingUOM.maximum_quantity) {
          saveCart(state);
          return;
        }

        if (state.couponDetails && state.couponDetails.id && product.isFreeItem) {
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
              qty: String(quantityToAdd)
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
            : undefined
        };

        if (existingProduct) {
          existingProduct.multiple_uoms.push(newUOM);
        } else {
          const newProduct: CartProduct = {
            id: normalizedProductId,
            item_code: product.item_code,
            name: product.name || product.item_name,
            image: product.image,
            website_image: product.website_image,
            bg_color: product.bg_color,
            is_available: product.is_available,
            is_greyed: product.is_greyed,
            is_orderable: product.is_orderable,
            navigation: product.navigation,
            tag_url: product.tag_url,
            multiple_uoms: [newUOM]
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
          if (String(uom.variant_id) === String(varientId)) {
            if (selectedRipenessType) {
              if (uom.cart_ripeness) {
                uom.cart_ripeness = uom.cart_ripeness.filter((r) => {
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
            }
          }
        });
      });

      saveCart(state);
    },

    increaseQuantity: (
      state,
      action: PayloadAction<{ varientId: number; stepperQuantity: number; selectedRipenessType: string | null }>
    ) => {
      const { varientId, stepperQuantity, selectedRipenessType } = action.payload;
      const product = state.items.find((p) => p.multiple_uoms.some((u) => String(u.variant_id) === String(varientId)));
      if (!product) return;

      const { uom, ripeness } = findUOMAndRipeness(state, product.id, varientId, selectedRipenessType);

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

    decreaseQuantity: (
      state,
      action: PayloadAction<{ varientId: number; stepperQuantity: number; selectedRipenessType: string | null }>
    ) => {
      const { varientId, stepperQuantity, selectedRipenessType } = action.payload;
      const product = state.items.find((p) => p.multiple_uoms.some((u) => String(u.variant_id) === String(varientId)));
      if (!product) return;

      const { uom, ripeness } = findUOMAndRipeness(state, product.id, varientId, selectedRipenessType);

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
            uom.cart_ripeness = uom.cart_ripeness.filter(
              (ripeness) => availableRipenessTypes.includes(ripeness.ripeness_type) && Number(ripeness.qty) > 0
            );
            if (uom.cart_ripeness.length !== originalLength) {
              hasChanges = true;
            }
            if (uom.cart_ripeness.length > 0) {
              uom.cart_quantity = uom.cart_ripeness.reduce((sum, r) => sum + Number(r.qty), 0);
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

    setCartMinimum: (state, action: PayloadAction<number>) => {
      state.cart_minimum = action.payload;
      saveCart(state);
    },
    setShowTimeslotSheet: (state, action: PayloadAction<boolean>) => {
      state.show_timeslot_sheet = action.payload;
    },

    setCartTabType: (state, action: PayloadAction<string>) => {
      state.cartTabType = action.payload;
    },

    setCouponDetails: (state, action: PayloadAction<any>) => {
      state.couponDetails = action.payload;
      saveCart(state);
    },

    resetCouponDetails: (state) => {
      state.couponDetails = couponDetailsInitialState;
      saveCart(state);
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

    setFreeItems: (state, action: PayloadAction<{ freeItems: any[]; freeItemsMov: number }>) => {
      state.freeItems = action.payload.freeItems;
      state.freeItemsMov = action.payload.freeItemsMov;

      const persistentFreeItems = getPersistentFreeItems();
      const currentItemCodes = state.items.map((item) => item.item_code);
      const missingFreeItems = persistentFreeItems.filter((code) => !currentItemCodes.includes(code));

      let itemsAdded = false;
      missingFreeItems.forEach((code) => {
        const freeItemDef = action.payload.freeItems.find((f: any) => f.item_code === code);
        if (freeItemDef) {
          const uom = freeItemDef.multiple_uoms?.[0] || freeItemDef.uom?.[0];
          if (uom) {
            const newProduct: CartProduct = {
              id: freeItemDef.id,
              item_code: freeItemDef.item_code,
              name: freeItemDef.name || freeItemDef.item_name,
              image: freeItemDef.image || freeItemDef.logo,
              website_image: freeItemDef.website_image,
              bg_color: freeItemDef.bg_color || '',
              is_available: true,
              is_greyed: false,
              is_orderable: true,
              navigation: { to: '' },
              tag_url: null,
              multiple_uoms: [
                {
                  variant_id: uom.variant_id,
                  cart_quantity: 1,
                  price: 0,
                  market_price: uom.market_price || uom.price,
                  maximum_quantity: uom.maximum_quantity || 1,
                  minimum_quantity: uom.minimum_quantity || 1,
                  stepper_quantity: uom.stepper_quantity || 1,
                  unit: uom.unit,
                  uom_id: uom.uom_id,
                  conversion_text: uom.conversion_text || '',
                  is_available: true,
                  is_default: true,
                  is_visible: true,
                  ripeness_types: uom.ripeness_types || null,
                  cart_ripeness: undefined
                }
              ],
              isFreeItem: true,
              free: true,
              isFree: true
            };
            state.items.unshift(newProduct);
            itemsAdded = true;
          }
        }
      });
      if (itemsAdded) saveCart(state);
    },

    addFreeItemToCart: (state, action: PayloadAction<any>) => {
      const freeItem = action.payload;
      state.items = state.items.filter((item) => {
        const isFree = item.isFreeItem || item.free || item.isFree;
        if (isFree) {
          removePersistentFreeItem(item.item_code);
          return false;
        }
        return true;
      });

      if (state.couponDetails && state.couponDetails.id) {
        saveCart(state);
        return;
      }

      const uom = freeItem.multiple_uoms?.[0] || freeItem.uom?.[0];
      if (!uom) return;

      const newProduct: CartProduct = {
        id: freeItem.id,
        item_code: freeItem.item_code,
        name: freeItem.name || freeItem.item_name,
        image: freeItem.image || freeItem.logo,
        website_image: freeItem.website_image,
        bg_color: freeItem.bg_color || '',
        is_available: true,
        is_greyed: false,
        is_orderable: true,
        navigation: { to: '' },
        tag_url: null,
        multiple_uoms: [
          {
            variant_id: uom.variant_id,
            cart_quantity: 1,
            price: 0,
            market_price: uom.market_price || uom.price,
            maximum_quantity: 1,
            minimum_quantity: 1,
            stepper_quantity: 1,
            unit: uom.unit,
            uom_id: uom.uom_id,
            conversion_text: uom.conversion_text || '',
            is_available: true,
            is_default: true,
            is_visible: true,
            ripeness_types: null,
            cart_ripeness: undefined
          }
        ],
        isFreeItem: true,
        free: true,
        isFree: true
      };

      state.items.unshift(newProduct);
      addPersistentFreeItem(newProduct.item_code);
      saveCart(state);
    },

    removeFreeItemFromCart: (state, action: PayloadAction<string>) => {
      const itemCode = action.payload;
      const freeItemIndex = state.items.findIndex(
        (item) => (item.isFreeItem || item.free) && item.item_code === itemCode
      );
      if (freeItemIndex !== -1) {
        state.items.splice(freeItemIndex, 1);
        state.totalQuantity = Math.max(0, state.totalQuantity - 1);
        removePersistentFreeItem(itemCode);
        saveCart(state);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.totalOriginalPrice = 0;
      state.cartTabType = '';
      state.couponDetails = couponDetailsInitialState;
      state.deliveryFee = 0;
      state.freeItems = [];
      state.freeItemsMov = 0;
      state.maxQuantityError = { message: null, isVisible: false };
      localStorage.removeItem('mango_cart_items');
      clearPersistentFreeItems();
    },

    setMaxQuantityError: (state, action: PayloadAction<string | null>) => {
      state.maxQuantityError = {
        message: action.payload,
        isVisible: !!action.payload
      };
    }
  }
});

export const {
  addItemToCart: addMangoItemToCart,
  increaseQuantity: increaseMangoQuantity,
  decreaseQuantity: decreaseMangoQuantity,
  clearCart: clearMangoCart,
  setCartItems: setMangoCartItems,
  removeItemFromCart: removeMangoItemFromCart,
  setCartTabType: setMangoCartTabType,
  setCouponDetails: setMangoCouponDetails,
  resetCouponDetails: resetMangoCouponDetails,
  setTotalPrice: setMangoTotalPrice,
  setAmountToPay: setMangoAmountToPay,
  setDiscountAmount: setMangoDiscountAmount,
  setIsProceedButtonEnabled: setIsMangoProceedButtonEnabled,
  setCartMinimum: setMangoCartMinimum,
  setShowTimeslotSheet: setMangoShowTimeslotSheet,
  setDeliveryFee: setMangoDeliveryFee,
  validateAndCleanCart: validateAndCleanMangoCart,
  setFreeItems: setMangoFreeItems,
  addFreeItemToCart: addFreeMangoItemToCart,
  removeFreeItemFromCart: removeFreeMangoItemFromCart,
  setMaxQuantityError: setMangoMaxQuantityError
} = mangoCartSlice.actions;

export default mangoCartSlice.reducer;
