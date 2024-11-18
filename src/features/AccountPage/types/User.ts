import type UserProfile from "./UserProfile";

type User = {
  name: string;
  email: string;
  phone: string;
  status: "active";
  enable_instant_delivery: boolean;
  items_range_instant: string;
  items_range_next_day: string;
  reward_enabled: boolean;
  profile: UserProfile;
};

export default User;
