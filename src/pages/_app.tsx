import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import Script from "next/script";

import Login from "../components/Login";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { isGMapLoadedAtom } from "@/context/global";
import { TabTypeConstant } from "@/components/Login/constants/tabTypeContent";
import { getAddress } from "@/features/Address/services/getAddress";
import {
  addressAtom,
  isAddressListIsOpen,
} from "@/features/Address/context/atoms";
import {
  isAccountIsOpen,
  profileAtom,
} from "@/features/AccountPage/context/atoms";
import { cartItems } from "@/features/CartPage/context/atoms";
import { login } from "@/components/Login/context/atom";
import { getProfile } from "@/features/AccountPage/services/getProfile";
import Account from "@/features/AccountPage";
import { isAddressIsOpen } from "@/features/AddressEditDetails/context/atoms";
import Address from "@/features/AddressEditDetails";
import { isAddressAndTimeSlotIsOpen } from "@/components/AddressAndTimeSlot/context/atoms";
import AddressAndTimeSlot from "@/components/AddressAndTimeSlot";
import AddressList from "@/features/Address";

export default function App({ Component, pageProps }: AppProps) {
  const [isGMapLoaded, setIsGMapLoaded] = useAtom(isGMapLoadedAtom);
  const [, setCartDetails] = useAtom(cartItems);
  const [isAddressOpen] = useAtom(isAddressIsOpen);
  const [isAddressListOpen] = useAtom(isAddressListIsOpen);

  // const [isCartOpen] = useAtom(isCartPageIsOpen);
  // const [isEditOrderOpen] = useAtom(isEditOrderIsOpen);
  // const [isAddressListOpen] = useAtom(isAddressListIsOpen);
  // const [isPaymentOpen] = useAtom(isPaymentIsOpen);
  const [isAddressTimeSlotOpen] = useAtom(isAddressAndTimeSlotIsOpen);
  // const [isRetryPaymentOpen] = useAtom(isRetryPaymentOpenAtom);
  const [, setLoginInfo] = useAtom(login);

  const [, setAddressAtom] = useAtom(addressAtom);
  const [, setProfileAtom] = useAtom(profileAtom);
  const [isAccountOpen] = useAtom(isAccountIsOpen);

  useEffect(() => {
    const cart = localStorage.getItem("cartItem");
    if (cart) setCartDetails(JSON.parse(cart));

    const userToken = localStorage.getItem("user_token");
    if (userToken) {
      setLoginInfo(() => {
        return {
          isLoginSidebarOpen: false,
          isLogin: false,
          tabType: TabTypeConstant.ENTER_MOBILE_NUMBER,
          user: userToken,
        };
      });
      getAddress(setAddressAtom);
    }

    const token = localStorage.getItem("user_token");
    if (token) {
      getProfile(setProfileAtom);
    }
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Login />
      {isAccountOpen && <Account />}
      {/* {isGMapLoaded && isAddressOpen && <Address />} */}
      {isGMapLoaded && isAddressTimeSlotOpen && <AddressAndTimeSlot />}
      {/* {isGMapLoaded && isAddressListOpen && <AddressList />} */}
      <Script
        id="google-maps"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_KEY}&libraries=places`}
        onLoad={() => setIsGMapLoaded(true)}
      ></Script>
      <Component {...pageProps} />;
    </LocalizationProvider>
  );
}
