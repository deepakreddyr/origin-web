interface Transaction {
  id: number;
  order_id: number;
  order_type: string;
  wallet_id: number;
  reward_id: null;
  gift_card_id: null;
  transaction_type: 'minus';
  transaction_mode: 'reward';
  wallet_amount: null;
  reward_amount: number;
  total_wallet_balance: number;
  total_reward_balance: number;
  created_at: number;
  payment_status: 'complete';
  transaction_message: string;
}

interface Link {
  url: string | null;
  label: string;
  active: boolean;
}

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface TransactionListR {
  data: Transaction[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: Meta;
}

type TransactionListResponse = TransactionListR[];

export default TransactionListResponse;
