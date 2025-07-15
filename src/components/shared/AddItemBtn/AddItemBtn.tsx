import { addItemToCart, decreaseQuantity, increaseQuantity } from '@/store/slice/CartSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import YellowBtn from './YellowBtn';
import WhiteBtn from './WhiteBtn';
import BlackBtn from './BlackBtn';
import { protectedUrl } from '@/url';
import { getAddressAndStoreId, prepareCartItemsToApi } from '@/utilities/utils';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
// import {
//     addItemToCart,
//     increaseQuantity,
//     decreaseQuantity,
// } from '../../../store/slices/cartSlice'
// import WhiteButton from './WhiteButton'
// import YellowButton from '../buttonTypes/YellowButton'
// import { BUTTON_TYPE_MAP } from '../../../constants/landingPageConstants'

const AddItemBtn = (props: any) => {
  const { product, varientId, varientPrice, stepperQuantity, buttonType } = props;

  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const cartItem = cartItems.find((item: any) => item.id === product.id);
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const sendDataToApi = useSendDataToApi();
  const getDataFromApi = useGetDataFromApi();
  const itemQuantity = cartItem?.multiple_uoms.find((item: any) =>
    item.variant_id === varientId ? item?.cart_quantity : null
  );

  const handleClearCartFromBackend = () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['clearCartItems'];
    const addressFromLs = getAddressAndStoreId();
    let additionalHeaders = {};

    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
    }
    const successHandler = (data: any) => {};
    const failureHandler = (data: any) => {};
    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  };

  const addItemsToApi = () => {
    let apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['addToCart'];
    let cartItemToApi: any;
    let additionalHeaders = {};
    const token = localStorage.getItem('user_token');
    const cartItemFromLs = localStorage.getItem('cart_items');
    const addressFromLs = getAddressAndStoreId();
    if (!token) {
      return;
    }
    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
    }
    const successHandler = (data: any) => {};
    const failureHandler = (data: any) => {};
    if (loginDetails.isSidebarOpen && cartItemFromLs) {
      let cartItemsParsed = JSON.parse(cartItemFromLs);
      let cartItemsToApi = {
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
        sendDataToApi(apiUrl, cartItemsToApi, 'POST', successHandler, failureHandler, additionalHeaders);
      }
    }
  };
  const handleAddItem = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedVariants = product.multiple_uoms.map((variant: any) => {
      if (variant.variant_id === varientId) {
        return { ...variant, cart_quantity: 1 };
      }
      return variant;
    });

    const productToStore = {
      ...product,
      multiple_uoms: updatedVariants
    };

    dispatch(addItemToCart(productToStore));
    if (loginDetails.user) {
      addItemsToApi();
    }
  };

  const handleIncrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    let productDetail = {
      varientId,
      stepperQuantity
    };
    dispatch(increaseQuantity(productDetail));
    if (loginDetails.user) {
      addItemsToApi();
    }
  };

  const handleDecrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    let productDetail = {
      varientId,
      stepperQuantity
    };

    dispatch(decreaseQuantity(productDetail));
    if (loginDetails.user) {
      addItemsToApi();
    }
  };
  const BUTTON_MAP: any = {
    yellow: (
      <YellowBtn
        isItemPresent={cartItem}
        quantity={itemQuantity?.cart_quantity}
        handleAddItem={handleAddItem}
        handleIncrease={handleIncrease}
        handleDecrease={handleDecrease}
      />
    ),
    white: (
      <WhiteBtn
        isItemPresent={cartItem}
        quantity={itemQuantity?.cart_quantity}
        handleAddItem={handleAddItem}
        handleIncrease={handleIncrease}
        handleDecrease={handleDecrease}
      />
    ),
    black: (
      <BlackBtn
        isItemPresent={cartItem}
        quantity={itemQuantity?.cart_quantity}
        handleAddItem={handleAddItem}
        handleIncrease={handleIncrease}
        handleDecrease={handleDecrease}
      />
    )
  };

  //   return <div>{BUTTON_MAP[buttonType]}</div>;
  return <div>{BUTTON_MAP[buttonType]}</div>;
};

export default AddItemBtn;
