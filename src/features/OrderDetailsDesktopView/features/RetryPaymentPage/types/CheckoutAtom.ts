import type Checkout from "./checkout";

export default interface CheckoutAtom {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: Checkout | {};
}
