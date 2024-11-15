export type Order = {
  _id: string;
  order_id: number;
  type: string;
  __v: number;
  created_at: number;
  delivery_type: string;
  is_rated: boolean;
  is_repeat_order_enabled: boolean;
  item_details: any;
  item_images: string[];
  status: string;
  total: number;
  updated_at: number;
  user_id: number;
};

export type MetaData = {
  current_page: number;
  has_next_page: boolean;
  total: number;
};

export type ApiResponse = {
  data: Order[];
  meta: MetaData;
};
