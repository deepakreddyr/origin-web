import { atom } from 'jotai';
import type { AutocompletePrediction } from 'react-places-autocomplete';

import TabType from '../enums/TabType';
import type AddressAtomI from '../types/AddressAtomI';

export const isAddressListIsOpen = atom<boolean>(false);

export const addressSidebarDetails = atom<{ tabType: TabType }>({
  tabType: TabType.ADDRESS_SELECTION
});

export const searchAddress = atom<string>('');

export const addressAtom = atom<AddressAtomI>({
  loading: false,
  success: false,
  error: false,
  address: null,
  defaultAddress: null
});
//h1

export const suggestionsList = atom<AutocompletePrediction[]>([]);
