import { useAtom } from "jotai";
import React from "react";
import { cartItems } from "../context/atoms";

const useCartManipulationWithoutProps = () => {
  const [cartItemDetails, setCartItemDetails] = useAtom(cartItems);

  const getCartItem = (productId: string | number) => {
    const cartItemTemp = cartItemDetails.find(
      (item: any) => item.id === productId
    );
    if (cartItemTemp) return cartItemTemp;
    return null;
  };

  const getTotalQty = (productId: string | number): number => {
    const cartItem = getCartItem(productId);
    let totalValue = 0;
    if (!cartItem) return 0;
    cartItem?.uom.forEach((uom: any) => {
      totalValue += uom.qty;
    });

    return totalValue;
  };

  const generateUomPayload = (productId: string | number, uomPayload: any) => {
    const cartItem = getCartItem(productId);
    if (!cartItem || !cartItem.uom) return [uomPayload];

    const restPayload = cartItem.uom.filter(
      (item: any) => item.id !== uomPayload.id
    );

    // If Qty is 0 then we will remove that uom from the array
    if (uomPayload.qty === 0) {
      return [...restPayload];
    }
    return [...restPayload, uomPayload];
  };

  const addItemToCart = (cartValueToBeSet: any) => {
    const totalQty = cartValueToBeSet.uom.reduce(
      (previousValue: any, currentValue: any) => {
        const totalQtyVal = previousValue + currentValue.qty;
        return totalQtyVal;
      },
      0
    );
    if (totalQty !== 0) {
      const tempItems = cartItemDetails.slice();
      const index = tempItems.findIndex(
        (e) => e.item_code === cartValueToBeSet.item_code
      );
      if (index !== -1) {
        tempItems[index] = cartValueToBeSet;
        setCartItemDetails(tempItems);
        localStorage.setItem("cartItem", JSON.stringify(tempItems));
      } else {
        const newCartItem = [...cartItemDetails, cartValueToBeSet];
        setCartItemDetails(newCartItem);
        localStorage.setItem("cartItem", JSON.stringify(newCartItem));
      }
    } else {
      const newCartItem = cartItemDetails.filter(
        (e) => e.id !== cartValueToBeSet.id
      );
      setCartItemDetails(newCartItem);
      localStorage.setItem("cartItem", JSON.stringify(newCartItem));
    }
  };

  const removeUnavailableItems = () => {
    const updatedCartItems = cartItemDetails.slice();

    cartItemDetails.forEach((product) => {
      let updatedProduct = { ...product };

      updatedProduct.uom = product.uom.filter((uom: any) => {
        return uom.is_available;
      });

      if (updatedProduct.uom.length === 0) {
        const index = updatedCartItems.findIndex(
          (item: any) => item.id === product.id
        );
        if (index !== -1) {
          updatedCartItems.splice(index, 1);
        }
      } else {
        const index = updatedCartItems.findIndex(
          (item: any) => item.id === updatedProduct.id
        );
        if (index !== -1) {
          updatedCartItems[index] = updatedProduct;
        } else {
          updatedCartItems.push(updatedProduct);
        }
      }
    });

    setCartItemDetails(updatedCartItems);
    localStorage.setItem("cartItem", JSON.stringify(updatedCartItems));
  };

  return {
    addItemToCart,
    generateUomPayload,
    getCartItem,
    getTotalQty,
    removeUnavailableItems,
  };
};

export default useCartManipulationWithoutProps;
