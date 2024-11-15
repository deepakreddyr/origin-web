import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Box,
  Menu,
  MenuItem,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import {
  OriginCartIcon,
  OriginChevronDown,
  OriginMenuIcon,
} from "@/Icons/OriginIcons";
import classNames from "classnames";
import { MobileDrawer, Submenu, Logo, MenuItems, SearchBar } from ".";
import OriginButton from "../OriginButton";
import { MainMenuType } from "@/utilities/types";
import { Marquee } from "@devnomic/marquee";
import { TabTypeConstant } from "../Login/constants/tabTypeContent";
import { login } from "../Login/context/atom";
import type { LoginAtom } from "../Login/types/LoginAtom";
import userIcon from "/public/assets/images/userIcon.png";
// import "@devnomic/marquee/dist/index.css"; // if you copy ala shadcn, no need import css.
import Dropdown from "../OriginDropDown/OriginDropDown";
import { Download } from "@mui/icons-material";
import { useAtom } from "jotai";
import OffersRibbon from "./OffersRibbon";
import useDeviceType from "@/hooks/useDeviceType";
import Image from "next/image";
import {
  activeAccountsPageAtom,
  isAccountIsOpen,
  profileAtom,
} from "@/features/AccountPage/context/atoms";
import ActiveSidebar from "@/features/AccountPage/enums/ActiveSidebar";

type Props = {
  mainMenuItems: MainMenuType[];
};

const Header = ({ mainMenuItems }: Props) => {
  const [loginDetails, setLoginDetails] = useAtom(login);
  const [profile, setProfileAtom] = useAtom(profileAtom);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [topBarTransition, setTopBarTransition] = useState(false);
  const deviceType = useDeviceType();
  const isMenuOpen = Boolean(anchorEl);
  const [, setActiveAccountsPageAtom] = useAtom(activeAccountsPageAtom);
  const [, setIsAccountOpen] = useAtom(isAccountIsOpen);

  const menuRef = useRef<HTMLDivElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    // setAnchorEl(event.currentTarget);
    setLoginDetails((prevDetails: LoginAtom) => ({
      ...prevDetails,
      isLoginSidebarOpen: !prevDetails.isLoginSidebarOpen,
      tabType: TabTypeConstant.ENTER_MOBILE_NUMBER,
    }));
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenSubmenu(null);
  };

  const handleSubmenuToggle = (label: string) => {
    setOpenSubmenu((prev) => (prev === label ? null : label));
  };

  const handleMobileMenuOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

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

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id="primary-search-account-menu"
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      disableScrollLock={true}
      classes={{
        paper:
          "bg-white shadow-sm border-oGrey-100 border rounded-3xl px-0 py-2 flex flex-col",
      }}
      onClose={handleMenuClose}
    >
      <MenuItem className="p-0">
        <Link className="px-8 py-2" href="/profile">
          Profile
        </Link>
      </MenuItem>
      <MenuItem className="p-0">
        <Link className="px-8 py-2" href="/account">
          My account
        </Link>
      </MenuItem>
    </Menu>
  );

  const openAccount = () => {
    setIsAccountOpen(true);
    setActiveAccountsPageAtom(ActiveSidebar.ACCOUNT_MAIN);
  };

  return (
    <Box
      ref={menuRef}
      className={classNames("top-0 z-50 fixed w-full transform ")}
    >
      <OffersRibbon />
      <Container
        className={classNames(
          "top-0 z-0 sticky transform transition ease-in-out duration-200"
        )}
      >
        <AppBar
          className={classNames(
            "bg-white border rounded-none lg:rounded-[110px]",
            openSubmenu
              ? "shadow-none border-oGrey-100 lg:rounded-3xl"
              : "shadow-sm border-oGrey-100 lg:rounded-[110px]"
          )}
          sx={{ paddingInlineEnd: "0 !important" }}
        >
          <Toolbar
            className={classNames(
              "flex justify-between items-center px-5 py-3 md:px-8 md:py-4 flex-wrap gap-y-4 lg:flex-nowrap lg:gap-y-0"
            )}
          >
            <IconButton
              className="flex lg:hidden p-0"
              onClick={handleMobileMenuOpen}
            >
              <OriginMenuIcon className="w-[21px] h-[18px]" />
            </IconButton>
            <Link href="/" className="flex items-start me-auto md:me-[unset]">
              <Logo />
            </Link>
            <div className="flex flex-grow justify-start items-center order-3 md:order-[unset] mx-0 md:ms-[30px] md:me-4 md:basis-auto basis-full">
              <SearchBar />
            </div>
            <div className="flex items-center">
              {!isMobile && (
                <MenuItems
                  items={mainMenuItems}
                  handleSubmenuToggle={handleSubmenuToggle}
                  openSubmenu={openSubmenu}
                />
              )}
              <Box
                className={classNames(
                  "flex items-center flex-row-reverse gap-2 lg:flex-row lg:gap-0"
                )}
              >
                {loginDetails.user && profile?.data?.profile ? (
                  <IconButton onClick={openAccount}>
                    <div className="md:w-[1.389vw]  md:h-[1.389vw] sm:w-[3.6vw] sm:h-[3.6vw] xs:w-[5.1vw] xs:h-[5.1vw]  relative">
                      <Image src={userIcon} alt="account icon" />
                    </div>
                  </IconButton>
                ) : (
                  <OriginButton
                    variant="outlined"
                    handleClick={handleProfileMenuOpen}
                    classes={{ iconButton: "md:px-3 px-5 py-1" }}
                  >
                    <Typography variant="body1">Login</Typography>
                  </OriginButton>
                )}
                <Box
                  className="lg:block px-1 md:px-4 text-black text-opacity-40"
                  component="span"
                >
                  {"|"}
                </Box>
                <OriginButton
                  variant="iconOnly"
                  aria-label="show 4 new items in cart"
                  classes={{ iconButton: "p-2 text-white" }}
                >
                  <Box className="sr-only">Cart</Box>
                  <Badge
                    badgeContent={4}
                    classes={{ badge: "bg-secondary-300" }}
                    sx={{
                      ".MuiBadge-badge": {
                        fontFamily: "SofiaPro, sans-serif",
                        lineHeight: "21px",
                      },
                    }}
                  >
                    <Box component="span" className="sr-only">
                      {4} items in cart
                    </Box>
                    <OriginCartIcon className="w-5 h-[17px]" />
                  </Badge>
                </OriginButton>
              </Box>
            </div>
          </Toolbar>
        </AppBar>

        <MobileDrawer
          drawerOpen={drawerOpen}
          handleMobileMenuOpen={handleMobileMenuOpen}
          mainMenuItems={mainMenuItems}
          openSubmenu={openSubmenu}
          handleSubmenuToggle={handleSubmenuToggle}
          isMobile={isMobile}
          topBarTransition={topBarTransition}
        />
      </Container>
      {/* {renderMenu} */}
      {!isMobile &&
        mainMenuItems.map(
          (item) =>
            item.submenu && (
              <Submenu
                key={item.label}
                submenu={item.submenu}
                isOpen={openSubmenu === item.label}
                isMobile={isMobile}
                transitionBool={topBarTransition}
              />
            )
        )}
    </Box>
  );
};

export default Header;
