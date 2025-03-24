import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

/**
 * Custom hook to get the header sidebar name based on the tab type.
 * @returns {string} The corresponding header sidebar name.
 */
export const useGetHeaderSidebarName = () => {
  const tabType = useSelector((state: any) => state.loginDetails.tabType);
  const cart = useSelector((state: any) => state.cart);

  const getHeaderSidebarName = useCallback(() => {
    switch (tabType) {
      case TabTypeConstant.ENTER_MOBILE_NUMBER:
      case TabTypeConstant.ENTER_OTP:
        return 'Login / Sign up';

      case TabTypeConstant.REGISTER:
        return 'Registration';

      case TabTypeConstant.ACCOUNT_MAIN:
      case TabTypeConstant.EDIT_ACCOUNT:
        return 'My Account';

      case TabTypeConstant.YOUR_ORDERS:
        return 'My Orders';

      case TabTypeConstant.MANAGE_ADDRESS:
      case TabTypeConstant.ADDRESS_LIST:
      case TabTypeConstant.SERVICEABILITY:
      case TabTypeConstant.COMPLETE_ADDRESS:
      case TabTypeConstant.MANUAL_ADDRESS:
      case TabTypeConstant.NO_DATA:
        return 'Manage Address';

      case TabTypeConstant.SETTING:
        return 'Settings';

      case TabTypeConstant.HELP_FAQ:
        return 'Faqs & Help';

      case TabTypeConstant.SELECT_ADDRESS:
        return 'Select Location';

      case TabTypeConstant.CART:
        if (cart.cartTabType === TabTypeConstant.COUPON_CODE_LIST) return 'Apply Coupon';
        if (cart.cartTabType === TabTypeConstant.PAYMENT) return 'Payment Options';
        else return 'Your cart';
      case TabTypeConstant.REFUND_LIST:
        return 'Refund details';

      default:
        return 'Login / Sign up';
    }
  }, [tabType, cart.cartTabType]);

  return getHeaderSidebarName;
};
