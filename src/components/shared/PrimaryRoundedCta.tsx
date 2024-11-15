import React from "react";

interface Props {
  name: string;
  handler: any;
  style: string;
  isDisabled: boolean;
}

const PrimaryRoundedCta = (props: Props) => {
  const { name, handler, style, isDisabled } = props;
  return (
    <button
      onClick={handler}
      className={`${style} w-full h-[48px] font-[SofiaPro] font-semibold rounded-full transition-all ease-in-out duration-200 ${isDisabled ? "text-secondary-400 bg-primary opacity-50" : "text-[#231F20] bg-primary"}`}
    >
      {name}
    </button>
  );
};

export default PrimaryRoundedCta;
