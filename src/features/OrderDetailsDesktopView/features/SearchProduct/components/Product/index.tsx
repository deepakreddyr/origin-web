import { Box, Button, Grid, Typography } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";
import React from "react";

import { CounterUOM } from "../../../../../../components/UOMCounter";
import Arrow from "../../../../../Homepage/assets/downArrow.svg";
import { editOrderAtom } from "../../../EditOrder/context/atoms";
import UomModel from "../UomModel";
import styles from "./style.module.css";

interface Props {
  product: any;
}

const Product = (props: Props) => {
  const { product } = props;
  const [isUomModalOpen, setIsUomModalOpen] = React.useState(false);
  const [editOrder, setEditOrder] = useAtom(editOrderAtom);

  const cartItem = React.useMemo(() => {
    const cartItemTemp = editOrder.orderItems.find(
      (item: any) => item.id === product.id
    );
    if (cartItemTemp) return cartItemTemp;
    return {};
  }, [editOrder.orderItems]);

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

  const setOrderedItemDetails = (items: any) => {
    setEditOrder((prevState) => ({
      ...prevState,
      orderItems: items,
    }));
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
      const tempItems = editOrder.orderItems.slice();
      const index = tempItems.findIndex(
        (e: any) => e.item_code === cartValueToBeSet.item_code
      );
      if (index !== -1) {
        tempItems[index] = cartValueToBeSet;
        setOrderedItemDetails(tempItems);
      } else {
        const newCartItem = [...editOrder.orderItems, cartValueToBeSet];
        setOrderedItemDetails(newCartItem);
      }
    } else {
      const newCartItem = editOrder.orderItems.filter(
        (e: any) => e.id !== cartValueToBeSet.id
      );
      setOrderedItemDetails(newCartItem);
    }
  };

  const onOpenUomModal = () => {
    setIsUomModalOpen(true);
  };
  const onCloseUomModal = () => {
    setIsUomModalOpen(false);
  };

  const renderButton = (multiUom: any) => {
    const enableAddButton = !(cartItem?.item_code === product?.item_code);

    if (
      Array.isArray(product.multiple_uoms) &&
      product.multiple_uoms.length === 1 &&
      enableAddButton
    )
      return (
        <Button
          className={styles.btn}
          onClick={() => {
            const cartItemToBeAdded = {
              ...product,
              id: product.id,
              item_code: product.item_code,
              availability: product.availability,
              uom: generateUomPayload({
                ...multiUom,
                id: multiUom.uom_id,
                variant_id: multiUom.variant_id,
                price: parseFloat(multiUom.price),
                qty: multiUom.minimum_quantity,
                availability: multiUom.is_available || true,
                visibility: multiUom.is_visible || true,
              }),
            };
            addItemToCart(cartItemToBeAdded);
          }}
        >
          <Typography className={styles.text}>Add</Typography>
          <Image className={styles.img} src={Arrow} alt="arrow" />
        </Button>
      );

    if (enableAddButton)
      return (
        <Button className={styles.btn} onClick={onOpenUomModal}>
          <Typography className={styles.text}>Add</Typography>
          <Image className={styles.img} src={Arrow} alt="arrow" />
        </Button>
      );

    return (
      <CounterUOM
        value={getTotalQty()}
        unit={multiUom.unit}
        stepCount={multiUom?.stepper_quantity}
        minValue={multiUom.minimum_quantity}
        maxValue={multiUom.maximum_quantity}
        isMultipleUomInAPI={
          Array.isArray(product.multiple_uoms) &&
          product.multiple_uoms.length > 1
        }
        onOpenUomModal={onOpenUomModal}
        onChange={(val: number) => {
          const cartItemToBeAdded = {
            ...product,
            id: product.id,
            item_code: product.item_code,
            availability: product.availability,
            uom: generateUomPayload({
              ...multiUom,
              id: multiUom.uom_id,
              variant_id: multiUom.variant_id,
              price: parseFloat(multiUom.price),
              qty: val,
              availability: multiUom.is_available || true,
              visibility: multiUom.is_visible || true,
            }),
          };
          addItemToCart(cartItemToBeAdded);
        }}
      />
    );
  };

  return (
    <>
      <Grid
        item
        className={styles["product-container"]}
        key={product.id}
        xs={6}
      >
        <Box className={`product-list-item ${styles["product-list-item"]}`}>
          <Box component="figure" className={styles["img-container"]}>
            <img
              className={styles.img}
              src={`https://admin.madrasmandi.in/${product.image}`}
              alt={product.name}
            />
          </Box>
          <Box className={styles["details-container"]}>
            <Typography component="h3" className={styles.name}>
              {product.name}
            </Typography>
            {product.multiple_uoms.map((uom: any, index: number) => {
              if (index === 0)
                return (
                  <Box className={styles["price-details"]} key={uom.uom_id}>
                    <Typography
                      component="span"
                      variant="body2"
                      className={styles.qty}
                      sx={{
                        fontWeight: "normal",
                      }}
                    >
                      {uom.minimum_quantity} {uom.unit}
                    </Typography>
                    <Box className={styles["price-btn-container"]}>
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{
                          fontFamily: "Roboto Mono",
                        }}
                      >
                        {uom.formatted_price}
                      </Typography>
                      {renderButton(product.multiple_uoms[0])}
                    </Box>
                  </Box>
                );
              return <></>;
            })}
          </Box>
        </Box>
      </Grid>
      {isUomModalOpen && (
        <UomModel
          isOpen={isUomModalOpen}
          onClose={onCloseUomModal}
          product={product}
        />
      )}
    </>
  );
};
export default Product;
