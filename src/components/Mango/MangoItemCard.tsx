import Image from 'next/image';
import { useMediaQuery } from '@mui/material';
import React, { useState, useEffect } from 'react';
import AddItemBtn from '../shared/AddItemBtn/AddItemBtn';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import { protectedUrl } from '@/url';
import { useDispatch } from 'react-redux';
import { addNotifiedItem } from '@/store/slice/productsSlice';
import { motion, AnimatePresence } from 'framer-motion';

// --- SVG IMPORTS ---
import itemRipenessSvg from '/public/assets/svg/itemRipeness.svg';
import logo from '/public/logo.svg';

import { UOMPopup, MaxQuantityToast, Product, UOM, NotifyToast } from '../shared/UOMPopup';

const MangoItemCard = ({ itemDetails }: { itemDetails: Product }) => {
  const router = useRouter();
  const cartItems = useSelector((state: any) => state.cart.items);

  const defaultUOM = itemDetails?.multiple_uoms?.find((uom: any) => uom?.is_default) || itemDetails?.multiple_uoms?.[0];
  const initialRipeness = defaultUOM ? defaultUOM.ripeness_types?.[0] || null : null;

  const [selectedUOM, setSelectedUOM] = useState(defaultUOM);
  const [selectedRipeness, setSelectedRipeness] = useState<string | null>(initialRipeness);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [quantityDir, setQuantityDir] = useState<1 | -1>(1);

  const [showMaxQuantityToast, setShowMaxQuantityToast] = useState(false);
  const [toastMaxQuantity, setToastMaxQuantity] = useState<number | null>(null);

  const [showNotifyToast, setShowNotifyToast] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState('');
  const [notifyType, setNotifyType] = useState<'success' | 'error'>('success');

  const notifiedItems = useSelector((state: any) => state.products.notifiedItems);
  const isNotified = notifiedItems.includes(itemDetails.id);

  const dispatch = useDispatch();
  const sendDataToApi = useSendDataToApi();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleMaxQuantityExceeded = (maxQty: number) => {
    setToastMaxQuantity(maxQty);
    setShowMaxQuantityToast(true);
  };

  const handleNotifyMe = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['notifyMe'];
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const payload = { item_id: itemDetails.id };

    const successHandler = (data: any) => {
      setNotifyMsg(data?.message || 'Successfully subscribed to notifications');
      setNotifyType('success');
      setShowNotifyToast(true);
      dispatch(addNotifiedItem(itemDetails.id));
    };

    const failureHandler = (error: any) => {
      setNotifyMsg(error?.message || 'Not successful. Please try again later.');
      setNotifyType('error');
      setShowNotifyToast(true);
    };

    await sendDataToApi(apiUrl, payload, 'POST', successHandler, failureHandler, additionalHeaders);
  };

  if (!defaultUOM) return null;

  const isBasketItem = defaultUOM.basket && typeof defaultUOM.basket.capacity === 'number';
  const availableUOMs = itemDetails?.multiple_uoms?.filter((uom: any) => uom?.is_available) || [];
  const hasMultipleUOMs = availableUOMs.length > 1;
  const hasRipenessOptions = availableUOMs.some((uom) => uom.ripeness_types && uom.ripeness_types.length > 0);
  const requiresSelection = hasMultipleUOMs || hasRipenessOptions;

  const handleSelectionMade = (uom: UOM, ripeness: string | null) => {
    setSelectedUOM(uom);
    setSelectedRipeness(ripeness);
  };

  const handleNavigation = () => {
    const slug = encodeURIComponent(itemDetails.name.replace(/ /g, '-').toLowerCase());
    router.push(`/${slug}/${itemDetails.id}`);
  };

  const handleBasketViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleNavigation();
  };

  const currentCartProduct = cartItems.find((item: any) => item.id === itemDetails.id);
  let totalQuantityAcrossProduct = 0;

  if (currentCartProduct && currentCartProduct.multiple_uoms) {
    currentCartProduct.multiple_uoms.forEach((cartUOM: any) => {
      if (cartUOM.cart_ripeness && Array.isArray(cartUOM.cart_ripeness)) {
        cartUOM.cart_ripeness.forEach((r: any) => {
          totalQuantityAcrossProduct += Number(r.qty) || 0;
        });
      } else {
        totalQuantityAcrossProduct += Number(cartUOM.cart_quantity) || 0;
      }
    });
  }

  const totalOptionsCount = availableUOMs.reduce((acc, uom) => {
    return acc + (uom.ripeness_types?.length || 1);
  }, 0);

  return (
    <>
      <MaxQuantityToast
        maxQuantity={toastMaxQuantity}
        isVisible={showMaxQuantityToast}
        onClose={() => setShowMaxQuantityToast(false)}
        itemName={itemDetails.name}
      />

      {/* Mango Styled Container: White background, Border, Shadow, Padding */}
      <div
        className="bg-white border border-[#EDE6D4] rounded-[24px] p-5 shadow-[0px_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0px_15px_40px_rgba(0,0,0,0.08)] transition-all flex flex-col h-full relative"
        style={{ width: '304.47px' }}
      >
        <div onClick={handleNavigation} className="cursor-pointer w-full text-start group flex flex-col h-full">
          {/* Image Container — adjusted to precise design specs */}
          <div
            className="relative bg-[#F3F0E6] flex items-center justify-center overflow-hidden mb-4"
            style={{
              width: '264.47px',
              height: '240.67px',
              borderRadius: '21.16px'
            }}
          >
            <div
              className={`relative w-full h-full p-4 transition-transform duration-500 group-hover:scale-105 ${!selectedUOM.is_available ? 'grayscale' : ''}`}
            >
              <Image
                src={itemDetails.image || logo}
                alt={itemDetails.name || 'product image'}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: 'contain' }}
              />
            </div>

            {defaultUOM.conversion_text && (
              <div className="absolute top-2 right-2 text-[#146321] text-[12px] font-bold px-2 py-0.5 rounded-full font-[SofiaPro] bg-white bg-opacity-80">
                {defaultUOM.conversion_text}
              </div>
            )}

            {hasRipenessOptions && (
              <div className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow-lg">
                <Image src={itemRipenessSvg} alt="Multiple Ripeness Options" width={24} height={24} />
              </div>
            )}

            {!selectedUOM.is_available && (
              <div className="bg-black-op-50 absolute top-0 w-full py-2 flex justify-center">
                <p className="text-[12px] font-[SofiaPro] font-semibold text-white">OUT OF STOCK</p>
              </div>
            )}
          </div>

          {/* Name Area */}
          <div className="mb-1">
            <p className="font-[SofiaPro] font-semibold text-[18px] md:text-[20px] leading-tight text-[#1a1a1a]">
              {itemDetails.name}
            </p>
          </div>

          <p className="text-[13px] text-gray-500 mb-1" style={{ fontFamily: 'SofiaPro' }}>
            {itemDetails.description || 'Premium farm fresh mangoes.'}
          </p>

          <p className="text-[13px] text-gray-400 font-medium" style={{ fontFamily: 'SofiaPro' }}>
            {selectedUOM.unit}
          </p>

          {/* Price and Action Area */}
          <div className="flex items-center justify-between mt-auto pt-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                {selectedUOM.market_price > 0 && selectedUOM.market_price > selectedUOM.price && (
                  <p className="text-gray-400 line-through text-[12px] font-[SofiaPro]">₹{selectedUOM.market_price}</p>
                )}
                <p className="font-semibold text-[18px] text-[#1a1a1a]">₹{selectedUOM.price}</p>
              </div>
            </div>

            <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
              {!selectedUOM.is_available ? (
                <button
                  type="button"
                  disabled={isNotified}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isNotified) handleNotifyMe();
                  }}
                  className={`flex items-center justify-center border font-[SofiaPro] font-bold h-10 px-4 rounded-full transition-colors whitespace-nowrap gap-2 border-[#146321] text-[#146321] ${
                    isNotified ? 'cursor-default' : 'hover:bg-green-50 text-[13px]'
                  }`}
                >
                  {!isNotified && <span>Notify</span>}
                  {isNotified ? (
                    <NotificationsActiveIcon sx={{ fontSize: '1.2rem' }} />
                  ) : (
                    <NotificationsIcon sx={{ fontSize: '1.2rem' }} />
                  )}
                </button>
              ) : isBasketItem ? (
                <button
                  type="button"
                  onClick={handleBasketViewClick}
                  className="bg-primary flex items-center justify-center h-10 rounded-full px-6 font-[SofiaPro] text-[13px] font-bold text-black hover:bg-yellow-400 transition-colors shadow-sm"
                >
                  VIEW
                </button>
              ) : requiresSelection ? (
                <motion.div
                  layout
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setQuantityDir(1);
                    setIsPopupOpen(true);
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  className={`flex items-center h-10 rounded-full px-4 py-1 cursor-pointer border shadow-sm transition-all ${
                    totalQuantityAcrossProduct > 0
                      ? 'bg-white border-[#EDE6D4]'
                      : 'bg-white border-[#EDE6D4] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {totalQuantityAcrossProduct > 0 ? (
                        <div className="flex items-center gap-3">
                          <button className="text-gray-400 hover:text-black">–</button>
                          <motion.p
                            key={totalQuantityAcrossProduct}
                            initial={{ opacity: 0, y: quantityDir * 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: quantityDir * -10 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="text-[15px] font-bold text-black select-none text-center"
                          >
                            {totalQuantityAcrossProduct}
                          </motion.p>
                          <button className="text-gray-400 hover:text-black">+</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="font-[SofiaPro] text-[15px] font-bold text-black whitespace-nowrap">
                            Add
                          </span>
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <div className="flex justify-end">
                  <AddItemBtn
                    product={itemDetails}
                    varientId={selectedUOM.variant_id}
                    varientPrice={selectedUOM.price}
                    stepperQuantity={selectedUOM.stepper_quantity}
                    minimumQuantity={selectedUOM.minimum_quantity}
                    buttonType="white"
                    selectedRipenessType={selectedRipeness}
                    onMaxQuantityExceeded={handleMaxQuantityExceeded}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {requiresSelection && (
          <UOMPopup
            product={itemDetails}
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            onSelectionMade={handleSelectionMade}
          />
        )}

        <NotifyToast
          isVisible={showNotifyToast}
          message={notifyMsg}
          type={notifyType}
          onClose={() => setShowNotifyToast(false)}
        />
      </div>
    </>
  );
};

export default MangoItemCard;
