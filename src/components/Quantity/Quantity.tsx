import React, { useState } from "react";
import { Box, InputBase } from "@mui/material";
import { OriginMinus, OriginPlus } from "../../Icons/OriginIcons";
import OriginButton from "../OriginButton";

const QuantityChanger = ({ quantity: availableQty }: { quantity: number }) => {
  const [optionQuantity, setOptionQuantity] = useState(1);

  const handleOptionQuantityChange = (change: number) => {
    const newOptionQuantity = optionQuantity + change;
    if (
      newOptionQuantity >= 0 &&
      newOptionQuantity <= Math.min(availableQty, 999)
    ) {
      setOptionQuantity(newOptionQuantity);
    }
    // TODO: Change the qty to add to cart + button and remove item from cart
  };

  const ButtonStyleClasses =
    "border-2 border-primary bg-primary p-1 border-solid rounded-full min-w-[unset] aspect-square";
  return (
    <>
      <Box className="flex items-center border-primary-200 px-1 md:px-3 md:py-1.5 border rounded-[85px] w-max">
        <OriginButton
          variant="iconPrimary"
          buttonText="Remove qty"
          handleClick={() => handleOptionQuantityChange(-1)}
          classes={{
            iconButton: "p-1 aspect-square",
            iconOne: "w-2.5 h-2.5",
            buttonText: "sr-only",
          }}
          IconOne={OriginMinus}
        />
        <InputBase
          id="quantity-input"
          aria-label="quality-input"
          type="number"
          inputProps={{
            shrink: true,
            className: "p-1 min-w-1 w-10 text-center text-sm md:text-base",
            max: 999,
          }}
          value={optionQuantity}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value <= 999) {
              setOptionQuantity(value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              handleOptionQuantityChange(1);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              handleOptionQuantityChange(-1);
            }
          }}
        />
        <OriginButton
          variant="iconPrimary"
          buttonText="Add qty"
          handleClick={() => handleOptionQuantityChange(1)}
          classes={{ iconButton: ButtonStyleClasses, buttonText: "sr-only" }}
          IconOne={OriginPlus}
          IconOneProps={{ className: "w-2.5 h-2.5" }}
        />
      </Box>
    </>
  );
};

export default QuantityChanger;
