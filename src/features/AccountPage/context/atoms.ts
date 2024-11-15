import {
  ManageAddressScreenKeys,
  manageAddressScreens,
} from "./../enums/ActiveSidebar";
import { atom } from "jotai";

import type Address from "../../Address/types/Address";
import ActiveSidebar from "../enums/ActiveSidebar";
import type AddressAtom from "../types/AddressAtom";
import type { Order } from "../types/Order";
import type OrdersAtom from "../types/OrdersAtom";
import type ProfileAtom from "../types/ProfileAtom";
import type RecentOrderAtom from "../types/RecentOrdersAtom";
import type ReferEarnAtom from "../types/ReferEarnAtom";
import type SupportChatAtom from "../types/SupprtChatAtom";
import type TransactionListAtom from "../types/TransactionListAtom";
import type WalletAndRewardsAtom from "../types/WalletAndRewardsAtom";

export const isAccountIsOpen = atom<boolean>(false);

export const profileAtom = atom<ProfileAtom>({
  loading: false,
  success: false,
  error: false,
  data: null,
});

export const ordersAtom = atom<OrdersAtom>({
  loading: false,
  success: false,
  error: false,
  data: null,
});

export const addressAtom = atom<AddressAtom>({
  loading: false,
  success: false,
  error: false,
  data: null,
});

export const walletAndRewardAtom = atom<WalletAndRewardsAtom>({
  loading: false,
  success: false,
  error: false,
  data: null,
});

export const transactionListAtom = atom<TransactionListAtom>({
  loading: false,
  success: false,
  error: false,
  data: null,
});

export const referEarnAtom = atom<ReferEarnAtom>({
  loading: false,
  success: false,
  error: false,
  data: null,
});

export const recentOrderAtom = atom<RecentOrderAtom>({
  loading: false,
  success: false,
  error: false,
  data: null,
});

export const supportChatAtom = atom<SupportChatAtom>({
  loading: false,
  success: false,
  error: false,
  data: null,
});

export const activeSupportChatAtom = atom<string | null>(null);

export const postSupportChatAtom = atom<SupportChatAtom>({
  loading: false,
  success: false,
  error: false,
  data: null,
});

export const deletingAddressAtom = atom<{
  isActive: boolean;
  addressDetails: Address | null;
}>({
  isActive: false,
  addressDetails: null,
});

export const activeAccountsPageAtom = atom<ActiveSidebar>(
  ActiveSidebar.MANAGE_ADDRESS
);

export const addressActiveScreenAtom = atom<ManageAddressScreenKeys>(
  manageAddressScreens.ADDRESS_LIST
);

export const rateOrderAtom = atom<Order | null>(null);
