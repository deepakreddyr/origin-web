import React from "react";
import { CircularProgress } from "@mui/material";

interface Props {
  name: string;
  handler: any;
  style: string;
  isDisabled: boolean;
  isLoading?: boolean;
}

const PrimaryRoundedCta = (props: Props) => {
  const { name, handler, style, isDisabled, isLoading } = props;
  return (
    <button
      onClick={handler}
      disabled={isDisabled || isLoading}
      className={`${style} w-full h-[48px] font-[SofiaPro] font-semibold rounded-full transition-all ease-in-out duration-200 flex items-center justify-center ${isDisabled || isLoading ? "text-secondary-400 bg-primary opacity-50 cursor-not-allowed" : "text-[#231F20] bg-primary"}`}
    >
      {isLoading ? <CircularProgress size={24} sx={{ color: '#231F20' }} /> : name}
    </button>
  );
};

export default PrimaryRoundedCta;
