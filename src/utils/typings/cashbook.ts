/* eslint-disable @typescript-eslint/no-unused-vars */
type Cashbook = {
  amount: number;
  category_id: string;
  category_name: string;
  contact_id: string;
  business_has_shop_id: string;
  business_id: string;
  contact_transaction_id: string;
  created_at: string;
  creator_id: string;
  currency: string;
  day: string;
  description: string;
  ecom_transaction_id: string;
  id: string;
  images: Array<string>;
  object_key: string;
  object_type: string;
  payment_information: null;
  payment_method: string;
  payment_source_id: string;
  payment_source_name: string;
  payout_id: string;
  status: string;
  transaction_type: string;
  updated_at: string;
  updater_id: string;
  txn_type: string;
};

type CashbookTotalAmount = {
  has_transaction?: boolean;
  total_amount_in: number;
  total_amount_out: number;
  total_txn_out: number;
  total_txn_in: number;
  total_txn_out_overdue: number;
  total_amount_out_overdue: number;
  total_txn_in_overdue: number;
  total_amount_in_overdue: number;
};

type CashbookCategory = {
  description: string;
  id: string;
  is_active: boolean;
  name: string;
  priority: number;
  type: string;
};

type PendingCashbook = Pick<
  Cashbook,
  'amount' | 'business_id' | 'currency' | 'description' | 'payment_information' | 'transaction_type' | 'status'
> & {
  id?: string;
  images: Array<string | PendingUploadImage>;
  day: Date | string | null;
  contact_id?: string;
  category_id?: string;
  category_name?: string;
  payment_method?: string;
  payment_source_id?: string;
  payment_source_name?: string;
  is_debit?: boolean;
  object_key?: string;
  object_type?: string;
};

type PendingCashbookCategory = {
  name: string;
  type: string;
};
