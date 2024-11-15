import React, { ComponentType, useState } from "react";
import { IconProps, Menu, MenuItem, SvgIconTypeMap } from "@mui/material";
import { OriginUDArrows } from "../../Icons/OriginIcons";
import classNames from "classnames";
import OriginButton from "../OriginButton";
import { ButtonVariants } from "../OriginButton/OriginButton";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface DropdownProps<T> {
  options: T[];
  label?: string;
  renderOption?: (option: T) => React.ReactNode;
  onSelect: (option: T) => void;
  btnVariant?: ButtonVariants;
  classes?: {
    iconButton?: string;
    buttonText?: string;
    iconOne?: string;
    iconTwo?: string;
    menuList?: string;
    menuPaper?: string;
    menuRoot?: string;
    menuOption?: string;
  };
  IconOne?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  IconTwo?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
}

const Dropdown = <T,>({
  options,
  label = "Select an option",
  renderOption,
  onSelect,
  classes,
  IconOne,
  IconTwo,
  btnVariant = "primary",
}: DropdownProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>(label);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option: T) => {
    onSelect(option);
    setSelectedLabel(option?.toString()); // Set selected option to label
    handleClose();
  };

  return (
    <>
      <OriginButton
        variant={btnVariant}
        aria-controls="simple-menu"
        aria-haspopup="true"
        handleClick={handleClick}
        classes={{
          iconButton: classNames(classes?.iconButton),
          buttonText: classNames(classes?.buttonText, "capitalize"),
          iconOne: classNames(classes?.iconOne, "w-3 h-3"),
        }}
        IconOne={IconOne ? IconOne : OriginUDArrows}
        IconTwo={IconTwo}
        buttonText={selectedLabel}
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableScrollLock={true}
        classes={{
          list: classNames(
            "min-w-[300px] md:p-[16px_!important]",
            classes?.menuList
          ),
          paper: classNames(
            "md:rounded-2xl shadow-sm max-h-[250px] noscrollbar",
            classes?.menuPaper
          ),
          root: classNames(classes?.menuRoot),
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            classes={{
              root: classNames(classes?.menuOption, {
                "text-secondary": option?.toString() === selectedLabel,
              }),
            }}
            key={index}
            onClick={() => handleSelect(option)}
          >
            {renderOption ? renderOption(option) : option?.toString()}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Dropdown;
