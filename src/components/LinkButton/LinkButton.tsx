import { Link, Box } from "@mui/material";
import React from "react";

type LinkButtonProps = {
  icon?: any;
  text: string;
  href: string;
};

const LinkButton = ({ icon, text, href }: LinkButtonProps) => {
  const renderIcon = (Icon: any) => {
    return (
      <Icon className="group-hover:fill-black transition-transform group-hover:translate-x-1 duration-200 group-hover:delay-75 ease-in-out" />
    );
  };
  return (
    <Link
      href={href}
      variant="body1"
      className="flex justify-between items-center gap-4 border-2 bg-black hover:bg-white hover:shadow-origin hover:shadow-black active:shadow-none py-4 border-black rounded-[22px] text-white hover:text-black no-underline leading-7 transition-all active:translate-y-[5px] duration-200 ease-in-out group group pe-4 ps-6"
    >
      <span>{text}</span>
      {icon && (
        <Box className="group-hover:bg-white place-content-center border-2 border-white grid bg-black p-2 group-hover:border-black rounded-full w-10 h-10 group-hover:translate-x-1 duration-200 ease-in-out">
          {renderIcon(icon)}
        </Box>
      )}
    </Link>
  );
};

export default LinkButton;
