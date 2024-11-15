import React from "react";
import { Typography } from "@mui/material";
import classNames from "classnames";

type PriceProps = {
  price: {
    currency?: string;
    mrp?: string;
    amount: string;
  };
  classes?: {
    root?: string;
    firstPrice?: string;
    secondPrice?: string;
  };
};

const Price = ({ price, classes }: PriceProps) => {
  return (
    <Typography
      variant="body1"
      className={classNames("flex gap-2 text-lg", classes?.root)}
    >
      <span className="sr-only">
        {price.currency + " " + price.mrp + " " + price.amount}
      </span>
      {price.mrp && (
        <span className={classNames("text-oGrey", classes?.firstPrice)}>
          <s>{price.mrp}</s>
        </span>
      )}
      <span className={classNames("text-secondary", classes?.secondPrice)}>
        {price.amount}
      </span>
    </Typography>
  );
};

export default Price;
