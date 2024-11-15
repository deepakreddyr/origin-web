export interface ProductList {
  id: number;
  name: string;
  product_count: number;
  image: string;
  products: Product[];
  empty_products_title?: string;
  empty_products_description?: string;
}

export interface Product {
  id: number;
  item_code: string;
  name: string;
  image: string;
  bg_color?: string;
  tag: Tag;
  navigation: Navigation;
  is_greyed: boolean;
  is_available: boolean;
  is_orderable: boolean;
  isOpen: boolean;
  multiple_uoms: MultipleUom[];
}

export interface Tag {
  title: string;
  bg_color: string;
  text_color: string;
  position: string;
}

export interface Navigation {
  to: string;
}

export interface MultipleUom {
  variant_id: number;
  uom_id: number;
  name: string;
  unit: string;
  minimum_quantity: number;
  maximum_quantity: number;
  is_visible: boolean;
  is_available: boolean;
  is_default: boolean;
  price: number;
  platform_id: number;
  formatted_price: string;
  cart_quantity: number;
  conversion_text: any;
  conv: any;
}
