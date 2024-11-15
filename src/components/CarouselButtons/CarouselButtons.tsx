import React from "react";
import { Box } from "@mui/material";
import {
  OriginCircleLeftArrow,
  OriginCircleRightArrow,
} from "../../Icons/OriginIcons";
import OriginButton from "../OriginButton";
import CA from "classnames";

type CarouselButtonsProps = {
  leftButtonClass?: string;
  rightButtonClass?: string;
  width?: number;
  height?: number;
  gap?: number;
  classes?: {
    root?: string;
    button?: string;
  };
};

const CarouselButtons: React.FC<CarouselButtonsProps> = ({
  leftButtonClass,
  rightButtonClass,
  width = 53,
  height = 53,
  gap = 3,
  classes = {},
}) => {
  return (
    <Box className={CA("carouselButtons flex", `gap-${gap}`, classes.root)}>
      <OriginButton
        variant="iconOnly"
        classes={{
          iconButton: CA(rightButtonClass, classes.button, "group"),
        }}
      >
        <OriginCircleLeftArrow
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="group-hover:scale-105 hover:bg-primary-100 rounded-full transition-transform"
        />
      </OriginButton>
      <OriginButton
        variant="iconOnly"
        classes={{
          iconButton: CA(leftButtonClass, classes.button, "group"),
        }}
      >
        <OriginCircleRightArrow
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="group-hover:scale-105 hover:bg-primary-100 rounded-full transition-transform"
        />
      </OriginButton>
    </Box>
  );
};

export default CarouselButtons;
