import React from "react";
import { Typography } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";

type WeightProps = {
  weight: {
    value: number;
    units: string;
  };
  variant?: Variant;
  className?: string;
};

const Weight = ({ weight, className, variant }: WeightProps) => {
  return (
    <Typography variant={variant} className={className}>
      {weight.value}
      {weight.units}
    </Typography>
  );
};

export default Weight;
