import { addItemToCart, decreaseQuantity, increaseQuantity, removeItemFromCart } from '@/store/slice/CartSlice';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import YellowBtn from './YellowBtn';
import WhiteBtn from './WhiteBtn';
import BlackBtn from './BlackBtn';
import BlackAddCartBtm from './BlackAddCartBtm';
import YellowAddCartBtm from './YellowAddCartBtm';
import { protectedUrl } from '@/url';
import { getAddressAndStoreId } from '@/utilities/utils';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';

const AddItemBtn: FC<any> = (props) => {
  const { product, varientId, stepperQuantity, buttonType, selectedRipenessType = null, onMaxQuantityExceeded } = props;

  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const sendDataToApi = useSendDataToApi();
  const getDataFromApi = useGetDataFromApi();

  const normalizedProductId = product.id || product.product_id;
  
  const uomArray = product.multiple_uoms || product.uoms || [];
  const selectedVariant = uomArray.find(
    (variant: any) => {
      const variantId = variant.variant_id || variant.varientId;
      return variantId === varientId;
    }
  );
  
  const maxQuantity = selectedVariant?.maximum_quantity || Infinity;

  // Find cart item and specific quantity
  let itemQuantity = 0;
  const cartProduct = cartItems.find((item: any) => {
    const itemProductId = item.id || item.product_id;
    return itemProductId === normalizedProductId;
  });
  
  let cartUOM: any;

  if (cartProduct) {
    cartUOM = cartProduct.multiple_uoms?.find((uom: any) => uom.variant_id === varientId);
    
    if (cartUOM) {
      if (selectedRipenessType && cartUOM.cart_ripeness) {
        const ripenessObj = cartUOM.cart_ripeness.find((r: any) => r.ripeness_type === selectedRipenessType);
        itemQuantity = ripenessObj ? Number(ripenessObj.qty) : 0;
      } else {
        itemQuantity = cartUOM.cart_quantity || 0;
      }
    }
  }

  // ===== FIX: Calculate total for this specific variant (all ripeness types) =====
  const getVariantTotalQuantity = () => {
    if (!cartUOM) return 0; 

    if (cartUOM.cart_ripeness && Array.isArray(cartUOM.cart_ripeness)) {
      return cartUOM.cart_ripeness.reduce((sum: number, r: any) => sum + Number(r.qty), 0);
    } else {
      return cartUOM.cart_quantity || 0;
    }
  };

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

    // Check if already at max before adding
    const totalQuantityInCart = getVariantTotalQuantity();
    
    // If already at max, show toast and prevent action
    if (totalQuantityInCart >= maxQuantity) {
      onMaxQuantityExceeded && onMaxQuantityExceeded(maxQuantity);
      return;
    }

    // Check max quantity for THIS variant (across all ripeness types)
    const newTotalQuantity = totalQuantityInCart + stepperQuantity;

    if (newTotalQuantity > maxQuantity) {
      onMaxQuantityExceeded && onMaxQuantityExceeded(maxQuantity);
      return;
    }

    const normalizedProduct = {
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
      multiple_uoms: uomArray
    };

    dispatch(addItemToCart({
      product: normalizedProduct,
      selectedUOM: {
        ...selectedVariant,
        stepper_quantity: stepperQuantity
      },
      selectedRipenessType
    }));

    if (loginDetails.user) {
      addItemsToApi();
    }
  };

  const handleIncrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if already at max before increasing
    const totalQuantityInCart = getVariantTotalQuantity();
    
    // If already at max, show toast and prevent action
    if (totalQuantityInCart >= maxQuantity) {
      onMaxQuantityExceeded && onMaxQuantityExceeded(maxQuantity);
      return;
    }
    
    // Check max quantity for THIS variant (across all ripeness types)
    const newTotalQuantity = totalQuantityInCart + stepperQuantity;

    if (newTotalQuantity > maxQuantity) {
      onMaxQuantityExceeded && onMaxQuantityExceeded(maxQuantity);
      return;
    }
    
    dispatch(increaseQuantity({ varientId, stepperQuantity, selectedRipenessType }));
    
    if (loginDetails.user) {
      addItemsToApi();
    }
  };

  const handleDecrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    const itemToRemove = { varientId, selectedRipenessType };

    if (itemQuantity <= stepperQuantity) {
      dispatch(removeItemFromCart(itemToRemove)); 
    } else {
      dispatch(decreaseQuantity({ varientId, stepperQuantity, selectedRipenessType }));
    }
    
    if (loginDetails.user) {
      addItemsToApi();
    }
  };

  const handleRemoveUOM = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    const itemToRemove = { varientId, selectedRipenessType };
    dispatch(removeItemFromCart(itemToRemove)); 
    
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
        product={product}
        selectedRipenessType={selectedRipenessType}
        variantId={varientId}
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
    black: (
      <BlackBtn
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

  return (
    <div className="relative z-5"> 
        {BUTTON_MAP[buttonType]}
    </div>
  );
};

export default AddItemBtn;