// import { Box, Button, Typography } from '@mui/material';
// import { useAtom, useAtomValue } from 'jotai';
// import React, { useState } from 'react';
// import styles from './style.module.css';

// import CartSidebarLayout from '../../components/CartLayout/CartSidebarLayout';
// import { isAddressAndTimeSlotIsOpen } from '../AddressAndTimeSlot/context/atoms';

// import TabType from '@/features/AddressEditDetails/enums/TabType';
// import BillDetails from './components/BillDetails';
// import CancellationPolicy from './components/CancellationPolicy';
// import CartRewards from './components/CartRewards';
// import CouponSection from './components/CouponSection';
// import DeliveryInstruction from './components/DeliveryInstruction';
// import EmptyCart from './components/EmptyCart';
// import ItemsList from './components/ItemsList';
// import { cartAtom, cartItems, isCartPageIsOpen } from './context/atoms';
// import { addToCart } from './services/addToCart';
// import useCartManipulation from './hooks/useCartManipulation';
// import useCartManipulationWithoutProps from './hooks/useCartManipulationWithoutProps';
// import toast from 'react-hot-toast';
// import { addressAtom, isAddressListIsOpen } from '@/features/Address/context/atoms';
// import { isAddressIsOpen, addressSidebarDetails } from '@/features/AddressEditDetails/context/atoms';

// const Cart = () => {
//   const [isOpen, setIsOpen] = useAtom(isCartPageIsOpen);
//   const [, setIsAddressOpen] = useAtom(isAddressIsOpen);
//   const cart = useAtomValue(cartItems);
//   const [, setCartAtom] = useAtom(cartAtom);
//   const [, setSidebarDetails] = useAtom(addressSidebarDetails);
//   const [, setIsAddressListOpen] = useAtom(isAddressListIsOpen);
//   const [address] = useAtom(addressAtom);
//   const [toPay, setToPay] = useState(0);
//   const [, setIsAddressTimeSlotOpen] = useAtom(isAddressAndTimeSlotIsOpen);
//   const [unavailableItemRemoval, setUnavailableItemRemoval] = React.useState(false);
//   const { removeUnavailableItems } = useCartManipulationWithoutProps();

//   React.useEffect(() => {
//     if (cart && Array.isArray(cart) && cart.length > 0) addToCart(cart, setCartAtom);
//   }, []);

//   const onRemoveUnavailableItems = async () => {
//     removeUnavailableItems();
//     setUnavailableItemRemoval(false);
//   };

//   const hasUnavailableUOM = (): boolean => {
//     return cart.some((item) => item.uom.some((uom: any) => !uom.is_available));
//   };

//   const checkIfQtyExceedsMax = () => {
//     return cart.some((product) => product.uom.some((uom: any) => uom.qty > uom.maximum_quantity));
//   };

//   const onProceed = () => {
//     if (checkIfQtyExceedsMax()) {
//       toast.error('Please review your cart for cart quantities.');
//       return;
//     }

//     if (hasUnavailableUOM()) {
//       setUnavailableItemRemoval(true);
//       return;
//     }
//     const allNonDefaultWithAtLeastOneDeliverable =
//       address?.address?.every((add: any) => add.is_default === false) &&
//       address.address.some((add: any) => add.deliverable === true);
//     const noDeliverableAddresses = address.address?.every((add: any) => add.deliverable === false);

//     setIsOpen(false);

//     if (allNonDefaultWithAtLeastOneDeliverable) {
//       setIsAddressListOpen(true);
//     } else if (noDeliverableAddresses) {
//       setIsAddressOpen(true);
//       setSidebarDetails((prevProps) => ({
//         ...prevProps,
//         tabType: TabType.ADDRESS_SELECTION
//       }));
//     } else {
//       setIsAddressTimeSlotOpen(true);
//     }
//   };

