import { Dispatch } from 'redux';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { setLoginDetails, setTabType, setIsSidebarOpen } from '@/store/slice/loginSlice';
import { registerSuperProperties } from '@/utilities/mixpanel';

export const handleLaunchResponse = (
  response: any,
  dispatch: Dispatch<any>,
  setAddress: (val: any) => void,
  setProfile: (val: any) => void,
  userToken: string,
  shouldReload: boolean = false
) => {
  const { profile, address: addresses } = response;

  // Update Profile Atom
  if (profile) {
    setProfile((prev: any) => ({
      ...prev,
      data: profile
    }));
  }

  // Logic 1: Check for default address
  const defaultAddress = addresses?.find((item: any) => item.is_default === true);

  // Update Local Storage for Store/Address
  if (defaultAddress) {
    // Assuming default implies deliverable or we just trust the flag if it exists,
    // but the prompt implies we just check default=true.
    // Existing code checked deliverable, but for "Browsing" validation, availability of default is key.
    // We will set it to local storage to ensure the app picks it up.
    if (defaultAddress.store_id) {
      localStorage.setItem('store-id', JSON.stringify(defaultAddress.store_id));
      // Attach store_id as a Mixpanel super property so it's sent with every event
      registerSuperProperties({ store_id: String(defaultAddress.store_id) });
    }
    localStorage.setItem('selected_address', JSON.stringify(defaultAddress));
  } else {
    // If no default, maybe we shouldn't clear it immediately if we are just checking launch?
    // But if we are "launching" the user session, we should align with truth.
    // However, if the user had a session and we are re-validating, clearing might be aggressive.
    // But for a fresh login (OTP), we definitely want to set it.
  }

  // Update Address Atom
  setAddress({
    loading: false,
    success: true,
    error: false,
    address: addresses || [],
    defaultAddress: defaultAddress || null
  });

  // Navigation Logic
  const tabSource = typeof window !== 'undefined' ? localStorage.getItem('tab_source') : null;
  const parsedTabSource = tabSource ? JSON.parse(tabSource) : null;

  if (defaultAddress) {
    // Condition 1: Default Address Exists -> Allow browse
    if (shouldReload) {
      if (parsedTabSource === TabTypeConstant.CART) {
        dispatch(
          setLoginDetails({
            isSidebarOpen: true,
            isLogin: true,
            user: userToken,
            tabType: TabTypeConstant.CART
          })
        );
        // Clear the source after returning to the cart on login
        localStorage.removeItem('tab_source');
      } else {
        dispatch(
          setLoginDetails({
            isSidebarOpen: false,
            isLogin: true,
            user: userToken,
            tabType: ''
          })
        );
        dispatch(setIsSidebarOpen(false));
      }
    } else {
      // BACKGROUND REFRESH: Only update login status and user ID, don't touch UI visibility
      dispatch(
        setLoginDetails({
          isLogin: true,
          user: userToken
        })
      );
    }
  } else if (!profile?.name) {
    // Condition 2: No Name -> Register (Only if fresh login or explicitly requested)
    if (shouldReload) {
      dispatch(
        setLoginDetails({
          isSidebarOpen: true,
          isLogin: true,
          user: userToken,
          tabType: TabTypeConstant.REGISTER
        })
      );
    }
  } else if (!addresses || addresses.length === 0) {
    // Condition 3: Name exists but No Address -> Manage Address
    if (shouldReload) {
      dispatch(
        setLoginDetails({
          isSidebarOpen: true,
          isLogin: true,
          user: userToken,
          tabType: TabTypeConstant.MANAGE_ADDRESS
        })
      );
    }
  } else {
    // Fallback: Has name, has addresses, but NO default.
    if (shouldReload) {
      dispatch(
        setLoginDetails({
          isSidebarOpen: true,
          isLogin: true,
          user: userToken,
          tabType: TabTypeConstant.MANAGE_ADDRESS
        })
      );
    }
  }
};
