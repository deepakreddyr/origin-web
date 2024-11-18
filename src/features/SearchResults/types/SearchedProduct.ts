interface Navigation {
  to: string;
}

export interface SearchedItem {
  description: string;
  id: number;
  item_code: string;
  name: string;
  image: string;
  bg_color: string;
  navigation: Navigation;
  is_greyed: boolean;
  is_available: boolean;
  is_orderable: boolean;
  availability: boolean;
  // multiple_uoms: MultipleUom[];
}

export interface SearchedProductResponse {
  go_to_items: SearchedItem[];
  trending_items: SearchedItem[];
}
