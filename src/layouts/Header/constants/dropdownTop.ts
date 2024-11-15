export const dropdownTop = {
  DETECT_LOCATION: "detect-location",
  SERVICEABILITY: "serviceability",
  AREA_LIST: "area-list",
};

type ValueOf<T> = T[keyof T];
export type DropdownTopType = ValueOf<typeof dropdownTop> | "";
