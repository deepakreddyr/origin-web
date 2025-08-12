import { addItemToCart, decreaseQuantity, increaseQuantity, removeItemFromCart } from '@/store/slice/CartSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import YellowBtn from './YellowBtn';
import WhiteBtn from './WhiteBtn';
import BlackBtn from './BlackBtn';
import BlackAddCartBtm from './BlackAddCartBtm';
import YellowAddCartBtm from './YellowAddCartBtm'
import { protectedUrl } from '@/url';
import { getAddressAndStoreId, prepareCartItemsToApi } from '@/utilities/utils';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';

const AddItemBtn = (props: any) => {
  const { product, varientId, varientPrice, stepperQuantity, buttonType } = props;

  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const sendDataToApi = useSendDataToApi();
  const getDataFromApi = useGetDataFromApi();

  // Find cart item for the current variant (now simplified with flat structure)
  const cartItem = cartItems.find((item: any) => 
    item.id === product.id && item.variant_id === varientId
  );
  const itemQuantity = cartItem?.cart_quantity || 0;

  // console.log('AddItemBtn render:', {
  //   productId: product.id,
  //   varientId,
  //   itemQuantity,
  //   cartItem: cartItem ? { 
  //     id: cartItem.id, 
  //     variant_id: cartItem.variant_id, 
  //     cart_quantity: cartItem.cart_quantity 
  //   } : null
  // });

  const handleClearCartFromBackend = () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['clearCartItems'];
    const addressFromLs = getAddressAndStoreId();
    let additionalHeaders = {};

    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
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

    // console.log('handleAddItem called for variant:', varientId);

    const selectedVariant = product.multiple_uoms.find(
      (variant: any) => variant.variant_id === varientId
    );

    if (!selectedVariant) {
      console.error('Selected variant not found');
      return;
    }

    // Dispatch with the new flat structure
    dispatch(addItemToCart({
      product: product,
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
    // console.log('handleIncrease called for variant:', varientId);
    dispatch(increaseQuantity({ varientId, stepperQuantity }));
    if (loginDetails.user) {
      addItemsToApi();
    }
  };

  const handleDecrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    // console.log('handleDecrease called for variant:', varientId, 'current quantity:', itemQuantity);
    
    if (itemQuantity <= stepperQuantity) {
      // If this will result in zero or negative quantity, remove the item
      // console.log('Removing item due to decrease to zero');
      dispatch(removeItemFromCart(varientId));
    } else {
      // Otherwise just decrease
      dispatch(decreaseQuantity({ varientId, stepperQuantity }));
    }
    
    if (loginDetails.user) {
      addItemsToApi();
    }
  };

  // Explicit remove handler
  const handleRemoveUOM = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log('handleRemoveUOM called for variant:', varientId);
    dispatch(removeItemFromCart(varientId));
    if (loginDetails.user) {
      addItemsToApi();
    }
  };

  const isVariantPresent = itemQuantity > 0;

  // console.log('isVariantPresent:', isVariantPresent, 'quantity:', itemQuantity);

  const BUTTON_MAP: any = {
    blackaddtocart: (
      <BlackAddCartBtm
        isItemPresent={isVariantPresent}
        quantity={itemQuantity}
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
        handleAddItem={handleAddItem}
        handleIncrease={handleIncrease}
        handleDecrease={handleDecrease}
        handleRemove={handleRemoveUOM}
      />
    ),
    black: (
      <BlackBtn
        isItemPresent={isVariantPresent}
        quantity={itemQuantity}
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