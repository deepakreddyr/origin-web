import { Box, IconButton, InputBase } from '@mui/material';
import Image from 'next/image';
import React from 'react';

import Minus from './assets/minus.svg';
import MinusYellow from './assets/minus-yellow.svg';
import Plus from './assets/plus.svg';
import PlusYellow from './assets/plus-yellow.svg';
import CounterStyled, { CounterFullYellowStyled, CounterYellowStyled } from './CounterStyled';
// import { OriginMinus, OriginPlus } from '../../Icons/OriginIcons';
// import OriginButton from '../OriginButton';
interface Props {
  stepCount?: number;
  value: number;
  minValue: number;
  maxValue?: number;
  onChange: Function;
  isMultipleUomInCart?: boolean;
  isMultipleUomInAPI?: boolean;
  onOpenUomModal?: Function;
  unit?: boolean;
  variant?: 'yellow' | 'green' | 'full-yellow' | 'homepage-yellow';
}

export function CounterUOM(props: Props) {
  const {
    minValue,
    maxValue,
    value: valueProp,
    onChange,
    isMultipleUomInCart,
    isMultipleUomInAPI,
    onOpenUomModal,
    unit,
    variant,
    stepCount
  } = props;

  const [value, setValue] = React.useState(valueProp || 0);

  React.useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  const requiredStepCount = stepCount ?? 1;

  const onClickPlus = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMultipleUomInAPI) {
      if (onOpenUomModal) {
        onOpenUomModal();
      }
    } else {
      setValue((prevState) => {
        let newVal = prevState + requiredStepCount;
        if (maxValue && prevState >= maxValue) {
          newVal = maxValue;
          if (unit) {
            // toast.error(
            //   'Please choose a different pack size to add more quantity'
            // );
          } else {
            // toast.error('Max quantity for this item has been added to cart');
          }
          // toast.error(
          //   `max quantity for this item in ${
          //     unit ?? 'Kg'
          //   } has been added in cart`,
          // );
        } else if (prevState === 0 && minValue > 0) {
          newVal = minValue;
        } else if (prevState >= 999) {
          newVal = 999;
          //   toast.error('You can not add more then 999');
        }
        onChange(newVal);
        return newVal;
      });
    }
  };
  const onClickMinus = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // let isClear = false;
    if (isMultipleUomInCart || isMultipleUomInAPI) {
      if (onOpenUomModal) {
        onOpenUomModal();
      }
    } else {
      setValue((prevState) => {
        if (prevState > 0) {
          let newVal = prevState - requiredStepCount;
          if (prevState <= minValue) {
            newVal = 0;
            // isClear = true;
          }
          onChange(newVal);
          return newVal;
        }
        return prevState;
      });
      //   if (isClear) {
      //   }
    }
  };

  const onChangeInput = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMultipleUomInCart) return;
    const val = parseInt(e.target.value, 10);
    if (Number.isNaN(val)) {
      setValue(e.target.value);
      onChange(+e.target.value);
    } else if (maxValue && val > maxValue) {
      setValue(maxValue);
      onChange(maxValue);
      if (unit) {
        // toast.error('Please choose a different pack size to add more quantity');
      } else {
        // toast.error('Max quantity for this item has been added to cart');
      }
    } else if (minValue && val < minValue) {
      //   toast.error('You can not remove less then min amount');
      setValue(minValue);
      onChange(minValue);
    } else if (val >= 999) {
      if (unit) {
        // toast.error('Please choose a different pack size to add more quantity');
      } else {
        // toast.error('Max quantity for this item has been added to cart');
      }
      setValue(999);
      onChange(999);
    } else {
      setValue(val);
      onChange(+val);
    }
  };
  //   const getDisabled = () => {
  //     if (isMultipleUomInAPI) {
  //       return false;
  //     }
  //     if ((maxValue && value >= maxValue) || value >= 999) {
  //       return true;
  //     }
  //     return false;
  //   };

  if (variant === 'yellow') {
    return (
      <CounterYellowStyled className="counter-cart">
        <IconButton className="button minus" onClick={onClickMinus}>
          <Image src={MinusYellow} alt="minus" />
        </IconButton>
        <input
          className="input"
          type="number"
          placeholder="0"
          value={value === 0 ? '' : value}
          onChange={onChangeInput}
        />
        <IconButton className="button plus" onClick={onClickPlus}>
          <Image src={PlusYellow} alt="minus" />
        </IconButton>
      </CounterYellowStyled>
    );
  }

  if (variant === 'full-yellow') {
    return (
      <CounterFullYellowStyled className="counter-cart">
        <IconButton className="button minus" onClick={onClickMinus}>
          <Image src={MinusYellow} alt="minus" />
        </IconButton>
        <input
          className="input"
          type="number"
          placeholder="0"
          value={value === 0 ? '' : value}
          onChange={onChangeInput}
        />
        <IconButton className="button plus" onClick={onClickPlus}>
          <Image src={PlusYellow} alt="minus" />
        </IconButton>
      </CounterFullYellowStyled>
    );
  }

  if (variant === 'homepage-yellow') {
    const ButtonStyleClasses =
      'border-2 border-primary bg-primary p-1 border-solid rounded-full min-w-[unset] aspect-square';
    return (
      <>
        <Box className="flex items-center border-primary-200 px-1 md:px-3 md:py-1.5 border rounded-[85px] w-max">
          {/* <OriginButton
            variant="iconPrimary"
            buttonText="Remove qty"
            handleClick={onClickMinus}
            classes={{
              iconButton: 'p-1 aspect-square',
              iconOne: 'w-2.5 h-2.5',
              buttonText: 'sr-only'
            }}
            IconOne={OriginMinus}
          /> */}
          <InputBase
            id="quantity-input"
            aria-label="quality-input"
            type="number"
            inputProps={{
              shrink: true,
              className: 'p-1 min-w-1 w-10 text-center text-sm md:text-base',
              max: 999
            }}
            value={value === 0 ? '' : value}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!Number.isNaN(value) && value <= 999) {
                onChangeInput(e);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                e.stopPropagation();
                onClickPlus(e);
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                e.stopPropagation();
                onClickMinus(e);
              }
            }}
          />
          {/* <OriginButton
            variant="iconPrimary"
            buttonText="Add qty"
            handleClick={onClickPlus}
            classes={{ iconButton: ButtonStyleClasses, buttonText: 'sr-only' }}
            IconOne={OriginPlus}
            IconOneProps={{ className: 'w-2.5 h-2.5' }}
          /> */}
        </Box>
      </>
    );
  }

  return (
    <CounterStyled className="counter-cart">
      <IconButton className="minus" onClick={onClickMinus}>
        <Image src={Minus} alt="minus" />
      </IconButton>
      <input
        className="input"
        type="number"
        placeholder="0"
        value={value === 0 ? '' : value}
        onChange={onChangeInput}
      />
      <IconButton className="minus" onClick={onClickPlus}>
        <Image src={Plus} alt="plus" />
      </IconButton>
    </CounterStyled>
  );
}
