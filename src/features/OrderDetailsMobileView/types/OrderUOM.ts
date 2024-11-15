export interface OrderedUOM {
  variant_id: number;
  uom_id: number;
  cart_quantity: number;
  subtotal: number;
  price: number;
  market_price: number;
  market_price_sub_total: number;
  unit: string;
  ripeness: string;
}
