import { Box, Button, Divider, IconButton, TextField, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import Image from 'next/image';
import React from 'react';

import PaymentSidebarLayout from '../../components/PaymentLayout/PaymentSidebarLayout';
import { addressAtom, isAddressListIsOpen } from '@/features/Address/context/atoms';

import Edit from './assets/edit.svg';
import { cartAtom, cartItems, isCartPageIsOpen } from '../CartPage/context/atoms';
import useCartCalculation from '../CartPage/hooks/useCartCalculation';
import type CartAtomI from '../CartPage/types/CartAtomI';
import Add from './assets/alternateAdd.svg';
import Home from './assets/home.svg';
import TimeSlotSelector from './components/TimeSlotSelector';
import { checkoutAPI, isAddressAndTimeSlotIsOpen, razorPayObjectAtom } from './context/atoms';
import { getCheckout } from './services/getCheckout';
import Fail from '@/features/PaymentPage/components/Fail';
import Success from '@/features/PaymentPage/components/Success';
import usePaymentHook from '@/features/PaymentPage/hooks/usePaymentHook';
import classNames from 'classnames';
import toast from 'react-hot-toast';
import Arrow from './assets/arrow-left.svg';
import { FailOrSuccess, isPaymentIsOpen } from '@/features/PaymentPage/context/atoms';
import { StyledHeadingTypography } from '@/features/OrderDetailsMobileView/components/Styled/StyledHeadingTypography';
import { getAddress } from '@/features/Address/services/getAddress';

const AddressAndTimeSlot = () => {
  const [isOpen, setIsOpen] = useAtom(isAddressAndTimeSlotIsOpen);
  const [isCartOpen, setIsCartOpen] = useAtom(isCartPageIsOpen);
  const [, setCheckout] = useAtom(checkoutAPI);
  const [address, setAddress] = useAtom(addressAtom);
  const [cart] = useAtom(cartItems);
  const [, setIsAddressOpen] = useAtom(isAddressListIsOpen);
  const [, setIsPaymentOpen] = useAtom(isPaymentIsOpen);
  const [, setRazorPayObject] = useAtom(razorPayObjectAtom);
  const { total } = useCartCalculation();
  const [cartDetails, setCartDetails] = useAtom(cartAtom);
  const { isFailOrSuccess, paymentPrefill, onInitiatePayment, setFailOrSuccess } = usePaymentHook();

  React.useEffect(() => {
    getCheckout(setCheckout);
    getAddress(setAddress);
    return () => {
      setRazorPayObject(null);
    };
  }, []);

  const onProceed = () => {
    if (!cartDetails.cartValues?.timeSlotId) {
      const details: CartAtomI = {
        ...cartDetails,
        cartValues: {
          ...cartDetails.cartValues,
          timeSlotError: 'Please select the timeslot before proceeding'
        }
      };

      toast.error('Please select the timeslot before proceeding');
      setCartDetails(details);
      return;
    }
    onInitiatePayment();
  };

  const onOpenAddress = () => {
    setIsAddressOpen(true);
    setIsOpen(false);
  };

  // const renderAlternativeNumber = () => {
  //   if (cartDetails.cartValues?.isAlternateNumberOpen)
  //     return (
  //       <TextField
  //         sx={{
  //           width: "100%",
  //         }}
  //         value={cartDetails.cartValues?.alternateNumber || ""}
  //         onChange={(event) => {
  //           const { value } = event.target;
  //           const phoneRegex = /^[0-9]{0,10}$/;

  //           if (phoneRegex.test(value)) {
  //             const details: CartAtomI = {
  //               ...cartDetails,
  //               cartValues: {
  //                 ...cartDetails.cartValues,
  //                 alternateNumber: value,
  //               },
  //             };
  //             setCartDetails(details);
  //           }
  //         }}
  //         placeholder="Alternate Number"
  //         required={false}
  //       />
  //     );

  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         justifyContent: "space-evenly",
  //         alignItems: "center",
  //         margin: "1rem 0.5rem 1rem 0.5rem",
  //         border: "2px solid #25874d",
  //         padding: "0.5rem 0.7rem 0.5rem 0.7rem",
  //         borderRadius: "48px",
  //         cursor: "pointer",
  //       }}
  //       onClick={() => {
  //         const details: CartAtomI = {
  //           ...cartDetails,
  //           cartValues: {
  //             ...cartDetails.cartValues,
  //             isAlternateNumberOpen: true,
  //           },
  //         };
  //         setCartDetails(details);
  //       }}
  //     >
  //       <Image src={Add} alt="add" />
  //       <Typography
  //         sx={{
  //           color: "#25874D",
  //           fontSize: "13px",
  //           fontWeight: "600",
  //         }}
  //       >
  //         Add alternate phone number (Optional)
  //       </Typography>
  //     </Box>
  //   );
  // };

  const renderAddress = () => {
    return (
      <Box>
        <StyledHeadingTypography
          sx={{
            fontSize: '18px !important',
            margin: ' 0.5rem 0.3rem 0.3rem 0.5rem'
          }}
        >
          Delivering to
        </StyledHeadingTypography>
        <Box
          className="delivering-to"
          sx={{
            marginTop: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            backgroundColor: 'rgba(242, 238, 228, 0.3)',

            border: '2px solid #F2EEE4',
            padding: '0.5rem',

            margin: ' 0.3rem 0.3rem 0.3rem 0.3rem',

            borderRadius: '16px'
          }}
        >
          {/* <Divider
      sx={{
        border: "1px solid #F2EEE4",
      }}
    /> */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              margin: '0.7rem 0 0.7rem 0'
            }}
          >
            <Box
              component="figure"
              sx={{
                width: '46px',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                margin: 0,
                borderRadius: '6px',
                border: '1px solid none',
                backgroundColor: '#F2EEE4'
              }}
            >
              <Image width={23} height={22} src={Home} alt="orderPlaced" />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '0.3rem'
              }}
            >
              <Typography component="span" variant="body2" sx={{ fontWeight: '600' }}>
                {address.defaultAddress?.address_name}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: 'rgba(0, 0, 0, 0.60)',
                  fontWeight: 'normal',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {address.defaultAddress?.address}
              </Typography>
            </Box>
            <IconButton onClick={onOpenAddress}>
              <Image width={23} height={22} src={Edit} alt="orderPlaced" />
            </IconButton>
          </Box>
          {/* <Divider
      sx={{
        border: "1px solid #F2EEE4",
      }}
    /> */}

          {/* {renderAlternativeNumber()} */}
        </Box>
      </Box>
    );
  };

  const renderContent = () => {
    if (isFailOrSuccess !== FailOrSuccess.NONE) {
      switch (isFailOrSuccess) {
        case FailOrSuccess.SUCCESS:
          return <Success />;
        case FailOrSuccess.FAIL:
          return <Fail />;
        default:
          return <Fail />;
      }
    }

    const getPrefillText = () => {
      switch (paymentPrefill) {
        case 'paylater': {
          return 'Pay Later';
        }
        case 'upi': {
          return 'UPI';
        }
        case 'card': {
          return 'Card';
        }
        case 'cash': {
          return 'Cash';
        }
        case 'netbanking': {
          return 'Net Banking';
        }
        default: {
          return 'UPI';
        }
      }
    };

    return (
      <>
        <Box
          sx={{
            height: 'calc(100vh - 68px - 1rem)',
            overflowY: 'auto',
            overflowX: 'hidden',
            mt: '-1rem'
          }}
        >
          {renderAddress()}

          <TimeSlotSelector />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '1rem',
            width: '98%',
            backgroundColor: '#ffffff',
            marginLeft: '-1rem',
            marginBottom: '-1rem',
            boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
            padding: '1rem'
          }}
          className=""
        >
          <Box
            sx={{
              ml: '2rem',
              marginBottom: '1rem'
            }}
            className="flex items-center justify-between"
          >
            <Typography
              sx={{
                fontSize: '14px'
              }}
            >
              {`Paying with ${getPrefillText()}`}
            </Typography>
            <Button
              variant="text"
              onClick={() => {
                setIsOpen(false);
                setIsPaymentOpen(true);
              }}
              sx={{
                mr: '2rem'
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  mr: '0.5rem'
                }}
              >
                Switch
              </Typography>
              <Image src={Arrow} alt="arrow" />
            </Button>
          </Box>
          <Box
            sx={{
              backgroundColor: '#fac510',
              border: 'none',
              borderRadius: '58px',
              ml: '1rem',
              mr: '1rem',
              mb: '1rem',
              zIndex: 1000,
              padding: '0.8rem',
              cursor: 'pointer'
            }}
            onClick={onProceed}
          >
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                py: '0.1rem'
              }}
            >
              {/* <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: "12px",
                    color: "#231F2099",
                  }}
                >{`${cart
                  .map((i) => i?.uom?.length)
                  .reduce((sum, num) => sum + num, 0)} items`}</Typography> */}
              <Typography
                sx={{
                  fontSize: '16px',
                  color: '#231F20',
                  width: 'max-content'
                }}
              >
                {`Pay ₹ ${total}`}
              </Typography>
              {/* </Box> */}
              {/* <Button
                // disabled={!cartDetails.cartValues?.timeSlotId}
                sx={{
                  color: "#fac510",
                  backgroundColor: "#231F20",
                  padding: "0.5rem 1rem 0.5rem 1rem",
                  border: "none",
                  borderRadius: "36px",
                  ":disabled": {
                    color: "#fac510",
                    backgroundColor: "#636363",
                  },
                  ":hover": {
                    color: "#fac510",
                    backgroundColor: "#231F20",
                  },
                }}
              >
                Next Step
              </Button> */}
            </Box>
          </Box>
        </Box>
      </>
    );
  };

  return (
    <PaymentSidebarLayout
      isOpen={isOpen}
      title="Address & Time slot"
      onClose={() => {
        setIsOpen(false);
        setFailOrSuccess(FailOrSuccess.NONE);
      }}
      isBackEnable
      onBack={() => {
        setFailOrSuccess(FailOrSuccess.NONE);
        setIsCartOpen(true);
        setIsOpen(false);
      }}
    >
      {renderContent()}
    </PaymentSidebarLayout>
  );
};

export default AddressAndTimeSlot;
