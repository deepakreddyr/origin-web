interface FAQ {
  id: number;
  title: string;
  description: string;
}

export default interface ReferEarnResponse {
  referral_code: string;
  referral_message: string;
  referral_bonus: number;
  total_referrals: number;
  overall_coins_earned: number;
  faqs: FAQ[];
}
