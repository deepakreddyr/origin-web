import Image from 'next/image';
import { Box, useMediaQuery } from '@mui/material';
import React, { useState, useEffect, useRef, FC } from 'react';
import AddItemBtn from './AddItemBtn/AddItemBtn';
import { useRouter } from 'next/router';
import sampleimg from '/public/assets/images/shop/sampleimg2.png';
import { useSelector } from 'react-redux';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { getAddressAndStoreId, cleanImageUrl } from '@/utilities/utils';
import { protectedUrl } from '@/url';
import { useDispatch } from 'react-redux';
import { addNotifiedItem } from '@/store/slice/productsSlice';
import { motion, AnimatePresence } from 'framer-motion';
// --- SVG IMPORTS ---
import ripeSvg from '/public/assets/svg/ripe.svg';
import semiRipeSvg from '/public/assets/svg/semiripe.svg';
import rawSvg from '/public/assets/svg/raw.svg';
import infoicon1 from '/public/assets/svg/infoicon1.svg';
import infoicon2 from '/public/assets/svg/infoicon2.svg';
import itemRipenessSvg from '/public/assets/svg/itemRipeness.svg';
import { useCartStore } from '@/hooks/useCartStore';
import WhiteBtn from './AddItemBtn/WhiteBtn';

import { UOMPopup, MaxQuantityToast, Product, UOM, NotifyToast } from './UOMPopup';

// Remove local interfaces as they are now imported

// Local definitions of MaxQuantityToast and UOMPopup removed

