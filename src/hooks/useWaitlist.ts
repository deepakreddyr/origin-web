import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSendDataToApi } from '@/utilities/hooks/useSendDataToApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import { protectedUrl } from '@/url';
import { addWaitlistedItem } from '@/store/slice/productsSlice';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';

export const useWaitlist = (itemId: number, isWaitlist?: boolean) => {
  const dispatch = useDispatch();
  const sendDataToApi = useSendDataToApi();

  const isLogin = useSelector((state: any) => state.loginDetails.isLogin);
  const waitlistedItems: number[] = useSelector((state: any) => state.products.waitlistedItems) || [];
  const isWaitlisted = !!isWaitlist || waitlistedItems.includes(itemId);

  const [loading, setLoading] = useState(false);
  const [isPendingPostLogin, setIsPendingPostLogin] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
    visible: false,
    message: '',
    type: 'success'
  });
  const inFlight = useRef(false);

  const submit = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['waitlist'];
    const addressFromLs = getAddressAndStoreId();
    const additionalHeaders = addressFromLs ? { 'store-id': addressFromLs.store_id } : {};

    const successHandler = () => {
      dispatch(addWaitlistedItem(itemId));
      setToast({ visible: true, message: 'Item added to waitlist', type: 'success' });
    };

    const failureHandler = (error: any) => {
      setToast({ visible: true, message: error?.message || 'Not successful. Please try again later.', type: 'error' });
    };

    try {
      await sendDataToApi(apiUrl, { item_id: itemId }, 'POST', successHandler, failureHandler, additionalHeaders);
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLogin && isPendingPostLogin && !isWaitlisted) {
      setIsPendingPostLogin(false);
      submit();
    }
  }, [isLogin, isPendingPostLogin]);

  const join = () => {
    if (isWaitlisted || inFlight.current) return;
    if (!isLogin) {
      setIsPendingPostLogin(true);
      dispatch(setTabType(TabTypeConstant.ENTER_MOBILE_NUMBER));
      dispatch(setIsSidebarOpen(true));
      return;
    }
    submit();
  };

  const showAlreadyAdded = () =>
    setToast({ visible: true, message: 'Item already added to waitlist', type: 'success' });

  const closeToast = () => setToast((t) => ({ ...t, visible: false }));

  return { isWaitlisted, loading, join, showAlreadyAdded, toast, closeToast };
};