//   const renderCartItems = () => {
//     return (
//       <>
//         <Box
//           sx={{
//             height: 'calc(100vh - 100px - 5rem)',
//             overflowY: 'auto',
//             overflowX: 'hidden',
//             mt: '-1rem',
//             '&::-webkit-scrollbar': {
//               display: 'none'
//             }
//           }}
//           className={styles.noGlobalScrollbar}
//         >
//           <ItemsList />
//           <DeliveryInstruction />
//           <CouponSection />
//           <CartRewards />
//           <BillDetails setToPay={setToPay} />
//           <CancellationPolicy />
//         </Box>
//         <Box
//           sx={{
//             backgroundColor: '#fac510',
//             border: 'none',
//             borderRadius: '58px',
//             position: 'absolute',
//             bottom: '0',
//             width: '90%',
//             zIndex: 1000,
//             padding: '0.8rem'
//           }}
//         >
//           <Box
//             sx={{
//               display: 'flex',
//               width: '100%',
//               justifyContent: 'space-between'
//             }}
//           >
//             <Box>
//               <Typography
//                 variant="subtitle2"
//                 sx={{
//                   fontSize: '12px',
//                   color: '#231F2099'
//                 }}
//               >{`${cart.map((i) => i?.uom?.length).reduce((sum, num) => sum + num, 0)} items`}</Typography>
//               <Typography
//                 variant="subtitle2"
//                 sx={{
//                   fontSize: '16px',
//                   color: '#231F20'
//                 }}
//               >{`₹ ${toPay}`}</Typography>
//             </Box>
//             <Button
//               onClick={onProceed}
//               sx={{
//                 color: '#fac510',
//                 backgroundColor: '#231F20',
//                 padding: '0.5rem 1rem 0.5rem 1rem',
//                 border: 'none',
//                 borderRadius: '36px',
//                 ':disabled': {
//                   color: '#fac510',
//                   backgroundColor: '#636363'
//                 },
//                 ':hover': {
//                   color: '#fac510',
//                   backgroundColor: '#231F20'
//                 }
//               }}
//             >
//               Next Step
//             </Button>
//           </Box>
//         </Box>
//       </>
//     );
//   };

//   const renderContent = () => {
//     if (unavailableItemRemoval) {
//       return (
//         <Box
//           sx={{
//             height: 'calc(100svh - 100px)',
//             width: '100%',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//             gap: '1rem'
//           }}
//         >
//           <Typography
//             component="h3"
//             variant="h5"
//             sx={{
//               fontFamily: 'SofiaPro',
//               fontSize: '20px !important',
//               fontWeight: '600',
//               color: '#231F20'
//             }}
//           >
//             Some items are not in stock!
//           </Typography>
//           <Box
//             sx={{
//               width: '70%'
//             }}
//           >
//             <Typography
//               component="p"
//               sx={{
//                 fontFamily: 'Lexend',
//                 fontSize: '14px !important',
//                 color: '#231F20'
//               }}
//             >
//               You can either remove all items which are not available currently or review your cart.
//             </Typography>
//           </Box>

//           <Box className="flex gap-2">
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={onRemoveUnavailableItems}
//               sx={{
//                 color: '#C70000',
//                 border: '1px solid #C70000',
//                 '&:hover': {
//                   backgroundColor: '#c700001f',
//                   border: '1px solid #C70000'
//                 },
//                 borderRadius: '20px',
//                 padding: '8px 20px'
//               }}
//             >
//               Remove items
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={() => {
//                 setUnavailableItemRemoval(false);
//               }}
//               sx={{
//                 color: '#231F20',
//                 border: '1px solid #231F20',
//                 '&:hover': {
//                   backgroundColor: '#231f201f',
//                   border: '1px solid #231F20'
//                 },
//                 borderRadius: '20px',
//                 padding: '8px 20px'
//               }}
//             >
//               Review cart
//             </Button>
//           </Box>
//         </Box>
//       );
//     }
//     if (cart.length > 0) return renderCartItems();
//     return <EmptyCart />;
//   };

//   return (
//     <CartSidebarLayout
//       isOpen={isOpen}
//       title="Your Cart"
//       onClose={() => {
//         setIsOpen(false);
//       }}
//     >
//       <Box
//         className="body-inner"
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '20px'
//         }}
//       >
//         {renderContent()}
//       </Box>
//     </CartSidebarLayout>
//   );
// };
// export default Cart;
