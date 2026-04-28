import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCartStore } from '@/hooks/useCartStore';
import YellowBtn from './YellowBtn';
import WhiteBtn from './WhiteBtn';
import BlackBtn from './BlackBtn';
import BlackAddCartBtm from './BlackAddCartBtm';
import YellowAddCartBtm from './YellowAddCartBtm';
import UomModalBtn from './UomModalBtn';
import { protectedUrl } from '@/url';
import { getAddressAndStoreId } from '@/utilities/utils';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import * as gtag from '@/utilities/gtag';
import { trackEvent } from '@/utilities/analytics';
// import { AnalyticsEvents } from '@/utilities/analyticsEvents';
import { trackMixpanelEvent } from '@/utilities/mixpanel';
import { AnalyticsEvents } from '@/utilities/mixpanelEvents';

const AddItemBtn: FC<any> = (props) => {
  const {
    product,
    varientId,
    stepperQuantity: stepperQuantityProp,
    minimumQuantity: minimumQuantityProp,
    buttonType,
    selectedRipenessType = null,
    onMaxQuantityExceeded
  } = props;

  const dispatch = useDispatch();
  const { cart, isMangoPage, actions } = useCartStore();
  const cartItems = cart.items;

  const { addItemToCart, increaseQuantity, decreaseQuantity, removeItemFromCart, setMaxQuantityError } = actions;

  const loginDetails = useSelector((state: any) => state.loginDetails);
  const sendDataToApi = useSendDataToApi();
  const getDataFromApi = useGetDataFromApi();

  const normalizedProductId = product.id || product.product_id;

  const uomArray = product.multiple_uoms || product.uoms || [];
  const selectedVariant = uomArray.find((variant: any) => {
    const variantId = variant.variant_id || variant.varientId;
    return variantId === varientId;
  });

  const finalMinQuantity = minimumQuantityProp || selectedVariant?.minimum_quantity || 1;
  const finalStepQuantity = stepperQuantityProp || selectedVariant?.stepper_quantity || 1;
  const maxQuantity = selectedVariant?.maximum_quantity || Infinity;

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
    getDataFromApi(
      apiUrl,
      () => { },
      () => { },
      additionalHeaders
    );
  };

  const addItemsToApi = () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['addToCart'];
    const token = localStorage.getItem('user_token');
    // Use the correct LS key based on the page
    const lsKey = isMangoPage ? 'mango_cart_items' : 'cart_items';
    const cartItemFromLs = localStorage.getItem(lsKey);
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
        sendDataToApi(
          apiUrl,
          cartItemsToApi,
          'POST',
          () => { },
          () => { },
          additionalHeaders
        );
      }
    }
  };

  const handleAddItem = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant) return;

    const quantityToAdd = finalMinQuantity;
    const totalQuantityInCart = getVariantTotalQuantity();

    if (totalQuantityInCart >= maxQuantity) {
      dispatch(setMaxQuantityError(`Maximum quantity of ${maxQuantity} reached for this item.`));
      onMaxQuantityExceeded && onMaxQuantityExceeded(maxQuantity);
      return;
    }

    const newTotalQuantity = totalQuantityInCart + quantityToAdd;
    if (newTotalQuantity > maxQuantity) {
      dispatch(setMaxQuantityError(`Maximum quantity of ${maxQuantity} reached for this item.`));
      onMaxQuantityExceeded && onMaxQuantityExceeded(maxQuantity);
      return;
    }

    const normalizedProduct = {
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
      multiple_uoms: uomArray
    };

    dispatch(
      addItemToCart({
        product: normalizedProduct,
        selectedUOM: {
          ...selectedVariant,
          stepper_quantity: quantityToAdd
        },
        selectedRipenessType
      })
    );

    if (loginDetails.user) {
      addItemsToApi();
    }

    gtag.event({
      action: 'add_to_cart',
      category: 'Ecommerce',
      items: [
        {
          item_id: normalizedProductId,
          item_name: product.name || product.item_name,
          price: selectedVariant?.price,
          quantity: quantityToAdd,
          item_variant: selectedVariant?.variant_name
        }
      ]
    });

    // trackEvent(AnalyticsEvents.ADD_TO_CART, {
    //   item_code: product.item_code,
    //   item_name: product.name || product.item_name,
    //   prid: normalizedProductId,
    //   category: product.category || '',
    //   uom: selectedVariant?.unit || '',
    //   image: product.image || '',
    //   prqt: quantityToAdd,
    //   selling_price: selectedVariant?.market_price || selectedVariant?.price || 0,
    //   final_price: selectedVariant?.price || 0,
    //   product_price: selectedVariant?.price || 0,
    //   from_cart: false
    trackMixpanelEvent(AnalyticsEvents.ADD_TO_CART, {
      product_price: selectedVariant?.price || 0
    });
  };

  const handleIncrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const totalQuantityInCart = getVariantTotalQuantity();
    if (totalQuantityInCart >= maxQuantity) {
      dispatch(setMaxQuantityError(`Maximum quantity of ${maxQuantity} reached for this item.`));
      onMaxQuantityExceeded && onMaxQuantityExceeded(maxQuantity);
      return;
    }

    const newTotalQuantity = totalQuantityInCart + finalStepQuantity;
    if (newTotalQuantity > maxQuantity) {
      dispatch(setMaxQuantityError(`Maximum quantity of ${maxQuantity} reached for this item.`));
      onMaxQuantityExceeded && onMaxQuantityExceeded(maxQuantity);
      return;
    }

    dispatch(increaseQuantity({ varientId, stepperQuantity: finalStepQuantity, selectedRipenessType }));

    if (loginDetails.user) {
      addItemsToApi();
    }

    gtag.event({
      action: 'add_to_cart',
      category: 'Ecommerce',
      items: [
        {
          item_id: normalizedProductId,
          item_name: product.name || product.item_name,
          price: selectedVariant?.price,
          quantity: finalStepQuantity,
          item_variant: selectedVariant?.variant_name
        }
      ]
    });

    // trackEvent(AnalyticsEvents.ADD_TO_CART, {
    //   item_code: product.item_code,
    //   item_name: product.name || product.item_name,
    //   prid: normalizedProductId,
    //   category: product.category || '',
    //   uom: selectedVariant?.unit || '',
    //   image: product.image || '',
    //   prqt: finalStepQuantity,
    //   selling_price: selectedVariant?.market_price || selectedVariant?.price || 0,
    //   final_price: selectedVariant?.price || 0,
    //   product_price: selectedVariant?.price || 0,
    //   from_cart: false
    trackMixpanelEvent(AnalyticsEvents.ADD_TO_CART, {
      product_price: selectedVariant?.price || 0
    });
  };

  const handleDecrease = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const itemToRemove = { varientId, selectedRipenessType };
    if (itemQuantity <= finalMinQuantity) {
      dispatch(removeItemFromCart(itemToRemove));
      trackMixpanelEvent(AnalyticsEvents.REMOVE_FROM_CART);
    } else {
      dispatch(decreaseQuantity({ varientId, stepperQuantity: finalStepQuantity, selectedRipenessType }));
    }

    if (loginDetails.user) {
      addItemsToApi();
    }

    if (itemQuantity <= finalMinQuantity) {
      trackEvent(AnalyticsEvents.DELETE_FROM_CART, {
        item_code: product.item_code,
        item_name: product.name || product.item_name,
        prid: normalizedProductId,
        category: product.category || '',
        uom: selectedVariant?.unit || '',
        image: product.image || '',
        prqt: finalStepQuantity,
        selling_price: selectedVariant?.market_price || selectedVariant?.price || 0,
        final_price: selectedVariant?.price || 0,
        product_price: selectedVariant?.price || 0,
        from_cart: false
      });
    } else {
      trackEvent(AnalyticsEvents.REMOVE_FROM_CART, {
        item_code: product.item_code,
        item_name: product.name || product.item_name,
        prid: normalizedProductId,
        category: product.category || '',
        uom: selectedVariant?.unit || '',
        image: product.image || '',
        prqt: finalStepQuantity,
        selling_price: selectedVariant?.market_price || selectedVariant?.price || 0,
        final_price: selectedVariant?.price || 0,
        product_price: selectedVariant?.price || 0,
        from_cart: false
      });
    }
  };

  const handleRemoveUOM = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const itemToRemove = { varientId, selectedRipenessType };
    dispatch(removeItemFromCart(itemToRemove));
    trackMixpanelEvent(AnalyticsEvents.REMOVE_FROM_CART);

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
        product={product}
        varientId={varientId}
        isMangoPage={isMangoPage}
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
        isMangoPage={isMangoPage}
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
    ),
    uom_modal: (
      <UomModalBtn
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

  return <div className="relative z-5">{BUTTON_MAP[buttonType]}</div>;
};

export default AddItemBtn;
