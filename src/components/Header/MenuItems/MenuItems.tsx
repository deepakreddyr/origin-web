import React from "react";
import { Typography, ButtonBase } from "@mui/material";
import { OriginChevronDown } from "../../../Icons/OriginIcons";
import classNames from "classnames";
import Link from "next/link";
import OriginButton from "../../OriginButton";

interface MenuItemsProps {
  items: any[];
  handleSubmenuToggle: (label: string) => void;
  openSubmenu: string | null;
}

const MenuItems: React.FC<MenuItemsProps> = ({
  items,
  handleSubmenuToggle,
  openSubmenu,
}) => (
  <>
    {items.map((item) => {
      if (item.submenu) {
        return (
          <Typography
            key={item.label}
            variant="body1"
            className="lg:block hidden mr-4"
          >
            <OriginButton
              variant="primary"
              handleClick={() => handleSubmenuToggle(item.label)}
              IconOne={OriginChevronDown}
              classes={{
                buttonText: "text-black",
                iconButton: "gap-2 md:px-4 md:py-2",
                iconOne: classNames(
                  "w-3 transition duration-200 ease-in-out",
                  openSubmenu === item.label ? "rotate-180" : "rotate-0"
                ),
              }}
              buttonText={item.label}
            />
          </Typography>
        );
      } else {
        return (
          <Typography
            key={item.label}
            variant="body1"
            className="lg:block hidden mr-4 px-3 py-1"
          >
            <Link href={item.link} passHref>
              <span className="text-black">{item.label}</span>
            </Link>
          </Typography>
        );
      }
    })}
  </>
);

export default MenuItems;
