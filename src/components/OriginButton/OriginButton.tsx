import React, { ComponentType, CSSProperties, ReactNode } from 'react';
import { ButtonBase, Typography } from '@mui/material';
import CA from 'classnames';

type IconProps = {
  className?: string;
  [key: string]: any;
};

export type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'outlined'
  | 'iconBtn'
  | 'capsuleBtn'
  | 'tertiary'
  | 'disabled'
  | 'iconOnly'
  | 'iconPrimary'
  | 'textOnly';

type OriginButtonProps = {
  buttonText?: ReactNode | string;
  variant?: ButtonVariants;
  IconOne?: ComponentType<IconProps> | null;
  IconTwo?: ComponentType<IconProps> | null;
  IconOneProps?: IconProps;
  IconTwoProps?: IconProps;
  condition?: boolean;
  handleClick?: any;
  className?: string; // ✅ Added
  classes?: {
    iconButton?: string;
    buttonText?: string;
    iconOne?: string;
    iconTwo?: string;
  };
  style?: CSSProperties;
  children?: ReactNode;
};

const buttonTypeClasses: Record<ButtonVariants, string> = {
  primary:
    'flex justify-between items-center gap-2.5 border-2 hover:border-primary border-2 transition ease-in-out duration-200 border-solid border-primary bg-primary px-4 py-2 border-solid rounded-[85px] text-black hover:shadow-origin hover:shadow-black hover:border-black active:shadow-none transition-all active:translate-y-[5px] duration-200 ease-in-out',
  secondary:
    'flex justify-between text-white hover:text-black items-center gap-2.5 border-2 hover:bg-white hover:border-secondary border-2 transition ease-in-out duration-200 border-solid border-secondary bg-secondary px-6 py-2 border-solid rounded-[85px] text-black hover:shadow-origin hover:shadow-black active:shadow-none transition-all active:translate-y-[5px] duration-200 ease-in-out',
  iconBtn:
    'flex justify-between items-center gap-2.5 border-2 border-primary bg-primary px-6 py-2 border-solid rounded-[85px] w-full h-min text-black',
  iconPrimary:
    'flex justify-between items-center border-2 border-primary bg-primary p-1 border-solid rounded-[85px] w-min h-auto text-black',
  iconOnly: 'flex justify-between items-center rounded-[85px] w-auto h-min transition-all duration-200 ease-in-out',
  capsuleBtn:
    'flex items-center hover:text-black flex-row-reverse gap-2 py-2 md:py-3 transition ease-in-out duration-200 first-of-type:rounded-s-[85px] first-of-type:ps-8 ps-5 last-of-type:rounded-e-[85px] last-of-type:pe-8 pe-5 ',
  outlined:
    'flex justify-between items-center gap-2.5 border-2 transition duration-200 ease-in-out border-black bg-white border-solid rounded-[85px] text-black hover:shadow-origin hover:shadow-black active:shadow-none transition-all active:translate-y-[5px] duration-200 ease-in-out',
  tertiary:
    'flex justify-center items-center gap-2.5 bg-black px-8 py-2 md:px-8 md:py-4 text-base text-white transition ease-in-out duration-200 hover:bg-primary border-2 border-solid border-black hover:border-black hover:text-black rounded-[45px] font-medium hover:shadow-origin hover:shadow-black active:shadow-none transition-all active:translate-y-[5px] duration-200 ease-in-out',
  disabled:
    'flex flex-col justify-center items-center bg-oGrey px-4 py-2 rounded-full text-sm text-white cursor-not-allowed',
  textOnly: 'text-base'
};

const OriginButton: React.FC<OriginButtonProps> = ({
  buttonText,
  variant = 'primary',
  condition = true,
  IconOne,
  IconTwo,
  IconOneProps,
  IconTwoProps,
  handleClick,
  className, // ✅ added
  classes = {},
  style,
  children
}) => {
  const buttonClassName = buttonTypeClasses[variant];

  if (children) {
    return (
      <ButtonBase
        className={CA(className, classes.iconButton, buttonClassName)} // ✅ merged className
        onClick={handleClick}
        style={style}
      >
        {children}
      </ButtonBase>
    );
  }

  return (
    <ButtonBase
      className={CA(className, classes.iconButton, buttonClassName)} // ✅ merged className
      onClick={handleClick}
      style={style}
    >
      {condition && IconTwo && <IconTwo className={classes.iconTwo} {...IconTwoProps} />}
      <Typography className={classes.buttonText} variant="body1">
        {buttonText}
      </Typography>
      {condition && IconOne && <IconOne className={classes.iconOne} {...IconOneProps} />}
    </ButtonBase>
  );
};

export default OriginButton;
