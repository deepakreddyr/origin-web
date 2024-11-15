import React, { useState } from "react";
import { Box } from "@mui/material";
import { OriginPlus } from "../../Icons/OriginIcons";
import OriginButton from "../OriginButton";
import QuantityChanger from "../Quantity/Quantity";
import { ButtonVariants } from "../OriginButton/OriginButton";
import classNames from "classnames";

type Props = {
  product: {
    stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
  };
  variant?: ButtonVariants;
  btnClassName?: string;
  classes?: {
    outOfStockClass?: string;
    buttonText?: string;
    iconOne?: string;
    outOfStockBtnTextClass?: string;
  };
};

const AddToCartButton = ({
  product,
  variant,
  btnClassName,
  classes,
}: Props) => {
  const [showQuantity, setShowQuantity] = useState(false);

  const getButtonText = () => {
    return product.stockStatus === "IN_STOCK" ? "Add" : "Out of Stock";
  };
  const buttonText = getButtonText();

  const handleClick = () => {
    setShowQuantity(true);
  };

  if (showQuantity) {
    return <QuantityChanger quantity={10} />;
  }

  if (product.stockStatus !== "IN_STOCK") {
    return (
      <OriginButton
        variant="disabled"
        buttonText={buttonText}
        classes={{
          iconButton: classNames(classes?.outOfStockClass),
          buttonText: classes?.outOfStockBtnTextClass,
          iconOne: classNames(classes?.iconOne),
        }}
      />
    );
  }

  return (
    <OriginButton
      variant={variant}
      classes={{
        iconButton: classNames(btnClassName, "px-2 gap-x-2"),
        iconOne: "w-2.5 h-2.5",
        buttonText: classes?.buttonText,
      }}
      buttonText={buttonText}
      handleClick={handleClick}
      IconOne={OriginPlus}
    />
  );
};

export default AddToCartButton;
