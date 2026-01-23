import { Dispatch } from 'redux';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import { setLoginDetails, setTabType, setIsSidebarOpen } from '@/store/slice/loginSlice';

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
    if (defaultAddress) {
        // Condition 1: Default Address Exists -> Allow browse
        // Close sidebar, ensure login state is set
        dispatch(setLoginDetails({
            isSidebarOpen: false,
            isLogin: true,
            user: userToken,
            tabType: '' // Clear tab or keep it neutral
        }));
        dispatch(setIsSidebarOpen(false));
        if (shouldReload) {
            window.location.reload();
        }
    } else if (!profile?.name) {
        // Condition 2: No Name -> Register
        dispatch(setLoginDetails({
            isSidebarOpen: true,
            isLogin: true, // They are technically logged in (have token) but need profile
            user: userToken,
            tabType: TabTypeConstant.REGISTER
        }));
    } else if (!addresses || addresses.length === 0) {
        // Condition 3: Name exists but No Address -> Manage Address
        dispatch(setLoginDetails({
            isSidebarOpen: true,
            isLogin: true,
            user: userToken,
            tabType: TabTypeConstant.MANAGE_ADDRESS
        }));
    } else {
        // Fallback: Has name, has addresses, but NO default.
        // Prompt said "if user has name no address in the address array navigate to manage address".
        // It didn't explicitly cover "has addresses but no default".
        // But "do not allow them to browse the site unless..." implies strictness.
        // We'll send them to manage address to pick a default.
        dispatch(setLoginDetails({
            isSidebarOpen: true,
            isLogin: true,
            user: userToken,
            tabType: TabTypeConstant.MANAGE_ADDRESS
        }));
    }
};
