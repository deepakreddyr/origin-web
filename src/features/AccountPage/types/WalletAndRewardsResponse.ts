interface Transaction {
  id: number;
  order_id: number;
  order_type: string;
  wallet_id: number;
  reward_id: null;
  gift_card_id: null;
  transaction_type: string;
  transaction_mode: string;
  wallet_amount: null;
  reward_amount: number;
  total_wallet_balance: number;
  total_reward_balance: number;
  created_at: number;
  payment_status: "complete";
  transaction_message: string;
}

interface Data {
  id: number;
  wallet_balance: number;
  reward_balance: number;
  kyc_updated: boolean;
  transactions: Transaction[];
}

export default interface WalletAndRewardsResponse {
  data: Data;
  reward_balance: number;
  max_amount: number;
  default_amount_list: number[];
  wallet_info_url: string;
  rewards_info_url: string;
  max_redeemable_rewards: number;
}
