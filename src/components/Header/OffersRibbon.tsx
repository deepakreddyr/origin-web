import React, { useEffect, useRef, useState } from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { Badge, Box, Menu, MenuItem, Container } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import { Marquee } from "@devnomic/marquee";
import OriginButton from "../OriginButton";
import { Download } from "@mui/icons-material";
import Dropdown from "../OriginDropDown";
import {
  OriginCartIcon,
  OriginChevronDown,
  OriginMenuIcon,
} from "@/Icons/OriginIcons";
const OffersRibbon = () => {
  const [topBarTransition, setTopBarTransition] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setTopBarTransition(position > 40 && !isMobile);
      if (position > 40) {
        setOpenSubmenu(null);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isMobile &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenSubmenu(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile]);

  return (
    <Box
      className={classNames(
        "transition-all ease-in-out duration-200",
        topBarTransition
          ? "bg-transparent opacity-0 -translate-y-5"
          : "bg-secondary-300 opacity-1 translate-y-0"
      )}
    >
      <Container
        className={classNames(
          "relative topBar z-[1399] flex justify-between items-center px-5 py-2 h-[40px]"
        )}
      >
        <Typography
          variant="body1"
          className="w-[45%] md:w-auto font-light text-white text-xs"
        >
          {isMobile ? (
            <Marquee
              className="gap-[3rem] [--duration:5s] text-nowrap"
              innerClassName="gap-[3rem] [--gap:3rem]"
            >
              Download the App and Get FLAT 20% Off on 1st Order
            </Marquee>
          ) : (
            <span>Download the App and Get FLAT 20% Off on 1st Order </span>
          )}
        </Typography>
        <OriginButton
          variant={"textOnly"}
          classes={{
            iconButton:
              "px-2 rounded-full whitespace-nowrap gap-2.5 py-1 border-0 bg-black-op-30 ms-3 xs:ms-auto",
            buttonText: "text-white text-xs hidden md:block",
            iconOne: "block md:hidden w-3.5 h-auto text-white",
          }}
          IconOne={Download}
          buttonText={"Download Origin"}
        />
        <Box className="flex ms-3">
          <Dropdown
            btnVariant="textOnly"
            onSelect={() => {}}
            label="Select location"
            options={[
              "Koramangala, 560068",
              "Bangalore, 560068",
              "Hyderabad, 560068",
            ]}
            classes={{
              iconButton: "px-2.5 py-1 bg-black-op-30 gap-2 rounded-[26px]",
              buttonText: "text-xs text-nowrap text-white",
              iconOne: "w-[12px] h-[6px] fill-[#fff_!important]",
              menuPaper: "p-0 md:p-0",
              menuList: "px-2 py-2 md:px-2 md:py-2",
              menuOption:
                "first-of-type:rounded-t-lg last-of-type:rounded-b-lg",
            }}
            IconOne={OriginChevronDown}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default OffersRibbon;
