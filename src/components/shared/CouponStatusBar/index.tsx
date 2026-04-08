import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { isCouponPageIsOpen, couponList as couponListAtom } from '@/features/CouponPage/context/atoms';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { protectedUrl } from '@/url';
import { getAddressAndStoreId } from '@/utilities/utils';
import type CouponI from '@/features/CouponPage/types/CouponI';
import { setLoginDetails } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';

const HIDDEN_PATHS = [
  '/cart',
  '/checkout',
  '/orders',
  '/terms-and-conditions',
  '/privacy-policy',
  '/refund-policy',
  '/delete-account',
  '/invoice'
];

const CouponStatusBar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart);
  const isLogin = useSelector((state: any) => state.loginDetails.isLogin);
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const getDataFromApi = useGetDataFromApi();
  const [, setIsCouponOpen] = useAtom(isCouponPageIsOpen);
  const [couponsState, setCouponsState] = useAtom(couponListAtom);
  const isMobile = useMediaQuery(600);

  const couponList = couponsState.coupons || [];
  const [activeIndex, setActiveIndex] = useState(0);

  const subTotal = cart.totalPrice;

  // Fetch coupons whenever subTotal or login status changes
  useEffect(() => {
    // DO NOT call the API if the user is logged out
    if (!isLogin) {
      setCouponsState((prev) => ({ ...prev, coupons: [] }));
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getCoupons'] + `?sub_total=${subTotal || 0}`;

    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const successHandler = (data: any) => {
      const coupons = data?.data || (Array.isArray(data) ? data : []);
      setCouponsState((prev) => ({ ...prev, coupons, success: true, loading: false }));
    };

    const failureHandler = () => {
      setCouponsState((prev) => ({ ...prev, coupons: [], error: true, loading: false }));
    };

    setCouponsState((prev) => ({ ...prev, loading: true }));
    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  }, [subTotal, isLogin, setCouponsState, cart.couponDetails?.code]);

  // Memoize displayCoupons for stability
  const displayCoupons = useMemo(() => {
    if (!isLogin) return [];
    const appliedCouponCode = cart.couponDetails?.code;
    return (couponsState.coupons || []).filter(
      (c: CouponI) => (c.min_cart_value > 0 || c.discount > 0) && c.code !== appliedCouponCode
    );
  }, [isLogin, couponsState.coupons, cart.couponDetails?.code]);

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (displayCoupons.length > 0) {
        setActiveIndex((prev) => (prev + 1) % displayCoupons.length);
      }
    },
    [displayCoupons.length]
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (displayCoupons.length > 0) {
        setActiveIndex((prev) => (prev - 1 + displayCoupons.length) % displayCoupons.length);
      }
    },
    [displayCoupons.length]
  );

  // Auto-scroll logic
  useEffect(() => {
    if (!isLogin || displayCoupons.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [isLogin, displayCoupons.length, handleNext]);

  // Don't show on hidden paths
  const hiddenPath = HIDDEN_PATHS.some((p) => router.pathname.startsWith(p));
  if (hiddenPath) return null;

  // If logged in but no displayable coupons, hide the bar
  if (isLogin && displayCoupons.length === 0) return null;

  // Content for display
  let title = '';
  let subtitle: React.ReactNode = '';
  let safeIndex = 0;

  if (!isLogin) {
    title = 'Login to unlock offers';
    subtitle = 'Tap to sign in and save on your order';
  } else {
    safeIndex = activeIndex % displayCoupons.length;
    const coupon = displayCoupons[safeIndex];
    if (!coupon) return null;

    const gap = (coupon.min_cart_value || 0) - (subTotal || 0);
    const isUnlocked = gap <= 0;
    const discountText = coupon.discount_type === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`;

    title = isUnlocked ? `Extra ${discountText} off activated!` : `Get an extra ${discountText} off`;

    subtitle = isUnlocked ? (
      <>
        Use <span style={{ fontWeight: 700, color: '#fff' }}>{coupon.code}</span> at checkout
      </>
    ) : (
      <>
        Add produce worth <span style={{ fontWeight: 700, color: '#fff' }}>₹{Math.ceil(gap)}</span> more
      </>
    );
  }

  const handleClick = () => {
    if (isLogin) {
      setIsCouponOpen(true);
    } else {
      dispatch(
        setLoginDetails({
          ...loginDetails,
          isSidebarOpen: true,
          tabType: TabTypeConstant.ENTER_MOBILE_NUMBER
        })
      );
    }
  };

  return (
    <div
      onClick={handleClick}
      id="coupon-status-bar"
      style={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: 420,
        zIndex: 50,
        cursor: 'pointer'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#006B4A',
          borderRadius: 100,
          padding: '8px 16px 8px 12px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          position: 'relative',
          width: '100%'
        }}
      >
        {/* Coupon Icon */}
        <div
          style={{
            flexShrink: 0,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            marginRight: 12
          }}
        >
          <Image src="/assets/svg/CouponTask.svg" alt="coupon" width={40} height={40} />
        </div>

        {/* Text Area - Swipable */}
        <div style={{ flex: '1 1 0%', minWidth: 0, position: 'relative', height: 36, overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={safeIndex}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) handleNext();
                if (info.offset.x > 50) handlePrev();
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 3
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: 'SofiaPro',
                  letterSpacing: 0.1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {title}
              </p>
              <p
                style={{
                  margin: 0,
                  color: 'rgba(255,255,255,0.78)',
                  fontSize: 12,
                  fontWeight: 400,
                  fontFamily: 'SofiaPro',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Login Button (only when not logged in) */}
        {!isLogin && (
          <div
            style={{
              backgroundColor: '#ffff',
              color: '#000',
              padding: isMobile ? '8px 20px' : '8px 24px',
              borderRadius: 100,
              fontSize: isMobile ? 14 : 16,
              fontWeight: 700,
              fontFamily: 'SofiaPro',
              marginLeft: 'auto',
              flexShrink: 0,
              zIndex: 10
            }}
          >
            Login
          </div>
        )}

        {/* Divider */}
        {isLogin && (
          <div
            style={{
              width: 1,
              alignSelf: 'stretch',
              backgroundColor: 'white',
              flexShrink: 0,
              marginLeft: 'auto',
              marginRight: 10,
              zIndex: 10
            }}
          />
        )}

        {/* Counter + dots */}
        {isLogin && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            style={{
              width: 40,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              zIndex: 10
            }}
          >
            <span
              style={{
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1.2
              }}
            >
              {safeIndex + 1}/{displayCoupons.length}
            </span>
            <div style={{ display: 'flex', gap: 3, height: 5, alignItems: 'center' }}>
              {displayCoupons.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === safeIndex ? 8 : 5,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: i === safeIndex ? '#fac510' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponStatusBar;
