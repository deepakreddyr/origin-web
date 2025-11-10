import { addItemToCart, decreaseQuantity, increaseQuantity, removeItemFromCart } from '@/store/slice/CartSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import YellowBtn from './YellowBtn';
import WhiteBtn from './WhiteBtn';
import CreamBtn from './CreamBtn';
import BlackAddCartBtm from './BlackAddCartBtm';
import YellowAddCartBtm from './YellowAddCartBtm';
import { protectedUrl } from '@/url';
import { getAddressAndStoreId } from '@/utilities/utils';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';

const AddItemBtn = (props: any) => {
  const { product, varientId, stepperQuantity, buttonType } = props;

  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const sendDataToApi = useSendDataToApi();
  const getDataFromApi = useGetDataFromApi();

  // Normalize product ID - handle both 'id' and product ID variations
  const normalizedProductId = product.id || product.product_id;
  
  // Current variant cart data - more robust matching
  const cartItem = cartItems.find(
    (item: any) => {
      const itemProductId = item.id || item.product_id;
      const itemVariantId = item.variant_id || item.varientId;
      
      return itemProductId === normalizedProductId && itemVariantId === varientId;
    }
  );
  
  const itemQuantity = cartItem?.cart_quantity || 0;

  // Get selected variant details from product - handle different structures
  const uomArray = product.multiple_uoms || product.uoms || [];
  const selectedVariant = uomArray.find(
    (variant: any) => {
      const variantId = variant.variant_id || variant.varientId;
      return variantId === varientId;
    }
  );
  
  const maxQuantity = selectedVariant?.maximum_quantity || Infinity;

  const handleClearCartFromBackend = () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['clearCartItems'];
    const addressFromLs = getAddressAndStoreId();
    let additionalHeaders = {};
    if (addressFromLs) {
      additionalHeaders = { 'store-id': addressFromLs.store_id };
    }
    getDataFromApi(apiUrl, () => {}, () => {}, additionalHeaders);
  };

  const addItemsToApi = () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['addToCart'];
    const token = localStorage.getItem('user_token');
    const cartItemFromLs = localStorage.getItem('cart_items');
    const addressFromLs = getAddressAndStoreId();

    if (!token) return;
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    if (loginDetails.isSidebarOpen && cartItemFromLs) {
      const cartItemsParsed = JSON.parse(cartItemFromLs);
      const cartItemsToApi = {
        items: cartItemsParsed.map((item: any) => ({
          item_code: item.item_code,
          uom: item.multiple_uoms.map((uom: any) => ({
            id: uom.variant_id,
            qty: uom.cart_quantity
          }))
        }))
      };
      if (cartItemsParsed?.length === 0) {
        handleClearCartFromBackend();
      } else {
        sendDataToApi(apiUrl, cartItemsToApi, 'POST', () => {}, () => {}, additionalHeaders);
      }
    }
  };

  const handleAddItem = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant) return;

    // Normalize product data structure for cart
    const normalizedProduct = {
      id: normalizedProductId,
      item_code: product.item_code,
      name: product.name || product.item_name, // Handle both name variations
      image: product.image,
      bg_color: product.bg_color,
      is_available: product.is_available,
      is_greyed: product.is_greyed,
      is_orderable: product.is_orderable,
      navigation: product.navigation,
      tag_url: product.tag_url,
      multiple_uoms: uomArray
    };

    dispatch(addItemToCart({
      product: normalizedProduct,
      selectedUOM: {
        ...selectedVariant,
        stepper_quantity: stepperQuantity
      }
    }));

    if (loginDetails.user) {
      addItemsToApi();
    }
  };

  const handleIncrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // prevent increase if max reached
    if (itemQuantity >= maxQuantity) return;
    dispatch(increaseQuantity({ varientId, stepperQuantity }));
    if (loginDetails.user) {
      addItemsToApi();
    }
  };

  const handleDecrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (itemQuantity <= stepperQuantity) {
      dispatch(removeItemFromCart(varientId));
    } else {
      dispatch(decreaseQuantity({ varientId, stepperQuantity }));
    }
    if (loginDetails.user) {
      addItemsToApi();
    }
  };

  const handleRemoveUOM = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeItemFromCart(varientId));
    if (loginDetails.user) {
      addItemsToApi();
    }
  };

  const isVariantPresent = itemQuantity > 0;

  const BUTTON_MAP: any = {
    blackaddtocart: (
      <BlackAddCartBtm
        isItemPresent={isVariantPresent}
        quantity={itemQuantity}
        maxQuantity={maxQuantity}
        handleAddItem={handleAddItem}
        handleIncrease={handleIncrease}
        handleDecrease={handleDecrease}
        handleRemove={handleRemoveUOM}
      />
    ),
    yellowaddtocart: (
      <YellowAddCartBtm
        isItemPresent={isVariantPresent}
        quantity={itemQuantity}
        maxQuantity={maxQuantity}
        handleAddItem={handleAddItem}
        handleIncrease={handleIncrease}
        handleDecrease={handleDecrease}
        handleRemove={handleRemoveUOM}
      />
    ),
    yellow: (
      <YellowBtn
        isItemPresent={isVariantPresent}
        quantity={itemQuantity}
        maxQuantity={maxQuantity}
        handleAddItem={handleAddItem}
        handleIncrease={handleIncrease}
        handleDecrease={handleDecrease}
        handleRemove={handleRemoveUOM}
      />
    ),
    white: (
      <WhiteBtn
        isItemPresent={isVariantPresent}
        quantity={itemQuantity}
        maxQuantity={maxQuantity}
        handleAddItem={handleAddItem}
        handleIncrease={handleIncrease}
        handleDecrease={handleDecrease}
        handleRemove={handleRemoveUOM}
      />
    ),
    cream: (
      <CreamBtn
        isItemPresent={isVariantPresent}
        quantity={itemQuantity}
        maxQuantity={maxQuantity}
        handleAddItem={handleAddItem}
        handleIncrease={handleIncrease}
        handleDecrease={handleDecrease}
        handleRemove={handleRemoveUOM}
      />
    )
  };

  return <div>{BUTTON_MAP[buttonType]}</div>;
};

export default AddItemBtn;