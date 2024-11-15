import { Box } from "@mui/material";
import React, { useState } from "react";
import OriginButton from "../OriginButton";
import { OriginCheckIcon } from "../../Icons/OriginIcons";
import CA from "classnames";
import style from "./filterButtons.module.scss";

type Props = {
  buttons?: Array<string>;
  condition?: string[];
  classes?: {
    root?: string;
    button?: string;
  };
  disableFirstButton?: boolean;
};

const FilterButtons = ({
  buttons = ["Button one", "Button two"],
  condition,
  classes = {},
  disableFirstButton = false,
}: Props) => {
  // Initialize the first button as active by default unless disabled
  const [activeIndex, setActiveIndex] = useState<number | null>(
    disableFirstButton ? null : 0
  );

  const handleButtonClick = (index: number) => {
    if (index === 0 && disableFirstButton) return; // Prevent activating the first button if disabled
    setActiveIndex(index);
  };

  return (
    <Box
      className={CA(
        "border-2 border-primary-200 rounded-[85px] noscrollbar",
        style.root,
        classes.root
      )}
    >
      <Box className="flex items-center">
        {buttons.map((btn: string, idx: number) => (
          <React.Fragment key={idx}>
            <OriginButton
              variant="capsuleBtn"
              buttonText={btn}
              IconOne={activeIndex === idx ? OriginCheckIcon : null}
              classes={{
                buttonText: "text-sm md:text-base",
                iconButton: CA(
                  activeIndex === idx ? "text-black" : "text-oGrey",
                  "w-full md:w-auto",
                  classes.button
                ),
                iconOne: "w-4 h-2.5",
              }}
              handleClick={() => handleButtonClick(idx)}
            />
            {idx < buttons.length - 1 && (
              <hr className="bg-primary-200 w-px h-10" />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default FilterButtons;
