import { atom } from 'jotai';

import type AddressResponse from '../../AccountPage/types/Address';
import GoBack from '../enums/GoBack';
import TabType from '../enums/TabType';
import type Address from '../types/Address';
import type SaveAddressAtomI from '../types/SaveAddressAtomI';

export const isAddressIsOpen = atom<boolean>(false);

export const addressSidebarDetails = atom<{ tabType: TabType }>({
  tabType: TabType.ADDRESS_SELECTION
});

export const addressDetailsAtom = atom<Address>({
  address_name: '',
  formatted_address: '',
  address: '',
  door_no: '',
  locality: '',
  landmark: '',
  latitude: 0,
  longitude: 0,
  deliverable: false,
  address_id: null
});

export const saveAddressAtom = atom<SaveAddressAtomI>({
  isSaved: false,
  loading: false,
  success: false,
  error: false,
  data: null
});

export const isEditingAddress = atom<{
  isActive: boolean;
  addressDetails: AddressResponse | null;
}>({
  isActive: false,
  addressDetails: null
});

export const goBackToAddressAtom = atom<GoBack>(GoBack.PAYMENT_SIDEBAR);
