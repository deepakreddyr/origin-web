export interface CategoryItem {
  id: number;
  sequence: number;
  item_code: string;
  slug: string;
  website_image: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  name: string;
  logo: string;
  availability: boolean;
  extra_descriptions: ExtraDescription[];
  tag_url: string | null;
  is_greyed: boolean;
  is_disabled: boolean;
  multiple_uoms: MultipleUom[];
}

interface ExtraDescription {
  title: string;
  description: string;
}

interface MultipleUom {
  variant_id: number;
  uom_id: number;
  name: string | null;
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
  conversion_text: string | null;
  conv: number | null;
}
