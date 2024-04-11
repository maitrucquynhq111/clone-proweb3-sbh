/* eslint-disable @typescript-eslint/no-unused-vars */
type Payment = {
  balance: number;
  business_id: string;
  created_at: string;
  creator_id: string;
  id: string;
  is_default: boolean;
  name: string;
  priority: number;
  status: boolean;
  updated_at: string;
  updater_id: string;
};

type PendingPayment = {
  name: string;
  balance: number;
};

type LinkedBank = {
  sourceId: string;
  providerId: string;
  sourceName: string;
  sourceNumber: string;
  credentialType: string;
  bankCode: string;
  vaNumber: string;
  vietQR?: string;
};

type BankInfo = {
  bank_code?: string;
  bank_name?: string;
  name?: string;
  phone_number?: string;
  account_owner?: string;
  account_number?: string;
  account_name?: string;
};

type EPaymentMethod = {
  id: string;
  user_id: string;
  payment_type: string;
  payment_info: BankInfo;
};

type PaymentInfo = {
  id: string;
  user_id: string;
  business_id: string;
  payment_method: string;
  information: BankInfo;
};