// --------------------------------------------------------
// ITEM CARD COMPONENT
// --------------------------------------------------------
const ItemCard = ({ itemDetails }: { itemDetails: Product }) => {
  const router = useRouter();
  const { cart, isMangoPage } = useCartStore();
  const cartItems = cart.items;

  const defaultUOM = itemDetails?.multiple_uoms?.find((uom: any) => uom?.is_default) || itemDetails?.multiple_uoms?.[0];

  const initialRipeness = defaultUOM ? defaultUOM.ripeness_types?.[0] || null : null;

  const [selectedUOM, setSelectedUOM] = useState(defaultUOM);
  const [selectedRipeness, setSelectedRipeness] = useState<string | null>(initialRipeness);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [quantityDir, setQuantityDir] = useState<1 | -1>(1);

  const [showMaxQuantityToast, setShowMaxQuantityToast] = useState(false);
  const [toastMaxQuantity, setToastMaxQuantity] = useState<number | null>(null);

  // --- NOTIFY ME STATE ---
  const [showNotifyToast, setShowNotifyToast] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState('');
  const [notifyType, setNotifyType] = useState<'success' | 'error'>('success');

  const notifiedItems = useSelector((state: any) => state.products.notifiedItems);
  const isNotified = notifiedItems.includes(itemDetails.id);

  const dispatch = useDispatch();
  const sendDataToApi = useSendDataToApi();
  const isMobile = useMediaQuery('(max-width:600px)');
  // -----------------------

  const handleMaxQuantityExceeded = (maxQty: number) => {
    setToastMaxQuantity(maxQty);
    setShowMaxQuantityToast(true);
  };

  const handleNotifyMe = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['notifyMe'];
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const payload = {
      item_id: itemDetails.id
    };

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

  // Check if this is a basket item
  const isBasketItem = defaultUOM.basket && typeof defaultUOM.basket.capacity === 'number';

  const availableUOMs = itemDetails?.multiple_uoms?.filter((uom: any) => uom?.is_available) || [];

  const hasMultipleUOMs = availableUOMs.length > 1;
  const hasRipenessOptions = availableUOMs.some((uom) => uom.ripeness_types && uom.ripeness_types.length > 0);
  const requiresSelection = hasMultipleUOMs || hasRipenessOptions;

  const handleSelectionMade = (uom: UOM, ripeness: string | null) => {
    setSelectedUOM(uom);
    setSelectedRipeness(ripeness);
  };

  const handleAddItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (requiresSelection) {
      e.preventDefault();
      setIsPopupOpen(true);
    }
  };

  const handleNavigation = () => {
    const slug = encodeURIComponent(itemDetails.name.replace(/ /g, '-').toLowerCase());
    router.push(`/${slug}/${itemDetails.id}`);
  };

  // Handle basket view button click
  const handleBasketViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleNavigation();
  };

  // Calculate total quantity across all UOMs/ripeness
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

      <div className="w-full md:max-w-[16.67vw] mob:max-w-[40vw] text-start relative mx-auto">
        <button onClick={handleNavigation} className="cursor-pointer w-full text-start group">
          {/* Image Container */}
          <div className="relative bg-primary-100 flex items-center justify-center w-[16.67vw] mob:w-[40vw] h-[14.5vw] mob:h-[38vw] rounded-[1.67vw] mob:rounded-[4.1vw] overflow-hidden">
            <div
              className={`relative w-[12.6vw] h-[12vw] mob:w-[38vw] mob:h-[38vw] transition-transform duration-500 group-hover:scale-105 ${!selectedUOM.is_available ? 'grayscale' : ''}`}
            >
              <Image
                // src={cleanImageUrl(itemDetails.website_image) || itemDetails.image || sampleimg}
                src={cleanImageUrl(itemDetails.image) || sampleimg}
                alt={itemDetails.name ? itemDetails.name : 'product image'}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: 'contain' }}
              />
            </div>

            {defaultUOM.conversion_text && (
              <div className="absolute top-2 right-2 text-[#146321] text-[0.7vw] mob:text-[2.5vw] font-bold px-2 py-0.5 rounded-full font-[SofiaPro]">
                {defaultUOM.conversion_text}
              </div>
            )}

            {hasRipenessOptions && (
              <div className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow-lg border border-[#EDE6CC]/80">
                <Image src={itemRipenessSvg} alt="Multiple Ripeness Options" width={35} height={35} />
              </div>
            )}

            {!selectedUOM.is_available && (
              <div className="bg-black-op-50 absolute top-0 w-full px-[1.1vw] mob:px-[4.1vw] py-[.7vw] mob:py-[2vw] rounded-t-[1.1vw] mob:rounded-t-[4.1vw] flex justify-center">
                <p className="text-[.78vw] mob:text-[3vw] font-[SofiaPro] font-semibold text-white">OUT OF STOCK</p>
              </div>
            )}
          </div>

          {/* Name Area */}
          <div className="h-[5.5vw] mob:h-[15vw] overflow-hidden">
            <p className="font-[SofiaPro] font-semibold text-[1.25vw] mob:text-[3.6vw] pt-[1.389vw] mob:pt-4 line-clamp-2">
              {itemDetails.name}
            </p>
          </div>

          {/* Price and Action Area */}
          <div className="flex items-end justify-between">
            <div>
              <p className="font-[SofiaPro] text-[.97vw] mob:text-[2.8vw] text-black-op-50">{selectedUOM.unit}</p>
              <div className="flex items-center gap-1 mob:pt-[01vw] pt-[.4vw]">
                {selectedUOM.market_price > 0 && selectedUOM.market_price > selectedUOM.price && (
                  <p className="text-gray-400 line-through text-[0.8vw] mob:text-[2.2vw] font-[SofiaPro]">
                    ₹{selectedUOM.market_price}
                  </p>
                )}
                <p className="font-[SofiaPro] font-medium text-[1.25vw] mob:text-[3vw] text-black">
                  ₹{selectedUOM.price}
                </p>
              </div>
            </div>

            <div className="mb-1">
              {!selectedUOM.is_available ? (
                <button
                  type="button"
                  disabled={isNotified}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isNotified) handleNotifyMe();
                  }}
                  className={`flex items-center justify-center border-[1.5px] font-[SofiaPro] font-bold h-[2.5vw] mob:h-[8.5vw] px-[1.5vw] mob:px-[3vw] rounded-full transition-colors whitespace-nowrap gap-2 border-[#146321] text-[#146321] ${
                    isNotified ? 'cursor-default' : 'hover:bg-green-50'
                  }`}
                >
                  {!isNotified && <span className="text-[.97vw] mob:text-[3.2vw]">Notify</span>}
                  {isNotified ? (
                    <NotificationsActiveIcon sx={{ fontSize: isMobile ? '4vw' : '1.2vw' }} />
                  ) : (
                    <NotificationsIcon sx={{ fontSize: isMobile ? '4vw' : '1.2vw' }} />
                  )}
                </button>
              ) : isBasketItem ? (
                <button
                  type="button"
                  onClick={handleBasketViewClick}
                  className="bg-primary flex items-center justify-center h-[2.5vw] mob:h-[8.5vw] rounded-full px-[1.5vw] mob:px-[3vw] py-[.4vw] font-[SofiaPro] text-[.97vw] font-bold mob:text-[3.6vw] text-black hover:bg-yellow-400 transition-colors shadow-sm"
                >
                  VIEW
                </button>
              ) : requiresSelection ? (
                <div className="w-full flex justify-center">
                  <WhiteBtn
                    isItemPresent={totalQuantityAcrossProduct > 0}
                    quantity={totalQuantityAcrossProduct}
                    isMangoPage={isMangoPage}
                    hasRipeness={hasRipenessOptions}
                    hasOptions={requiresSelection}
                    handleAddItem={(e: any) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setQuantityDir(1);
                      setIsPopupOpen(true);
                    }}
                    handleIncrease={(e: any) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setQuantityDir(1);
                      setIsPopupOpen(true);
                    }}
                    handleDecrease={(e: any) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setQuantityDir(-1);
                      setIsPopupOpen(true);
                    }}
                  />
                </div>
              ) : (
                <div className="w-[80px] mob:w-auto flex justify-end">
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
        </button>

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

export default ItemCard;
