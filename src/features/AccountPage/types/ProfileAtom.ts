import type User from "./User";

type ProfileAtom = {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: User | null;
};

export default ProfileAtom;
