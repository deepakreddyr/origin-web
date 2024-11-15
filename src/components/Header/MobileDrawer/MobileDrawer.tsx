import React from "react";
import { Drawer, Container, Typography } from "@mui/material";
import classNames from "classnames";
import OriginButton from "../../OriginButton";
import { OriginCloseIcon, OriginChevronDown } from "../../../Icons/OriginIcons";
import { Submenu } from "..";
import { useRouter } from "next/router";

interface MobileDrawerProps {
  drawerOpen: boolean;
  handleMobileMenuOpen: () => void;
  mainMenuItems: any[];
  openSubmenu: string | null;
  handleSubmenuToggle: (label: string) => void;
  isMobile: boolean;
  topBarTransition: boolean;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  drawerOpen,
  handleMobileMenuOpen,
  mainMenuItems,
  openSubmenu,
  handleSubmenuToggle,
  isMobile,
  topBarTransition,
}) => {
  const router = useRouter();
  return (
    <Drawer
      anchor="top"
      open={drawerOpen}
      onClose={handleMobileMenuOpen}
      className="py-8"
      classes={{
        paper:
          "rounded-b-3xl shadow-sm border border-primary-200 z-[1300] mt-[40px]",
      }}
      sx={{ ".MuiModal-backdrop": { marginTop: "40px" } }}
    >
      <Container className="relative pt-[70px] pb-10 divide-y divide-y-reverse divide-solid divide-oGrey-100">
        <OriginButton
          variant="iconOnly"
          handleClick={handleMobileMenuOpen}
          classes={{
            iconButton: "absolute left-3 top-3 p-2 hover:shadow-none",
          }}
        >
          <OriginCloseIcon className="w-4 h-4" />
        </OriginButton>
        {mainMenuItems.map((item) => (
          <Typography
            key={item.label}
            variant="body1"
            className={classNames("mr-4 group pt-5 first-of-type:pt-0 pb-5")}
          >
            <OriginButton
              variant="textOnly"
              handleClick={() => {
                if (item.submenu) {
                  handleSubmenuToggle(item.label);
                } else {
                  router.push(item.link);
                }
              }}
              classes={{
                iconButton: "w-full flex justify-between items-center gap-2",
              }}
            >
              <Typography
                variant="body1"
                component="span"
                className="text-[22px] text-black"
              >
                {item.label}
              </Typography>
              {item.submenu && (
                <OriginChevronDown
                  className={classNames(
                    "w-3 h-2 transition duration-200 ease-in-out",
                    openSubmenu === item.label ? "rotate-180" : "rotate-0"
                  )}
                />
              )}
            </OriginButton>
            {item.submenu && (
              <Submenu
                submenu={item.submenu}
                isOpen={openSubmenu === item.label}
                isMobile={isMobile}
                transitionBool={topBarTransition}
              />
            )}
          </Typography>
        ))}
      </Container>
    </Drawer>
  );
};

export default MobileDrawer;
