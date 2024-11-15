import React from "react";
import style from "./beforeBox.module.scss";
import { Box } from "@mui/material";
import CA from "classnames";
type BeforeBoxProps = {
  children: React.ReactNode;
  mdTopOffset?: number;
  mdBottomOffset?: number;
  className?: string;
};

const BeforeBox: React.FC<BeforeBoxProps> = ({
  children,
  className,
  mdTopOffset = 100,
  mdBottomOffset = 100,
}) => {
  return (
    <Box
      className={CA(className, style.beforeBox)}
      style={
        {
          "--md-top-offset": `${mdTopOffset}px`,
          "--md-bottom-offset": `${mdBottomOffset}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </Box>
  );
};

export default BeforeBox;
