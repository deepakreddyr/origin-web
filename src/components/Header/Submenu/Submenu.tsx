import React from "react";
import { Collapse, Fade, Container, Box, MenuItem, Grid } from "@mui/material";
import classNames from "classnames";
import Link from "next/link";

interface SubmenuProps {
  submenu: Array<{
    link: string;
    label: string;
  }>;
  isOpen: boolean;
  isMobile?: boolean;
  transitionBool?: boolean;
}

const Submenu: React.FC<SubmenuProps> = ({
  submenu,
  isOpen,
  isMobile,
  transitionBool,
}) => (
  <Collapse in={isOpen}>
    <Fade in={isOpen} timeout={200}>
      <Container
        maxWidth="lg"
        className={classNames(
          "flex flex-wrap gap-0 w-full md:gap-8 border transition-all duration-300 ease-in-out border-oGrey-200 bg-white pt-0 md:pt-[134px] rounded-3xl pb-3 md:pb-8 px-0 md:px-8",
          isOpen
            ? "shadow-none md:shadow-sm rounded-none md:rounded-3xl border-0 md:border-t-oGrey-200"
            : "shadow-none border-transparent",
          isMobile
            ? "z-10 relative"
            : "-z-[1] absolute left-1/2 -translate-x-1/2",
          !isMobile && transitionBool
            ? "top-0 md:top-[40px]"
            : "top-0 md:top-[60px]"
        )}
      >
        <Grid container className="md:gap-8 md:gap-y-4">
          {submenu.map((item, index) => (
            <Grid item xs={12} md={2} key={index}>
              <MenuItem className="p-0">
                <Link
                  href={item.link}
                  passHref
                  className="block md:px-1 md:py-1 w-full sm:min-h-[unset]"
                >
                  <span className="text-black">{item.label}</span>
                </Link>
              </MenuItem>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Fade>
  </Collapse>
);

export default Submenu;
