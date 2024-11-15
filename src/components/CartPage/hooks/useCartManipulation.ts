import { useAtom } from "jotai";
import React from "react";
import { cartItems } from "../context/atoms";

interface Props {
  productId: string | number;
}

const useCartManipulation = ({ productId }: Props) => {
  const [cartItemDetails, setCartItemDetails] = useAtom(cartItems);

  const cartItem = React.useMemo(() => {
    const cartItemTemp = cartItemDetails.find(
      (item: any) => item.id === productId
    );
    if (cartItemTemp) return cartItemTemp;
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItemDetails]);

  const getTotalQty = (): number => {
    let totalValue = 0;
    if (!cartItem) return 0;
    cartItem?.uom.forEach((uom: any) => {
      totalValue += uom.qty;
    });

    return totalValue;
  };

  const generateUomPayload = (uomPayload: any) => {
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
  return { addItemToCart, generateUomPayload, cartItem, getTotalQty };
};

export default useCartManipulation;
