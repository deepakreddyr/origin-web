type UserProfile = {
  avatar: null | string;
  address: string;
  latitude: string;
  longitude: string;
  user_type: 'individual';
  deliverable: 1;
  wallet_enabled: boolean;
  reward_enabled: boolean;
  gender: null;
  dob: number; // Unix timestamp
};

export default UserProfile;
