import type Address from "./Address";

type AddressAtom = {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: Address[] | null;
};

export default AddressAtom;
