import { atom } from "jotai";
import type { AutocompletePrediction } from "react-places-autocomplete";

import type { DropdownTopType } from "../constants/dropdownTop";
import { dropdownTop } from "../constants/dropdownTop";
import type { ServiceabilityCheckAtom } from "../types/ServiceabilityCheckAtom";

export const serviceabilityCheck = atom<ServiceabilityCheckAtom>({
  loading: false,
  success: false,
  error: false,
  isDeliverable: false,
});

export const suggestionsList = atom<AutocompletePrediction[]>([]);

export const isDropdownActive = atom<boolean>(false);
export const activeDropdownTop = atom<DropdownTopType>(dropdownTop.AREA_LIST);
export const activeDropdownBottom = atom<string>("");
