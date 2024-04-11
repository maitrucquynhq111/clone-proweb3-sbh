type Commission = {
  id: string;
  sender_id: string;
  receiver_id: string;
  tracking_info: CommissionTrackingInfo;
  package_duration: string;
  trainer_name: string;
  commission_percent?: number | null;
  commission_amount?: number | null;
  payment_amount?: number | null;
  upgraded_at?: string | null;
};

type CommissionTrackingInfo = {
  status?: string | null;
  txn_code?: string | null;
  receiver_name: string;
  referral_code: string;
  sender_name?: string;
  payment_amount?: number | null;
  payment_method?: string | null;
  ref_phone_number: string;
  package_price_key?: string | null;
  receiver_phone_number?: string | null;
  user_tracking_package_id?: string | null;
};

type GetAffiliateListParams = {
  page: number;
  pageSize: number;
  start_time?: string;
  end_time?: string;
  filter_key?: string;
  sender_phone?: string;
  search: string;
  orderBy?: ExpectedAny;
  sort?: string;
};

type TrainerInfo = {
  id: string;
  user_id: string;
};
