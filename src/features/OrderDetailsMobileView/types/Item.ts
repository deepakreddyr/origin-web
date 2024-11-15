import type { OrderedUOM } from "./OrderUOM";

export interface Item {
  id: number;
  name: string;
  item_code: string;
  image: string;
  logo: string;
  ordered_uoms: OrderedUOM[];
}
