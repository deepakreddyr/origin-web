import type { OrderedUOM } from "./OrderUOM";

export interface Item {
  slice: any;
  length: any;
  id: number;
  name: string;
  item_code: string;
  image: string;
  logo: string;
  ordered_uoms: OrderedUOM[];
}
