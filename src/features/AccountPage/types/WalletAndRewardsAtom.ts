import type WalletAndRewardsResponse from './WalletAndRewardsResponse';

type WalletAndRewardsAtom = {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: WalletAndRewardsResponse | null;
};

export default WalletAndRewardsAtom;
