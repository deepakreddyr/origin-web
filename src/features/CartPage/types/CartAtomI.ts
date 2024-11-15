export default interface CartAtomI {
  loading: boolean;
  success: boolean;
  error: boolean;
  cart: any;
  cartValues: {
    timeSlotId?: string | number;
    timeSlotError?: string | null;
    alternateNumber?: string;
    isAlternateNumberOpen?: boolean;
  } | null;
}
