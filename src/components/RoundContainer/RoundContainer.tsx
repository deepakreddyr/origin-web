import { Box } from "@mui/material";
import React from "react";
import CA from "classnames";

type Props = {
  children: React.ReactNode;
  className?: string | undefined;
};

const RoundContainer = ({ children, className = "" }: Props) => {
  return (
    <Box
      className={CA(
        className,
        "border-0 lg:border-primary-200 bg-white py-0 md:py-9 lg:border rounded-none lg:rounded-[48px]"
      )}
    >
      {children}
    </Box>
  );
};

export default RoundContainer;
